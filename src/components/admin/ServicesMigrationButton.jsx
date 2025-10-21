import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { migrateServices } from "../../utils/migrateServices";

const ServicesMigrationButton = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Debug info
  console.log("ServicesMigrationButton - User:", user);

  // Show to all logged-in users for testing (you can change this back to admin-only later)
  if (!user) {
    return (
      <div
        style={{
          margin: "20px 0",
          padding: "15px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#666", margin: "0" }}>
          يجب تسجيل الدخول لرؤية أدوات الترحيل
        </p>
      </div>
    );
  }

  const handleMigration = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const result = await migrateServices();

      if (result.success) {
        setMessage(result.message);
        setTimeout(() => {
          setMessage("");
        }, 5000);
      } else {
        setMessage("خطأ: " + result.message);
      }
    } catch (error) {
      console.error("Migration error:", error);
      setMessage("حدث خطأ أثناء ترحيل الخدمات");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#e8f5e8",
        border: "2px solid #28a745",
        borderRadius: "8px",
        maxWidth: "600px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h4
        style={{ color: "#0b2235", marginBottom: "10px", textAlign: "center" }}
      >
        🔧 أدوات الترحيل - الخدمات 🔧
      </h4>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
        انقر لترحيل الخدمات التجريبية إلى قاعدة بيانات Firebase
      </p>

      <button
        onClick={handleMigration}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? "#6c757d" : "#28a745",
          color: "white",
          border: "none",
          padding: "15px 30px",
          borderRadius: "8px",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          width: "100%",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        {isLoading ? "جاري الترحيل..." : "ترحيل الخدمات التجريبية"}
      </button>

      {message && (
        <div
          style={{
            marginTop: "10px",
            padding: "8px",
            backgroundColor: message.includes("خطأ") ? "#f8d7da" : "#d4edda",
            color: message.includes("خطأ") ? "#721c24" : "#155724",
            borderRadius: "3px",
            fontSize: "14px",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default ServicesMigrationButton;
