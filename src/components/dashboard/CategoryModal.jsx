import React, { useState, useEffect } from "react";
import "./CategoryModal.css";
import { uploadSingleImage, deleteImage } from "../../utils/imageUpload";

const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  categoryType,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    bookingLimit: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || "",
        description: editingCategory.description || "",
        image: editingCategory.image || "",
        price: editingCategory.price || "",
        bookingLimit: editingCategory.bookingLimit || "",
      });
      setImagePreview(editingCategory.image || "");
    } else {
      setFormData({
        name: "",
        description: "",
        image: "",
        price: "",
        bookingLimit: "",
      });
      setImagePreview("");
    }
    setImageFile(null);
    setErrors({});
  }, [editingCategory, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم التصنيف مطلوب";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "اسم التصنيف يجب أن يكون على الأقل حرفين";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "الوصف يجب أن يكون أقل من 500 حرف";
    }

    // Validate price for service categories
    if (categoryType === "service") {
      if (!formData.price.trim()) {
        newErrors.price = "السعر العام مطلوب";
      } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
        newErrors.price = "السعر يجب أن يكون رقم موجب";
      }

      // Validate booking limit
      if (!formData.bookingLimit.trim()) {
        newErrors.bookingLimit = "حد الحجوزات المتزامنة مطلوب";
      } else if (
        isNaN(formData.bookingLimit) ||
        parseInt(formData.bookingLimit) <= 0
      ) {
        newErrors.bookingLimit = "الحد يجب أن يكون رقم صحيح موجب";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors({ image: "يرجى اختيار صورة فقط" });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ image: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت" });
        return;
      }

      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleDeleteImage = async () => {
    if (formData.image) {
      try {
        setUploadingImage(true);
        await deleteImage(formData.image);
        setFormData((prev) => ({ ...prev, image: "" }));
        setImagePreview("");
        setImageFile(null);
      } catch (error) {
        console.error("Error deleting image:", error);
        setErrors({ image: "فشل حذف الصورة" });
      } finally {
        setUploadingImage(false);
      }
    } else {
      setImagePreview("");
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = formData.image;

      // Upload image if service category and new image selected
      if (categoryType === "service" && imageFile) {
        setUploadingImage(true);
        const categoryId = editingCategory?.id || `category_${Date.now()}`;

        // Delete old image if editing
        if (editingCategory?.image) {
          try {
            await deleteImage(editingCategory.image);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }

        // Upload new image
        const uploadedImage = await uploadSingleImage(
          imageFile,
          "categories",
          categoryId
        );
        imageUrl = uploadedImage.url;
        setUploadingImage(false);
      }

      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: imageUrl,
        price: categoryType === "service" ? formData.price.trim() : "",
        bookingLimit:
          categoryType === "service"
            ? parseInt(formData.bookingLimit.trim())
            : 0,
      });
      onClose();
    } catch (error) {
      console.error("Error submitting category:", error);
      setErrors({ submit: "حدث خطأ أثناء حفظ التصنيف" });
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="category-modal-overlay" onClick={onClose}>
      <div className="category-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {editingCategory ? "تعديل" : "إضافة"} تصنيف{" "}
            {categoryType === "product" ? "المنتجات" : "الخدمات"}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="name">اسم التصنيف *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
              placeholder="أدخل اسم التصنيف"
              maxLength={100}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">الوصف (اختياري)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
              placeholder="أدخل وصف التصنيف"
              rows={4}
              maxLength={500}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
            <small className="char-count">
              {formData.description.length}/500 حرف
            </small>
          </div>

          {/* Price - Only for Service Categories */}
          {categoryType === "service" && (
            <div className="form-group">
              <label htmlFor="price">
                السعر العام (شيكل) <span className="required">*</span>
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers and decimal point
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    setFormData({ ...formData, price: value });
                    if (errors.price) {
                      setErrors({ ...errors, price: "" });
                    }
                  }
                }}
                placeholder="مثال: 100"
                className={errors.price ? "error" : ""}
              />
              {errors.price && (
                <span className="error-message">{errors.price}</span>
              )}
              <small className="field-note">
                هذا السعر العام سيظهر في صفحة الخدمات. السعر النهائي قد يختلف
                حسب الخصومات.
              </small>
            </div>
          )}

          {/* Booking Limit - Only for Service Categories */}
          {categoryType === "service" && (
            <div className="form-group">
              <label htmlFor="bookingLimit">
                حد الحجوزات المتزامنة <span className="required">*</span>
              </label>
              <input
                type="number"
                id="bookingLimit"
                name="bookingLimit"
                value={formData.bookingLimit}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only positive integers
                  if (
                    value === "" ||
                    (/^\d+$/.test(value) && parseInt(value) >= 0)
                  ) {
                    setFormData({ ...formData, bookingLimit: value });
                    if (errors.bookingLimit) {
                      setErrors({ ...errors, bookingLimit: "" });
                    }
                  }
                }}
                placeholder="مثال: 3"
                min="1"
                className={errors.bookingLimit ? "error" : ""}
              />
              {errors.bookingLimit && (
                <span className="error-message">{errors.bookingLimit}</span>
              )}
              <small className="field-note">
                الحد الأقصى لعدد الحجوزات المسموح بها في نفس الوقت. يعتمد على
                عدد الأخصائيات المتاحات لهذا التصنيف.
              </small>
            </div>
          )}

          {/* Image Upload - Only for Service Categories */}
          {categoryType === "service" && (
            <div className="form-group">
              <label htmlFor="image">صورة التصنيف (اختياري)</label>
              <div className="image-upload-section">
                {!imagePreview ? (
                  <div className="upload-area">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="file-input"
                    />
                    <label htmlFor="image" className="upload-label">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>اضغط لاختيار صورة</span>
                      <small>PNG, JPG, JPEG (حد أقصى 5MB)</small>
                    </label>
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <img
                      src={imagePreview}
                      alt="معاينة"
                      className="preview-image"
                    />
                    <button
                      type="button"
                      className="delete-image-btn"
                      onClick={handleDeleteImage}
                      disabled={uploadingImage}
                    >
                      <i className="fas fa-trash"></i>
                      حذف الصورة
                    </button>
                  </div>
                )}
              </div>
              {errors.image && (
                <span className="error-message">{errors.image}</span>
              )}
            </div>
          )}

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || uploadingImage}
            >
              {uploadingImage ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  جاري رفع الصورة...
                </>
              ) : isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  جاري الحفظ...
                </>
              ) : (
                <>{editingCategory ? "تحديث" : "إضافة"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
