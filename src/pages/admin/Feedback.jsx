import React from "react";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { adminData } from "../../data/arabicData";
import "./AdminPage.css";

const AdminFeedback = () => {
  const feedback = adminData.feedback;

  const getStatusBadge = (status) => {
    switch (status) {
      case "موافق عليها":
        return "approved";
      case "في الانتظار":
        return "pending";
      case "مرفوضة":
        return "rejected";
      default:
        return "primary";
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>إدارة التقييمات</h1>
          <p>مراجعة وتدقيق تقييمات العملاء</p>
        </div>

        <div className="feedback-list">
          {feedback.map((item) => (
            <LuxuryCard key={item.id} className="feedback-card">
              <div className="feedback-header">
                <div className="customer-info">
                  <h3>{item.customer}</h3>
                  <p>{item.service}</p>
                </div>
                <div className="feedback-status">
                  <span
                    className={`status-badge ${getStatusBadge(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="feedback-rating">
                <div className="stars">{"⭐".repeat(item.rating)}</div>
                <span className="rating-text">
                  {item.rating === 1
                    ? "سيء جداً"
                    : item.rating === 2
                    ? "سيء"
                    : item.rating === 3
                    ? "متوسط"
                    : item.rating === 4
                    ? "جيد"
                    : "ممتاز"}
                </span>
              </div>

              <div className="feedback-comment">
                <p>"{item.comment}"</p>
              </div>

              <div className="feedback-meta">
                <span>التاريخ: {item.date}</span>
              </div>

              <div className="feedback-actions">
                <Button variant="success" size="sm">
                  موافقة
                </Button>
                <Button variant="danger" size="sm">
                  رفض
                </Button>
                <Button variant="secondary" size="sm">
                  تعديل
                </Button>
              </div>
            </LuxuryCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedback;
