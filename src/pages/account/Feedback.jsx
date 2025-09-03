import React, { useState } from "react";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { userData } from "../../data/arabicData";
import "./Feedback.css";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Mock user reviews
  const userReviews = [
    {
      id: 1,
      service: "إزالة الشعر بالليزر - الوجه",
      date: "2024-12-10",
      rating: 5,
      comment:
        "تجربة رائعة جداً! المركز فاخر والخدمة ممتازة. النتائج تجاوزت توقعاتي تماماً.",
      status: "موافق عليها",
    },
    {
      id: 2,
      service: "التقشير الكيميائي",
      date: "2024-12-05",
      rating: 4,
      comment: "خدمة جيدة جداً، النتائج ممتازة. الموظفون محترفون جداً.",
      status: "موافق عليها",
    },
    {
      id: 3,
      service: "الميكرونيدلينغ",
      date: "2024-11-28",
      rating: 5,
      comment: "أفضل مركز في فلسطين! أنصح الجميع بزيارتهم.",
      status: "في الانتظار",
    },
  ];

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating > 0 && comment.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setComment("");
        alert("تم إرسال تقييمك بنجاح! شكراً لكِ");
      }, 2000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "موافق عليها":
        return "success";
      case "في الانتظار":
        return "warning";
      case "مرفوضة":
        return "danger";
      default:
        return "primary";
    }
  };

  return (
    <div className="feedback-page">
      {/* Give Feedback Section */}
      <LuxuryCard className="feedback-form-section">
        <h2>شاركي تجربتك معنا</h2>
        <p>نقدر آراءك وملاحظاتك لمساعدتنا في تحسين خدماتنا</p>

        <div className="feedback-form">
          <div className="form-group">
            <label>الخدمة المقيّمة</label>
            <select className="form-select" defaultValue="">
              <option value="">اختر الخدمة</option>
              <option value="ليزر-وجه">إزالة الشعر بالليزر - الوجه</option>
              <option value="ليزر-جسم">إزالة الشعر بالليزر - الجسم كامل</option>
              <option value="تقشير">التقشير الكيميائي</option>
              <option value="ميكرونيدلينغ">الميكرونيدلينغ</option>
              <option value="vip">باقة VIP الشاملة</option>
            </select>
          </div>

          <div className="form-group">
            <label>تقييمك</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={`star-button ${rating >= value ? "active" : ""}`}
                  onClick={() => handleRatingClick(value)}
                >
                  ⭐
                </button>
              ))}
              <span className="rating-text">
                {rating === 0
                  ? "اختر التقييم"
                  : rating === 1
                  ? "سيء جداً"
                  : rating === 2
                  ? "سيء"
                  : rating === 3
                  ? "متوسط"
                  : rating === 4
                  ? "جيد"
                  : "ممتاز"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>تعليقك</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="form-textarea"
              placeholder="شاركي تجربتك معنا... ما الذي أعجبك؟ كيف يمكننا التحسين؟"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <Button
              variant="luxury"
              size="lg"
              onClick={handleSubmit}
              disabled={rating === 0 || !comment.trim() || submitted}
            >
              {submitted ? "جاري الإرسال..." : "إرسال التقييم"}
            </Button>
          </div>
        </div>
      </LuxuryCard>

      {/* My Reviews Section */}
      <div className="my-reviews-section">
        <h2>تقييماتي السابقة</h2>
        <div className="reviews-list">
          {userReviews.map((review) => (
            <LuxuryCard key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-info">
                  <h3>{review.service}</h3>
                  <p className="review-date">{review.date}</p>
                </div>
                <div className="review-status">
                  <span
                    className={`status-badge ${getStatusBadge(review.status)}`}
                  >
                    {review.status}
                  </span>
                </div>
              </div>

              <div className="review-rating">
                <div className="stars">{"⭐".repeat(review.rating)}</div>
                <span className="rating-text">
                  {review.rating === 1
                    ? "سيء جداً"
                    : review.rating === 2
                    ? "سيء"
                    : review.rating === 3
                    ? "متوسط"
                    : review.rating === 4
                    ? "جيد"
                    : "ممتاز"}
                </span>
              </div>

              <div className="review-comment">
                <p>"{review.comment}"</p>
              </div>
            </LuxuryCard>
          ))}
        </div>
      </div>

      {/* Feedback Guidelines */}
      <LuxuryCard className="guidelines-section" gradient>
        <h2>إرشادات التقييم</h2>
        <div className="guidelines-grid">
          <div className="guideline-item">
            <div className="guideline-icon">💡</div>
            <h3>كني صادقة</h3>
            <p>شاركي تجربتك الحقيقية لمساعدة الآخرين</p>
          </div>

          <div className="guideline-item">
            <div className="guideline-icon">🤝</div>
            <h3>كوني محترمة</h3>
            <p>استخدمي لغة مهذبة ومحترمة في تعليقاتك</p>
          </div>

          <div className="guideline-item">
            <div className="guideline-icon">🎯</div>
            <h3>كوني مفيدة</h3>
            <p>ركز على التفاصيل التي تساعد الآخرين</p>
          </div>

          <div className="guideline-item">
            <div className="guideline-icon">⚡</div>
            <h3>كوني محدثة</h3>
            <p>تقييمي الجلسات الحديثة فقط</p>
          </div>
        </div>
      </LuxuryCard>
    </div>
  );
};

export default Feedback;
