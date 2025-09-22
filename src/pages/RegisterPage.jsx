import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    skinType: "",
    allergies: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const skinTypes = [
    { value: "", label: "اختاري نوع بشرتك" },
    { value: "normal", label: "عادية" },
    { value: "dry", label: "جافة" },
    { value: "oily", label: "دهنية" },
    { value: "combination", label: "مختلطة" },
    { value: "sensitive", label: "حساسة" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "الاسم مطلوب";
    } else if (formData.name.length < 2) {
      newErrors.name = "الاسم يجب أن يكون حرفين على الأقل";
    }

    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.phone) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^[+966|0]\d{9,10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "تاريخ الميلاد مطلوب";
    } else {
      const age =
        new Date().getFullYear() - new Date(formData.birthDate).getFullYear();
      if (age < 16) {
        newErrors.birthDate = "يجب أن يكون العمر 16 سنة على الأقل";
      }
    }

    if (!formData.skinType) {
      newErrors.skinType = "نوع البشرة مطلوب";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "يجب الموافقة على الشروط والأحكام";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Create new user object
      const newUser = {
        id: Date.now(), // Simple ID generation for demo
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        skinType: formData.skinType,
        allergies: formData.allergies || ["لا توجد"],
        role: "customer",
        joinDate: new Date().toISOString(),
        active: true,
        appointmentsCount: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        avatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=761&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      };

      setCurrentUser(newUser);
      navigate("/profile");
      setLoading(false);
    }, 1000);
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 16);
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="register-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>إنشاء حساب جديد</h1>
          <p>انضمي إلى عائلة ميرا بيوتي واستمتعي بخدماتنا المميزة</p>
        </div>
      </div>

      {/* Register Content */}
      <section className="register-content section">
        <div className="container">
          <div className="register-layout">
            {/* Registration Form */}
            <div className="register-form-container">
              <div className="form-header">
                <h2>معلوماتك الشخصية</h2>
                <p>املئي البيانات التالية لإنشاء حسابك</p>
              </div>

              <form onSubmit={handleSubmit} className="register-form">
                {/* Personal Information */}
                <div className="form-section">
                  <h3>المعلومات الأساسية</h3>

                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`form-input ${errors.name ? "error" : ""}`}
                      placeholder="أدخلي اسمك الكامل"
                      disabled={loading}
                    />
                    {errors.name && (
                      <span className="field-error">{errors.name}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`form-input ${errors.email ? "error" : ""}`}
                        placeholder="example@domain.com"
                        disabled={loading}
                      />
                      {errors.email && (
                        <span className="field-error">{errors.email}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`form-input ${errors.phone ? "error" : ""}`}
                        placeholder="+966 5X XXX XXXX"
                        disabled={loading}
                      />
                      {errors.phone && (
                        <span className="field-error">{errors.phone}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="birthDate" className="form-label">
                      تاريخ الميلاد *
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className={`form-input ${
                        errors.birthDate ? "error" : ""
                      }`}
                      max={getMaxDate()}
                      disabled={loading}
                    />
                    {errors.birthDate && (
                      <span className="field-error">{errors.birthDate}</span>
                    )}
                  </div>
                </div>

                {/* Account Security */}
                <div className="form-section">
                  <h3>أمان الحساب</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        كلمة المرور *
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`form-input ${
                          errors.password ? "error" : ""
                        }`}
                        placeholder="أدخلي كلمة مرور قوية"
                        disabled={loading}
                      />
                      {errors.password && (
                        <span className="field-error">{errors.password}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="form-label">
                        تأكيد كلمة المرور *
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`form-input ${
                          errors.confirmPassword ? "error" : ""
                        }`}
                        placeholder="أعيدي كتابة كلمة المرور"
                        disabled={loading}
                      />
                      {errors.confirmPassword && (
                        <span className="field-error">
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Beauty Profile */}
                <div className="form-section">
                  <h3>ملف العناية بالجمال</h3>

                  <div className="form-group">
                    <label htmlFor="skinType" className="form-label">
                      نوع البشرة *
                    </label>
                    <select
                      id="skinType"
                      name="skinType"
                      value={formData.skinType}
                      onChange={handleInputChange}
                      className={`form-select ${
                        errors.skinType ? "error" : ""
                      }`}
                      disabled={loading}
                    >
                      {skinTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.skinType && (
                      <span className="field-error">{errors.skinType}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="allergies" className="form-label">
                      الحساسية أو الأمراض الجلدية (اختياري)
                    </label>
                    <textarea
                      id="allergies"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="اذكري أي حساسية أو أمراض جلدية لديك"
                      rows="3"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="form-section">
                  <div className="form-group">
                    <label
                      className={`terms-checkbox ${
                        errors.agreeToTerms ? "error" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      <span className="checkmark"></span>
                      <span className="terms-text">
                        أوافق على{" "}
                        <button type="button" className="terms-link">
                          الشروط والأحكام
                        </button>{" "}
                        و
                        <button type="button" className="terms-link">
                          سياسة الخصوصية
                        </button>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <span className="field-error">{errors.agreeToTerms}</span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn-primary register-btn ${
                    loading ? "loading" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
                </button>
              </form>

              <div className="form-footer">
                <p>لديك حساب بالفعل؟</p>
                <button
                  onClick={() => navigate("/login")}
                  className="login-link"
                >
                  تسجيل الدخول
                </button>
              </div>
            </div>

            {/* Registration Benefits */}
            <div className="register-benefits">
              <h3>مميزات الانضمام إلينا</h3>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">🎯</div>
                  <div className="benefit-content">
                    <h4>خطة علاج شخصية</h4>
                    <p>خطة مصممة خصيصاً لنوع بشرتك واحتياجاتك</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">📊</div>
                  <div className="benefit-content">
                    <h4>تتبع التقدم</h4>
                    <p>راقبي تطور نتائج علاجاتك بالصور والملاحظات</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🔔</div>
                  <div className="benefit-content">
                    <h4>تذكيرات ذكية</h4>
                    <p>تذكيرات للمواعيد والعناية اليومية</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">💰</div>
                  <div className="benefit-content">
                    <h4>خصومات حصرية</h4>
                    <p>خصم 15% على أول زيارة وعروض أعضاء حصرية</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🏆</div>
                  <div className="benefit-content">
                    <h4>برنامج VIP</h4>
                    <p>أولوية في الحجز وخدمات VIP مع كل زيارة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
