import React, { useState, useEffect } from "react";
import "./SkinTypeModal.css";

const SkinTypeModal = ({ isOpen, onClose, onSubmit, skinType = null }) => {
  const [formData, setFormData] = useState({
    value: skinType?.value || "",
    label: skinType?.label || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skinType) {
      setFormData({
        value: skinType.value || "",
        label: skinType.label || "",
      });
    } else {
      setFormData({
        value: "",
        label: "",
      });
    }
    setErrors({});
  }, [skinType, isOpen]);

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

  const validate = () => {
    const newErrors = {};

    if (!formData.value.trim()) {
      newErrors.value = "القيمة مطلوبة";
    } else if (!/^[a-z0-9-_]+$/i.test(formData.value)) {
      newErrors.value =
        "القيمة يجب أن تحتوي على حروف إنجليزية وأرقام وشرطات فقط";
    }

    if (!formData.label.trim()) {
      newErrors.label = "الاسم بالعربي مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        value: formData.value.trim().toLowerCase(),
        label: formData.label.trim(),
      });
      onClose();
    } catch (error) {
      console.error("Error submitting skin type:", error);
      setErrors({ submit: "حدث خطأ أثناء حفظ نوع البشرة" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="skin-type-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{skinType ? "تعديل نوع البشرة" : "إضافة نوع بشرة جديد"}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="skin-type-form">
          <div className="form-group">
            <label htmlFor="value">
              القيمة (بالإنجليزية) *
              {skinType && (
                <small className="field-note">
                  لا يمكن تعديل القيمة بعد الإنشاء
                </small>
              )}
            </label>
            <input
              type="text"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              disabled={!!skinType || loading}
              placeholder="مثال: oily"
              className={errors.value ? "error" : ""}
            />
            {errors.value && (
              <span className="field-error">{errors.value}</span>
            )}
            <small className="field-hint">
              استخدم الحروف الإنجليزية الصغيرة والأرقام والشرطات فقط
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="label">الاسم بالعربي *</label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleChange}
              disabled={loading}
              placeholder="مثال: دهنية"
              className={errors.label ? "error" : ""}
            />
            {errors.label && (
              <span className="field-error">{errors.label}</span>
            )}
          </div>

          {errors.submit && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {errors.submit}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              إلغاء
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <i className="fas fa-save" style={{color:"var(--white)"}}></i>
                  {skinType ? "حفظ التعديلات" : "إضافة"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkinTypeModal;
