import React, { useState } from "react";
import LuxuryCard from "../components/LuxuryCard";
import Button from "../components/Button";
import { faqs, instructions } from "../data/arabicData";
import "./FAQ.css";

const FAQ = () => {
  const [activeTab, setActiveTab] = useState("laser");
  const [openFAQ, setOpenFAQ] = useState(null);

  const tabs = [
    { id: "laser", label: "الليزر", icon: "✨" },
    { id: "skincare", label: "العناية بالبشرة", icon: "🌸" },
    { id: "general", label: "عامة", icon: "❓" },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>الأسئلة الشائعة</h1>
          <p>إجابات على أكثر الأسئلة شيوعاً حول خدماتنا وطرق العناية</p>
        </div>

        {/* FAQ Tabs */}
        <div className="faq-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`faq-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Content */}
        <div className="faq-content">
          <h2>
            أسئلة شائعة - {tabs.find((tab) => tab.id === activeTab)?.label}
          </h2>
          <div className="faq-list">
            {faqs[activeTab]?.map((faq, index) => (
              <LuxuryCard key={index} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3>{faq.question}</h3>
                  <span
                    className={`faq-icon ${openFAQ === index ? "open" : ""}`}
                  >
                    {openFAQ === index ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`faq-answer ${openFAQ === index ? "open" : ""}`}
                >
                  <p>{faq.answer}</p>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </div>

        {/* Instructions Section */}
        <div className="instructions-section">
          <h2>تعليمات مهمة</h2>
          <div className="instructions-grid">
            <LuxuryCard className="instruction-card">
              <div className="instruction-header">
                <div className="instruction-icon">⏰</div>
                <h3>قبل الجلسة</h3>
              </div>
              <div className="instruction-content">
                <ul>
                  {instructions.before.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            </LuxuryCard>

            <LuxuryCard className="instruction-card">
              <div className="instruction-header">
                <div className="instruction-icon">✨</div>
                <h3>بعد الجلسة</h3>
              </div>
              <div className="instruction-content">
                <ul>
                  {instructions.after.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            </LuxuryCard>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <LuxuryCard className="contact-card" gradient>
            <h2>هل لديكِ سؤال آخر؟</h2>
            <p>
              فريقنا المتخصص جاهز للإجابة على جميع استفساراتك ومساعدتك في اختيار
              الخدمة المناسبة
            </p>
            <div className="contact-actions">
              <a href="https://wa.me/966501234567">
                <Button variant="luxury" size="lg" icon="💬">
                  تواصلي معنا عبر واتساب
                </Button>
              </a>
              <a href="tel:+970501234567">
                <Button variant="secondary" size="lg" icon="📞">
                  اتصل بنا
                </Button>
              </a>
            </div>
          </LuxuryCard>
        </div>

        {/* Additional Tips */}
        <div className="tips-section">
          <h2>نصائح إضافية</h2>
          <div className="tips-grid">
            <LuxuryCard className="tip-card">
              <div className="tip-icon">🌞</div>
              <h3>الحماية من الشمس</h3>
              <p>استخدمي واقي الشمس يومياً لحماية بشرتك من الأشعة الضارة</p>
            </LuxuryCard>

            <LuxuryCard className="tip-card">
              <div className="tip-icon">💧</div>
              <h3>الترطيب</h3>
              <p>احرصي على ترطيب بشرتك بانتظام للحفاظ على نعومتها</p>
            </LuxuryCard>

            <LuxuryCard className="tip-card">
              <div className="tip-icon">🥗</div>
              <h3>التغذية السليمة</h3>
              <p>تناولي الأطعمة الصحية الغنية بالفيتامينات لصحة بشرتك</p>
            </LuxuryCard>

            <LuxuryCard className="tip-card">
              <div className="tip-icon">😴</div>
              <h3>النوم الكافي</h3>
              <p>احصلي على قسط كافي من النوم لتجديد خلايا البشرة</p>
            </LuxuryCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
