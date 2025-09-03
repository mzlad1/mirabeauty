import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Overview from "./account/Overview";
import History from "./account/History";
import Settings from "./account/Settings";
import Feedback from "./account/Feedback";
import "./Account.css";

const Account = () => {
  const location = useLocation();

  const accountTabs = [
    { path: "/account/overview", label: "نظرة عامة", icon: "📊" },
    { path: "/account/history", label: "السجل", icon: "📋" },
    { path: "/account/settings", label: "الإعدادات", icon: "⚙️" },
    { path: "/account/feedback", label: "التقييمات", icon: "⭐" },
  ];

  return (
    <div className="account-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>حسابي</h1>
          <p>إدارة حسابك وتتبع جلساتك وتقييماتك</p>
        </div>

        {/* Account Navigation */}
        <div className="account-nav">
          <div className="nav-tabs">
            {accountTabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`nav-tab ${
                  location.pathname === tab.path ? "active" : ""
                }`}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Account Content */}
        <div className="account-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Account;
