import React, { useState, useEffect } from "react";
import "./ServiceEditModal.css";

const ServiceEditModal = ({ isOpen, onClose, onSubmit, service }) => {
  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    price: service?.price || "",
    duration: service?.duration || "",
    category: service?.category || "",
    categoryName: service?.categoryName || "",
    image: service?.image || "",
    icon: service?.icon || "",
    popular: service?.popular || false,
    sessions: service?.sessions || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        price: service.price || "",
        duration: service.duration || "",
        category: service.category || "",
        categoryName: service.categoryName || "",
        image: service.image || "",
        icon: service.icon || "",
        popular: service.popular || false,
        sessions: service.sessions || "",
      });
    }
  }, [service]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting service edit:", error);
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
              <label htmlFor="image">رابط الصورة *</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="service-edit-form-input"
                placeholder="https://example.com/image.jpg"
              />
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
