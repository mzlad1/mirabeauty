import React, { useState, useEffect } from "react";
import "./FAQTypeModal.css";

const FAQTypeModal = ({ isOpen, onClose, onSubmit, faqType }) => {
  const [formData, setFormData] = useState({
    value: "",
    label: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (faqType) {
      setFormData({
        value: faqType.value || "",
        label: faqType.label || "",
      });
    } else {
      setFormData({
        value: "",
        label: "",
      });
    }
    setErrors({});
  }, [faqType, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.value.trim()) {
      newErrors.value = "القيمة مطلوبة (بالإنجليزية)";
    } else if (!/^[a-z0-9-_]+$/i.test(formData.value)) {
      newErrors.value = "القيمة يجب أن تحتوي على حروف إنجليزية وأرقام فقط";
    }

    if (!formData.label.trim()) {
      newErrors.label = "الاسم مطلوب (بالعربية)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="faq-type-modal-overlay" onClick={onClose}>
      <div className="faq-type-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{faqType ? "تعديل نوع الأسئلة" : "إضافة نوع جديد"}</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="faq-type-modal-form">
          <div className="faq-type-form-group">
            <label className="faq-type-form-label">
              القيمة (بالإنجليزية) <span className="faq-type-required">*</span>
            </label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="مثال: general"
              disabled={!!faqType} // Disable editing value for existing types
              className={
                errors.value
                  ? "faq-type-input faq-type-error"
                  : "faq-type-input"
              }
              style={
                faqType
                  ? { backgroundColor: "#f5f5f5", cursor: "not-allowed" }
                  : {}
              }
            />
            {errors.value && (
              <span className="faq-type-error-message">{errors.value}</span>
            )}
            <small className="faq-type-hint">
              القيمة المستخدمة في قاعدة البيانات (حروف إنجليزية وأرقام فقط)
            </small>
          </div>

          <div className="faq-type-form-group">
            <label className="faq-type-form-label">
              الاسم (بالعربية) <span className="faq-type-required">*</span>
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="مثال: عام"
              className={
                errors.label
                  ? "faq-type-input faq-type-error"
                  : "faq-type-input"
              }
            />
            {errors.label && (
              <span className="faq-type-error-message">{errors.label}</span>
            )}
            <small className="faq-type-hint">الاسم الذي سيظهر للمستخدمين</small>
          </div>

          <div className="faq-type-modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="faq-btn-primary">
              {faqType ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FAQTypeModal;
