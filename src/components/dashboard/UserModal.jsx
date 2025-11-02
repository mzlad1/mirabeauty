import React, { useState, useEffect } from "react";
import "./UserModal.css";

const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  user = null,
  userType = "customer", // "customer" or "staff"
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "", // Only for new users
    avatar: user?.avatar || "/assets/default-avatar.jpg",
    specialization: user?.specialization || "",
    active: user?.active !== undefined ? user.active : true,
    // Customer specific fields
    birthDate: user?.birthDate || "",
    skinType: user?.skinType || "",
    allergies: user?.allergies
      ? Array.isArray(user.allergies)
        ? user.allergies.join(", ")
        : user.allergies
      : "",
    ...user,
  });

  const skinTypes = [
    { value: "", label: "اختاري نوع البشرة" },
    { value: "normal", label: "عادية" },
    { value: "dry", label: "جافة" },
    { value: "oily", label: "دهنية" },
    { value: "combination", label: "مختلطة" },
    { value: "sensitive", label: "حساسة" },
  ];

  const [loading, setLoading] = useState(false);

  // Reset form data when user or modal opens
  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "", // Always empty for security
      avatar: user?.avatar || "/assets/default-avatar.jpg",
      specialization: user?.specialization || "",
      active: user?.active !== undefined ? user.active : true,
      // Customer specific fields
      birthDate: user?.birthDate || "",
      skinType: user?.skinType || "",
      allergies: user?.allergies
        ? Array.isArray(user.allergies)
          ? user.allergies.join(", ")
          : user.allergies
        : "",
      ...user,
    });
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare submit data
      const submitData = {
        ...formData,
        avatar: formData.avatar || "/assets/default-avatar.jpg",
      };

      // For customers, handle allergies array
      if (userType === "customer") {
        submitData.allergies = formData.allergies
          ? formData.allergies
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item)
          : ["لا توجد"];
      }

      // Only include password for new users
      if (!user && formData.password) {
        submitData.password = formData.password;
      } else if (!user) {
        // Use default password if not provided
        submitData.password = "LaserBooking2024!";
      } else {
        // Remove password field for existing users
        delete submitData.password;
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Error submitting user form:", error);
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
    <div className="admin-user-modal-overlay" onClick={onClose}>
      <div className="admin-user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-user-modal-header">
          <h3>
            {user ? "تعديل" : "إضافة"}{" "}
            {userType === "customer" ? "عميل" : "موظف"}
          </h3>
          <button className="admin-user-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-user-modal-form">
          <div className="admin-user-form-row">
            <div className="admin-user-form-group">
              <label htmlFor="name">الاسم الكامل *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="admin-user-form-input"
              />
            </div>
          </div>

          <div className="admin-user-form-row">
            <div className="admin-user-form-group">
              <label htmlFor="email">البريد الإلكتروني *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="admin-user-form-input"
              />
            </div>
          </div>

          <div className="admin-user-form-row">
            <div className="admin-user-form-group">
              <label htmlFor="phone">رقم الهاتف *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="admin-user-form-input"
                placeholder="+970XXXXXXXXX أو 059XXXXXXX"
              />
            </div>
          </div>

          {!user && (
            <div className="admin-user-form-row">
              <div className="admin-user-form-group">
                <label htmlFor="password">كلمة المرور *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!user}
                  className="admin-user-form-input"
                  placeholder="اتركها فارغة لاستخدام كلمة مرور افتراضية"
                />
                <small style={{ color: "#666", fontSize: "0.85rem" }}>
                  إذا تُركت فارغة، ستكون كلمة المرور الافتراضية:
                  LaserBooking2024!
                </small>
              </div>
            </div>
          )}

          {userType === "customer" && (
            <>
              <div className="admin-user-form-row">
                <div className="admin-user-form-group">
                  <label htmlFor="birthDate">تاريخ الميلاد *</label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    className="admin-user-form-input"
                  />
                </div>
              </div>

              <div className="admin-user-form-row">
                <div className="admin-user-form-group">
                  <label htmlFor="skinType">نوع البشرة *</label>
                  <select
                    id="skinType"
                    name="skinType"
                    value={formData.skinType}
                    onChange={handleChange}
                    required
                    className="admin-user-form-input"
                  >
                    {skinTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-user-form-row">
                <div className="admin-user-form-group">
                  <label htmlFor="allergies">الحساسيات (اختياري)</label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="admin-user-form-input"
                    placeholder="مثل: حساسية من مواد معينة، أدوية، إلخ... أو اكتبي 'لا توجد'"
                    rows="3"
                  />
                </div>
              </div>
            </>
          )}

          {userType === "staff" && (
            <div className="admin-user-form-row">
              <div className="admin-user-form-group">
                <label htmlFor="specialization">التخصص *</label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  className="admin-user-form-input"
                  placeholder="مثل: أخصائية ليزر، أخصائية بشرة"
                />
              </div>
            </div>
          )}

          <div className="admin-user-form-row">
            <div className="admin-user-form-group">
              <label htmlFor="avatar">رابط الصورة الشخصية (اختياري)</label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={
                  formData.avatar === "/assets/default-avatar.jpg"
                    ? ""
                    : formData.avatar
                }
                onChange={handleChange}
                className="admin-user-form-input"
                placeholder="https://example.com/image.jpg (سيتم استخدام صورة افتراضية إذا تُركت فارغة)"
              />
            </div>
          </div>

          {userType === "staff" && (
            <div className="admin-user-form-row">
              <div className="admin-user-form-group admin-user-checkbox-group">
                <label className="admin-user-checkbox-label">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  موظف نشط
                </label>
              </div>
            </div>
          )}

          <div className="admin-user-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="admin-user-btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="admin-user-btn-primary"
              disabled={loading}
            >
              {loading ? "جاري الحفظ..." : user ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
