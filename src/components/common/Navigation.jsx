import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CartOverlay from "./CartOverlay";
import "./Navigation.css";

const Navigation = ({ currentUser, setCurrentUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    updateCartCount();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const updateCartCount = () => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      const totalCount = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartItemsCount(totalCount);
    } else {
      setCartItemsCount(0);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
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

        {/* Cart Icon */}
        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          <i className="fas fa-shopping-cart"></i>
          {cartItemsCount > 0 && (
            <span className="cart-badge">{cartItemsCount}</span>
          )}
        </div>

        {/* User Actions */}
        <div className="nav-actions">
          {currentUser ? (
            <div className="user-menu">
              <div className="user-info">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="user-avatar"
                />
                <div className="user-details">
                  <span className="user-name">{currentUser.name}</span>
                  <span className="user-role">
                    {currentUser.role === "customer" && "عميل"}
                    {currentUser.role === "staff" && "موظف"}
                    {currentUser.role === "admin" && "مدير"}
                  </span>
                </div>
              </div>
              <div className="user-dropdown">
                {currentUser.role === "customer" && (
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
                {(currentUser.role === "staff" ||
                  currentUser.role === "admin") && (
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

      {/* Cart Overlay */}
      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navigation;
