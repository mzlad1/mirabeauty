import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { loginUser, getFirebaseErrorMessage } from "../services/authService";
import { useAuth } from "../hooks/useAuth.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { refreshUserData, waitForAuth } = useAuth();
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
    setErrors({}); // Clear any previous errors

    try {
      // Login with Firebase
      console.log("🔐 Starting login...");
      const { user, userData } = await loginUser(
        formData.email,
        formData.password
      );
      console.log(
        "✅ Login successful, user:",
        user.uid,
        "role:",
        userData.role
      );

      // No need to wait for auth state - we already have userData from loginUser
      // The useAuth hook will update in the background

      // Redirect based on user role
      if (userData.role === "admin" || userData.role === "staff") {
        console.log("📍 Navigating to dashboard...");
        navigate("/dashboard");
      } else {
        console.log("📍 Navigating to home...");
        navigate("/"); // Redirect customers to home page
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = getFirebaseErrorMessage(error);
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Note: Demo login functionality will be removed as we're using Firebase now
  // const handleDemoLogin = (role) => {
  //   // This functionality will be replaced with actual Firebase accounts
  // };

  return (
    <div className="login-page">
      {/* Login Content */}
      <section className="login-content section">
        <div className="container">
          <div className="login-page-layout">
            {/* Login Form */}
            <div className="login-page-form-container">
              <div className="login-form-header">
                <h2>أهلاً بك مرة أخرى</h2>
                <p>ادخلي بياناتك للوصول إلى حسابك</p>
              </div>

              {errors.general && (
                // <div className="login-error-message">{errors.general}</div>
                <div className="login-error-message">
                  الايميل او كلمة المرور خاطئة, حاول مرة اخرى
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-page-form">
                <div className="login-form-group">
                  <label htmlFor="email" className="login-form-label">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`login-form-input ${
                      errors.email ? "error" : ""
                    }`}
                    placeholder="أدخلي بريدك الإلكتروني"
                    disabled={loading}
                  />
                  {errors.email && (
                    <span className="login-field-error">{errors.email}</span>
                  )}
                </div>

                <div className="login-form-group">
                  <label htmlFor="password" className="login-form-label">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`login-form-input ${
                      errors.password ? "error" : ""
                    }`}
                    placeholder="أدخلي كلمة المرور"
                    disabled={loading}
                  />
                  {errors.password && (
                    <span className="login-field-error">{errors.password}</span>
                  )}
                </div>

                <div className="login-form-options">
                  <label className="login-remember-me">
                    <input type="checkbox" />
                    <span>تذكريني</span>
                  </label>
                  <button
                    type="button"
                    className="login-forgot-password"
                    onClick={() => navigate("/reset-password")}
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>

                <button
                  type="submit"
                  className={`btn-primary login-btn-form ${
                    loading ? "loading" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </button>
              </form>

              <div className="login-form-footer">
                <p>
                  ليس لديك حساب؟{" "}
                  <button
                    onClick={() => navigate("/register")}
                    className="login-register-link"
                  >
                    إنشاء حساب جديد
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Benefits Section */}
      <section className="login-benefits section">
        <div className="container">
          <div className="why-grid">
            <div className="why-heading text-right">
              <h2>مميزات الحساب الشخصي</h2>
              <p>
                احصلي على تجربة شخصية متكاملة مع العديد من المميزات الحصرية.
              </p>
            </div>
            <div className="why-points">
              <ul>
                <li>إدارة وتعديل المواعيد بسهولة</li>
                <li>تتبع تاريخ المواعيد ونتائجها</li>
                <li>عروض وخصومات حصرية للأعضاء</li>
                <li>نقاط الولاء واستبدالها بخدمات</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
