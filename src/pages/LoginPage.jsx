import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { sampleUsers } from "../data/sampleUsers";

const LoginPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
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
      const user = sampleUsers.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        setCurrentUser(user);
        // Redirect based on user role
        if (user.role === "admin" || user.role === "staff") {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      } else {
        setErrors({ general: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }

      setLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (role) => {
    const demoUser = sampleUsers.find((u) => u.role === role);
    if (demoUser) {
      setCurrentUser(demoUser);
      if (role === "admin" || role === "staff") {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    }
  };

  return (
    <div className="login-page">

      {/* Login Content */}
      <section className="login-content section">
        <div className="container">
          <div className="login-layout">
            {/* Login Form */}
            <div className="login-form-container">
              <div className="form-header">
                <h2>أهلاً بك مرة أخرى</h2>
                <p>ادخلي بياناتك للوصول إلى حسابك</p>
              </div>

              {errors.general && (
                <div className="error-message">{errors.general}</div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? "error" : ""}`}
                    placeholder="أدخلي بريدك الإلكتروني"
                    disabled={loading}
                  />
                  {errors.email && (
                    <span className="field-error">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? "error" : ""}`}
                    placeholder="أدخلي كلمة المرور"
                    disabled={loading}
                  />
                  {errors.password && (
                    <span className="field-error">{errors.password}</span>
                  )}
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>تذكريني</span>
                  </label>
                  <button type="button" className="forgot-password">
                    نسيت كلمة المرور؟
                  </button>
                </div>

                <button
                  type="submit"
                  className={`btn-primary login-btn ${
                    loading ? "loading" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </button>
              </form>

              <div className="form-footer">
                <p>ليس لديك حساب؟</p>
                <button
                  onClick={() => navigate("/register")}
                  className="register-link"
                >
                  إنشاء حساب جديد
                </button>
              </div>
            </div>

            {/* Login Benefits */}
            <div className="login-benefits">
              <h3>مميزات الحساب الشخصي</h3>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">📅</div>
                  <div className="benefit-content">
                    <h4>إدارة المواعيد</h4>
                    <p>احجزي وعدلي مواعيدك بسهولة</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">📋</div>
                  <div className="benefit-content">
                    <h4>تاريخ العلاجات</h4>
                    <p>تتبعي تطور علاجاتك ونتائجها</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🎁</div>
                  <div className="benefit-content">
                    <h4>عروض حصرية</h4>
                    <p>احصلي على خصومات وعروض خاصة</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">⭐</div>
                  <div className="benefit-content">
                    <h4>نقاط الولاء</h4>
                    <p>اجمعي نقاط واستبدليها بخدمات</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Login Section */}
          <div className="demo-section">
            <h3>تسجيل دخول تجريبي</h3>
            <p>جربي النظام بأدوار مختلفة</p>
            <div className="demo-buttons">
              <button
                onClick={() => handleDemoLogin("customer")}
                className="demo-btn customer-demo"
              >
                عميل
                <span>customer1@example.com</span>
              </button>
              <button
                onClick={() => handleDemoLogin("staff")}
                className="demo-btn staff-demo"
              >
                موظف
                <span>staff1@mirabeauty.com</span>
              </button>
              <button
                onClick={() => handleDemoLogin("admin")}
                className="demo-btn admin-demo"
              >
                مدير
                <span>admin@mirabeauty.com</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
