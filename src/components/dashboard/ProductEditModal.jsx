import React, { useState, useEffect } from "react";
import "./ProductEditModal.css";

const ProductEditModal = ({ isOpen, onClose, onSubmit, product }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    category: product?.category || "",
    categoryName: product?.categoryName || "",
    brand: product?.brand || "",
    image: product?.image || "",
    inStock: product?.inStock !== undefined ? product.inStock : true,
    rating: product?.rating || 4.5,
    reviewsCount: product?.reviewsCount || 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        category: product.category || "",
        categoryName: product.categoryName || "",
        brand: product.brand || "",
        image: product.image || "",
        inStock: product.inStock !== undefined ? product.inStock : true,
        rating: product.rating || 4.5,
        reviewsCount: product.reviewsCount || 0,
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting product edit:", error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
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
    <div className="product-edit-modal-overlay">
      <div className="product-edit-modal">
        <div className="product-edit-modal-header">
          <h3>{product ? "تعديل منتج" : "إضافة منتج"}</h3>
          <button className="product-edit-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-edit-modal-form">
          <div className="product-edit-form-row">
            <div className="product-edit-form-group">
              <label htmlFor="name">اسم المنتج *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="product-edit-form-input"
              />
            </div>
          </div>

          <div className="product-edit-form-row">
            <div className="product-edit-form-group">
              <label htmlFor="description">الوصف *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="product-edit-form-textarea"
                rows="3"
              />
            </div>
          </div>

          <div className="product-edit-form-row-2">
            <div className="product-edit-form-group">
              <label htmlFor="price">السعر *</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="product-edit-form-input"
                placeholder="مثال: 150 شيكل"
              />
            </div>

            <div className="product-edit-form-group">
              <label htmlFor="originalPrice">السعر الأصلي (اختياري)</label>
              <input
                type="text"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="product-edit-form-input"
                placeholder="مثال: 180 شيكل"
              />
            </div>
          </div>

          <div className="product-edit-form-row-2">
            <div className="product-edit-form-group">
              <label htmlFor="category">رمز الفئة *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="product-edit-form-input"
              >
                <option value="">اختر الفئة</option>
                <option value="skincare">عناية بالبشرة</option>
                <option value="anti-aging">مكافحة الشيخوخة</option>
                <option value="whitening">تفتيح البشرة</option>
                <option value="serums">سيروم</option>
                <option value="masks">ماسكات</option>
                <option value="eye-care">عناية بالعين</option>
                <option value="sunscreen">واقي الشمس</option>
                <option value="body-care">عناية بالجسم</option>
              </select>
            </div>

            <div className="product-edit-form-group">
              <label htmlFor="categoryName">اسم الفئة *</label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                required
                className="product-edit-form-input"
                placeholder="مثال: العناية بالبشرة"
              />
            </div>
          </div>

          <div className="product-edit-form-row-2">
            <div className="product-edit-form-group">
              <label htmlFor="brand">العلامة التجارية *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="product-edit-form-input"
                placeholder="مثال: ميرا بيوتي"
              />
            </div>

            <div className="product-edit-form-group">
              <label htmlFor="rating">التقييم (1-5)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="product-edit-form-input"
              />
            </div>
          </div>

          <div className="product-edit-form-row">
            <div className="product-edit-form-group">
              <label htmlFor="image">رابط الصورة *</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="product-edit-form-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="product-edit-form-row">
            <div className="product-edit-form-group product-edit-checkbox-group">
              <label className="product-edit-checkbox-label">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                />
                متوفر في المخزون
              </label>
            </div>
          </div>

          <div className="product-edit-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="product-edit-btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="product-edit-btn-primary"
              disabled={loading}
            >
              {loading ? "جاري الحفظ..." : product ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
