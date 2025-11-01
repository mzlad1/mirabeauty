import React, { useState, useEffect } from "react";
import "./ServiceEditModal.css";
import { 
  uploadMultipleImages, 
  deleteImage, 
  setPrimaryImage, 
  getPrimaryImage,
  validateImageFile 
} from "../../utils/imageUpload";

const ServiceEditModal = ({ isOpen, onClose, onSubmit, service }) => {
  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    price: service?.price || "",
    duration: service?.duration || "",
    category: service?.category || "",
    categoryName: service?.categoryName || "",
    images: service?.images || [],
    primaryImageIndex: service?.primaryImageIndex || 0,
    icon: service?.icon || "",
    popular: service?.popular || false,
    sessions: service?.sessions || "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        price: service.price || "",
        duration: service.duration || "",
        category: service.category || "",
        categoryName: service.categoryName || "",
        images: service.images || [],
        primaryImageIndex: service.primaryImageIndex || 0,
        icon: service.icon || "",
        popular: service.popular || false,
        sessions: service.sessions || "",
      });
    } else {
      // Reset form for new service
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        category: "",
        categoryName: "",
        images: [],
        primaryImageIndex: 0,
        icon: "",
        popular: false,
        sessions: "",
      });
      setSelectedFiles([]);
    }
  }, [service]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalFormData = { ...formData };

      // Upload new images if any
      if (selectedFiles.length > 0) {
        setUploadingImages(true);
        const uploadedImages = await uploadMultipleImages(
          selectedFiles,
          `services/${service?.id || 'new'}`
        );
        finalFormData.images = [...finalFormData.images, ...uploadedImages];
        setUploadingImages(false);
      }

      // Ensure we have at least one image for new services
      if (!service && finalFormData.images.length === 0) {
        alert("يجب إضافة صورة واحدة على الأقل");
        return;
      }

      await onSubmit(finalFormData);
      onClose();
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error submitting service edit:", error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];

    for (const file of files) {
      if (validateImageFile(file)) {
        validFiles.push(file);
      } else {
        alert(`الملف ${file.name} غير صالح. يجب أن يكون صورة أقل من 5MB`);
      }
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (index) => {
    const imageToRemove = formData.images[index];
    try {
      await deleteImage(imageToRemove.url);
      const newImages = formData.images.filter((_, i) => i !== index);
      let newPrimaryIndex = formData.primaryImageIndex;
      
      // Adjust primary index if needed
      if (index === formData.primaryImageIndex) {
        newPrimaryIndex = 0;
      } else if (index < formData.primaryImageIndex) {
        newPrimaryIndex = formData.primaryImageIndex - 1;
      }

      setFormData(prev => ({
        ...prev,
        images: newImages,
        primaryImageIndex: newPrimaryIndex
      }));
    } catch (error) {
      console.error("Error removing image:", error);
      alert("حدث خطأ أثناء حذف الصورة");
    }
  };

  const setPrimaryImageIndex = (index) => {
    setFormData(prev => ({
      ...prev,
      primaryImageIndex: index
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="service-edit-modal-overlay">
      <div className="service-edit-modal">
        <div className="service-edit-modal-header">
          <h3>{service ? "تعديل خدمة" : "إضافة خدمة"}</h3>
          <button className="service-edit-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="service-edit-modal-form">
          <div className="service-edit-form-row">
            <div className="service-edit-form-group">
              <label htmlFor="name">اسم الخدمة *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="service-edit-form-input"
              />
            </div>
          </div>

          <div className="service-edit-form-row">
            <div className="service-edit-form-group">
              <label htmlFor="description">الوصف *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="service-edit-form-textarea"
                rows="3"
              />
            </div>
          </div>

          <div className="service-edit-form-row-2">
            <div className="service-edit-form-group">
              <label htmlFor="price">السعر *</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="service-edit-form-input"
                placeholder="مثال: 200 شيكل"
              />
            </div>

            <div className="service-edit-form-group">
              <label htmlFor="duration">المدة *</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="service-edit-form-input"
                placeholder="مثال: 60 دقيقة"
              />
            </div>
          </div>

          <div className="service-edit-form-row-2">
            <div className="service-edit-form-group">
              <label htmlFor="category">رمز الفئة *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="service-edit-form-input"
              >
                <option value="">اختر الفئة</option>
                <option value="laser">ليزر</option>
                <option value="skincare">عناية بالبشرة</option>
                <option value="body">نحت الجسم</option>
                <option value="facial">عناية بالوجه</option>
              </select>
            </div>

            <div className="service-edit-form-group">
              <label htmlFor="categoryName">اسم الفئة *</label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                required
                className="service-edit-form-input"
                placeholder="مثال: الليزر"
              />
            </div>
          </div>

          <div className="service-edit-form-row">
            <div className="service-edit-form-group">
              <label htmlFor="sessions">عدد الجلسات *</label>
              <input
                type="text"
                id="sessions"
                name="sessions"
                value={formData.sessions}
                onChange={handleChange}
                required
                className="service-edit-form-input"
                placeholder="مثال: 6-8 جلسات"
              />
            </div>
          </div>

          <div className="service-edit-form-row">
            <div className="service-edit-form-group">
              <label>الصور *</label>
              
              {/* File Upload */}
              <div className="image-upload-section">
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="image-upload-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="imageUpload" className="image-upload-button">
                  <span>اختر صور</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </label>
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="selected-files-preview">
                  <h4>الصور المحددة للرفع:</h4>
                  <div className="files-grid">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="file-preview-item">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name}
                          className="file-preview-image"
                        />
                        <div className="file-preview-info">
                          <span className="file-name">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            className="remove-file-btn"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Images */}
              {formData.images.length > 0 && (
                <div className="existing-images">
                  <h4>الصور الحالية:</h4>
                  <div className="images-grid">
                    {formData.images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img 
                          src={image.url} 
                          alt={`صورة ${index + 1}`}
                          className="existing-image"
                        />
                        <div className="image-controls">
                          <button
                            type="button"
                            onClick={() => setPrimaryImageIndex(index)}
                            className={`primary-btn ${index === formData.primaryImageIndex ? 'active' : ''}`}
                          >
                            {index === formData.primaryImageIndex ? 'صورة رئيسية' : 'جعل رئيسية'}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="remove-image-btn"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadingImages && (
                <div className="upload-progress">
                  <span>جاري رفع الصور...</span>
                </div>
              )}
            </div>
          </div>

          <div className="service-edit-form-row">
            <div className="service-edit-form-group">
              <label htmlFor="icon">رابط الأيقونة (اختياري)</label>
              <input
                type="url"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="service-edit-form-input"
                placeholder="https://example.com/icon.jpg"
              />
            </div>
          </div>

          <div className="service-edit-form-row">
            <div className="service-edit-form-group service-edit-checkbox-group">
              <label className="service-edit-checkbox-label">
                <input
                  type="checkbox"
                  name="popular"
                  checked={formData.popular}
                  onChange={handleChange}
                />
                خدمة مميزة (Popular)
              </label>
            </div>
          </div>

          <div className="service-edit-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="service-edit-btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="service-edit-btn-primary"
              disabled={loading}
            >
              {loading ? "جاري الحفظ..." : service ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceEditModal;
