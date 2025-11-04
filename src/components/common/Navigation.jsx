import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navigation.css";
import { logoutUser } from "../../services/authService";
import { useNavigationLoading } from "../../hooks/useNavigationLoading";

const Navigation = ({ currentUser, userData }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { navigateWithLoading } = useNavigationLoading();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate even if logout fails
      navigate("/");
      setIsMobileMenuOpen(false);
    }
  };

  const handleNavigation = (path) => {
    navigateWithLoading(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo" onClick={() => handleNavigation("/")}>
          <div className="logo-icon">
            <img src="/assets/logo.png" alt="ميرا بيوتي" />
          </div>
          <div className="logo-text">
            <h2>Mira Beauty Clinic</h2>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <li>
            <button
              className={`nav-link ${isActive("/") ? "active" : ""}`}
              onClick={() => handleNavigation("/")}
            >
              الرئيسية
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${isActive("/services") ? "active" : ""}`}
              onClick={() => handleNavigation("/services")}
            >
              الخدمات
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${isActive("/products") ? "active" : ""}`}
              onClick={() => handleNavigation("/products")}
            >
              المنتجات
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${isActive("/book") ? "active" : ""}`}
              onClick={() => handleNavigation("/book")}
            >
              احجز الآن
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${isActive("/faq") ? "active" : ""}`}
              onClick={() => handleNavigation("/faq")}
            >
              الأسئلة الشائعة
            </button>
          </li>
        </ul>

        {/* User Actions */}
        <div className="nav-actions">
          {currentUser ? (
            <div className="user-menu">
              <div className="user-info">
                <img
                  src={userData?.avatar || "/assets/default-avatar.jpg"}
                  alt={userData?.name || currentUser?.displayName || "المستخدم"}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.src = "/assets/default-avatar.jpg";
                  }}
                />
                <div className="user-details">
                  <span className="user-name">
                    {userData?.name || currentUser?.displayName || "المستخدم"}
                  </span>
                  <span className="user-role">
                    {userData?.role === "customer" && "عميل"}
                    {userData?.role === "staff" && "موظف"}
                    {userData?.role === "admin" && "مدير"}
                  </span>
                </div>
              </div>
              <div className="user-dropdown">
                {userData?.role === "customer" && (
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigation("/profile")}
                  >
                    <span className="dropdown-icon">
                      <i className="fas fa-user"></i>
                    </span>
                    الملف الشخصي
                  </button>
                )}
                {(userData?.role === "staff" || userData?.role === "admin") && (
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigation("/dashboard")}
                  >
                    <span className="dropdown-icon">
                      <i className="fas fa-tachometer-alt"></i>
                    </span>
                    لوحة التحكم
                  </button>
                )}
                {userData?.role === "admin" && (
                  <button
                    className="dropdown-item"
                    onClick={() => handleNavigation("/admin/orders")}
                  >
                    <span className="dropdown-icon">
                      <i className="fas fa-shopping-bag"></i>
                    </span>
                    إدارة الطلبات
                  </button>
                )}
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <span className="dropdown-icon">
                    <i className="fas fa-sign-out-alt"></i>
                  </span>
                  تسجيل الخروج
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className="nav-btn login-btn"
                onClick={() => handleNavigation("/login")}
              >
                تسجيل الدخول
              </button>
              <button
                className="nav-btn register-btn"
                onClick={() => handleNavigation("/register")}
              >
                إنشاء حساب
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay active"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navigation;
