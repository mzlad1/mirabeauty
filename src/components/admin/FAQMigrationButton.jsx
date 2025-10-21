import React, { useState } from "react";
import { migrateFAQs } from "../../utils/migrateFAQs";

const FAQMigrationButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleMigration = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const result = await migrateFAQs();

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
      setMessage("حدث خطأ أثناء ترحيل الأسئلة الشائعة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#e8f4f8",
        border: "2px solid #17a2b8",
        borderRadius: "8px",
        maxWidth: "600px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h4
        style={{ color: "#0c5460", marginBottom: "10px", textAlign: "center" }}
      >
        ❓ ترحيل الأسئلة الشائعة إلى Firebase ❓
      </h4>
      <p
        style={{
          fontSize: "14px",
          color: "#0c5460",
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        انقر لترحيل الأسئلة الشائعة التجريبية إلى قاعدة بيانات Firebase
      </p>

      <button
        onClick={handleMigration}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? "#6c757d" : "#17a2b8",
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
        {isLoading ? "🔄 جاري الترحيل..." : "❓ ترحيل الأسئلة الشائعة"}
      </button>

      {message && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: message.includes("خطأ") ? "#f8d7da" : "#d4edda",
            color: message.includes("خطأ") ? "#721c24" : "#155724",
            borderRadius: "5px",
            fontSize: "14px",
            textAlign: "center",
            border: `1px solid ${
              message.includes("خطأ") ? "#f5c6cb" : "#c3e6cb"
            }`,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default FAQMigrationButton;
