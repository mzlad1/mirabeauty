import React from "react";
import "./LoadingPage.css";

const LoadingPage = () => {
  return (
    <div className="loading-wrapper">
      <img src="/assets/logo.png" alt="Logo" className="loading-logo" />

      <h2 className="loading-text">جاري التحميل</h2>

      <div className="progress-bar">
        <div className="progress-fill"></div>
      </div>
    </div>
  );
};

export default LoadingPage;
