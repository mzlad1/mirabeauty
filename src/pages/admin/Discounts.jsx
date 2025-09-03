import React from "react";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import "./AdminPage.css";

const AdminDiscounts = () => {
  const discounts = [
    {
      id: 1,
      type: "نسبة مئوية",
      value: "30%",
      description: "خصم الشتاء الساخن",
      validUntil: "31 ديسمبر 2024",
      status: "نشط",
    },
    {
      id: 2,
      type: "مبلغ ثابت",
      value: "100 شيكل",
      description: "خصم العضوية الذهبية",
      validUntil: "28 فبراير 2025",
      status: "نشط",
    },
    {
      id: 3,
      type: "باقة",
      value: "3 جلسات",
      description: "باقة العناية الذهبية",
      validUntil: "15 يناير 2025",
      status: "نشط",
    },
    {
      id: 4,
      type: "كوبون",
      value: "WELCOME20",
      description: "كوبون الترحيب",
      validUntil: "30 نوفمبر 2024",
      status: "منتهي",
    },
  ];

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>إدارة العروض والخصومات</h1>
          <p>عرض وإدارة جميع العروض والخصومات</p>
        </div>

        <div className="page-actions">
          <Button variant="primary" size="lg">
            إضافة عرض جديد
          </Button>
        </div>

        <div className="discounts-grid">
          {discounts.map((discount) => (
            <LuxuryCard key={discount.id} className="discount-card">
              <div className="discount-header">
                <h3>{discount.description}</h3>
                <span
                  className={`status-badge ${
                    discount.status === "نشط" ? "active" : "expired"
                  }`}
                >
                  {discount.status}
                </span>
              </div>
              <div className="discount-details">
                <div className="detail-item">
                  <span>النوع: {discount.type}</span>
                </div>
                <div className="detail-item">
                  <span>القيمة: {discount.value}</span>
                </div>
                <div className="detail-item">
                  <span>صالح حتى: {discount.validUntil}</span>
                </div>
              </div>
              <div className="discount-actions">
                <Button variant="secondary" size="sm">
                  تعديل
                </Button>
                <Button variant="primary" size="sm">
                  تفعيل/إلغاء
                </Button>
              </div>
            </LuxuryCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDiscounts;
