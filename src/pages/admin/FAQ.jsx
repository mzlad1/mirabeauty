import React from "react";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { faqs } from "../../data/arabicData";
import "./AdminPage.css";

const AdminFAQ = () => {
  const allFAQs = [
    ...faqs.laser.map((faq) => ({ ...faq, section: "ليزر" })),
    ...faqs.skincare.map((faq) => ({ ...faq, section: "عناية بالبشرة" })),
    ...faqs.general.map((faq) => ({ ...faq, section: "عامة" })),
  ];

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>إدارة الأسئلة الشائعة</h1>
          <p>عرض وإدارة جميع الأسئلة الشائعة</p>
        </div>

        <div className="page-actions">
          <Button variant="primary" size="lg">
            إضافة سؤال جديد
          </Button>
        </div>

        <div className="faq-list">
          {allFAQs.map((faq, index) => (
            <LuxuryCard key={index} className="faq-card">
              <div className="faq-header">
                <h3>{faq.question}</h3>
                <span className="section-badge">{faq.section}</span>
              </div>
              <div className="faq-content">
                <p>{faq.answer}</p>
              </div>
              <div className="faq-actions">
                <Button variant="secondary" size="sm">
                  تعديل
                </Button>
                <Button variant="primary" size="sm">
                  تفعيل/إلغاء
                </Button>
                <Button variant="danger" size="sm">
                  حذف
                </Button>
              </div>
            </LuxuryCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminFAQ;
