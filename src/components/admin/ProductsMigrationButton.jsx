// Temporary migration component - only for development
import React, { useState } from "react";
import { migrateProductsToFirestore } from "../../utils/migrateProducts";
import { useAuth } from "../../hooks/useAuth.jsx";

const ProductsMigrationButton = () => {
  const { userData } = useAuth();
  const [migrating, setMigrating] = useState(false);
  const [results, setResults] = useState(null);

  // Only show to admin users
  if (!userData || userData.role !== "admin") {
    return null;
  }

  const handleMigration = async () => {
    if (migrating) return;

    try {
      setMigrating(true);
      setResults(null);

      const migrationResults = await migrateProductsToFirestore();
      setResults(migrationResults);

      alert("تم نقل المنتجات بنجاح إلى Firestore!");
    } catch (error) {
      console.error("Migration failed:", error);
      alert("فشل في نقل المنتجات: " + error.message);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "60px",
        left: "20px",
        zIndex: 9999,
        background: "#fff",
        padding: "15px",
        border: "2px solid #b8921f",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{ marginBottom: "10px", fontWeight: "bold", color: "#0b2235" }}
      >
        Admin Tools - Products Migration
      </div>

      <button
        onClick={handleMigration}
        disabled={migrating}
        style={{
          background: migrating ? "#ccc" : "#b8921f",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "4px",
          cursor: migrating ? "not-allowed" : "pointer",
          marginBottom: "10px",
          width: "100%",
        }}
      >
        {migrating ? "جاري النقل..." : "نقل المنتجات إلى Firestore"}
      </button>

      {results && (
        <div style={{ fontSize: "12px", color: "#666" }}>
          <div>
            ✅ نجح: {results.filter((r) => r.status === "success").length}
          </div>
          <div>
            ❌ فشل: {results.filter((r) => r.status === "error").length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsMigrationButton;
