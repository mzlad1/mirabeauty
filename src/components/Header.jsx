import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const customerNavItems = [
    { path: "/", label: "الرئيسية" },
    { path: "/services", label: "خدماتنا" },
    { path: "/booking", label: "احجزي الآن" },
    { path: "/products", label: "منتجاتنا" },
    { path: "/faq", label: "الأسئلة الشائعة" },
    { path: "/account", label: "حسابي" },
  ];

  const adminNavItems = [
    { path: "/admin", label: "لوحة التحكم" },
    { path: "/admin/bookings", label: "الحجوزات" },
    { path: "/admin/services", label: "الخدمات" },
    { path: "/admin/rooms", label: "الغرف" },
    { path: "/admin/staff", label: "الموظفين" },
    { path: "/admin/products", label: "المنتجات" },
    { path: "/admin/discounts", label: "العروض" },
    { path: "/admin/faq", label: "الأسئلة الشائعة" },
    { path: "/admin/feedback", label: "التقييمات" },
    { path: "/admin/settings", label: "الإعدادات" },
  ];

  const navItems = isAdminRoute ? adminNavItems : customerNavItems;

  return (
    <header
      className={`header ${isAdminRoute ? "admin-header" : "customer-header"}`}
    >
      <div className="header-container">
        <Link to={isAdminRoute ? "/admin" : "/"} className="logo">
          <div className="logo-icon">🌹</div>
          <div className="logo-text">
            <span className="logo-main">Mira Beauty Clinic</span>
            <span className="logo-sub"></span>
          </div>
        </Link>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          {!isAdminRoute && (
            <div className="contact-info">
              <a href="tel:+970501234567" className="contact-link">
                📞 +970 50 123 4567
              </a>
              <a
                href="https://wa.me/966501234567"
                className="contact-link whatsapp"
              >
                💬 واتساب
              </a>
            </div>
          )}

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="فتح القائمة"
          >
            <span className="hamburger"></span>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
