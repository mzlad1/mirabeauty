import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      section: "الإدارة الرئيسية",
      items: [
        { icon: "📊", text: "لوحة التحكم", path: "/admin" },
        { icon: "", text: "الحجوزات", path: "/admin/bookings" },
        { icon: "✨", text: "الخدمات", path: "/admin/services" },
        { icon: "🏠", text: "الغرف", path: "/admin/rooms" },
      ],
    },
    {
      section: "إدارة المحتوى",
      items: [
        { icon: "🛍️", text: "المنتجات", path: "/admin/products" },
        { icon: "�", text: "العروض", path: "/admin/discounts" },
        { icon: "❓", text: "الأسئلة الشائعة", path: "/admin/faq" },
      ],
    },
    {
      section: "الموظفين والعملاء",
      items: [
        { icon: "�", text: "الموظفين", path: "/admin/staff" },
        { icon: "⭐", text: "التقييمات", path: "/admin/feedback" },
      ],
    },
    {
      section: "الإعدادات",
      items: [{ icon: "⚙️", text: "الإعدادات", path: "/admin/settings" }],
    },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Toggle for Mobile */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo/Header */}
        <div className="admin-sidebar-header">
          <Link to="/admin/dashboard" className="admin-logo">
            <div className="admin-logo-icon">💎</div>
            <div className="admin-logo-text">
              <h3>ليزر بيوتي</h3>
              <p>لوحة الإدارة</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="admin-nav-section">
              <h4>{section.section}</h4>
              <ul className="admin-nav-list">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="admin-nav-item">
                    <Link
                      to={item.path}
                      className={`admin-nav-link ${
                        isActive(item.path) ? "active" : ""
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="admin-nav-icon">{item.icon}</span>
                      <span className="admin-nav-text">{item.text}</span>
                      {item.badge && (
                        <span className="admin-nav-badge">{item.badge}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="admin-user-profile">
          <div className="admin-user-info">
            <div className="admin-user-avatar">ص</div>
            <div className="admin-user-details">
              <h5>صالح الإدارة</h5>
              <p>مدير النظام</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">{children}</main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
            display: window.innerWidth <= 1024 ? "block" : "none",
          }}
        />
      )}
    </div>
  );
};

export default AdminLayout;
