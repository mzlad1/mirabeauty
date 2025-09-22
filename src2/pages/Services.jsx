import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import LuxuryCard from "../components/LuxuryCard";
import Button from "../components/Button";
import { services, faqs } from "../data/arabicData";
import "./Services.css";

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "laser"
  );

  const tabs = [
    { id: "laser", label: "الليزر", icon: "✨" },
    { id: "skincare", label: "العناية بالبشرة", icon: "🌸" },
    { id: "vip", label: "VIP", icon: "💎" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const currentServices = services[activeTab] || [];
  const currentFAQs = faqs[activeTab] || [];

  return (
    <div className="services-page">
      <div className="services-container">
        {/* Header */}
        <div className="services-page-header">
          <h1>خدماتنا المميزة</h1>
          <p>
            اكتشفي مجموعة واسعة من خدمات الليزر والعناية بالبشرة المصممة خصيصاً
            لجمالك
          </p>
        </div>

        {/* Tabs */}
        <div className="services-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {currentServices.map((service) => (
            <LuxuryCard
              key={service.id}
              className="services-service-card"
              badge={
                service.popular ? { text: "الأكثر طلباً", type: "gold" } : null
              }
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-details">
                <div className="service-duration">
                  <span className="detail-label">المدة:</span>
                  <span className="detail-value">{service.duration}</span>
                </div>
                <div className="service-price">
                  <span className="detail-label">السعر:</span>
                  <div className="services-price-container">
                    <span className="services-current-price">
                      {service.price}
                    </span>
                    {service.originalPrice && (
                      <span className="services-original-price">
                        {service.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="primary" size="md" className="service-btn">
                احجزي الآن
              </Button>
            </LuxuryCard>
          ))}
        </div>

        {/* Quick FAQ */}
        {currentFAQs.length > 0 && (
          <div className="quick-faq">
            <h2>
              أسئلة شائعة - {tabs.find((tab) => tab.id === activeTab)?.label}
            </h2>
            <div className="faq-list">
              {currentFAQs.map((faq, index) => (
                <LuxuryCard key={index} className="faq-item">
                  <div className="faq-question">
                    <h4>{faq.question}</h4>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </LuxuryCard>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="services-cta">
          <LuxuryCard className="cta-card" gradient>
            <h2>هل تحتاجين لاستشارة مجانية؟</h2>
            <p>فريقنا المتخصص جاهز لمساعدتك في اختيار الخدمة المناسبة لكِ</p>
            <div className="cta-actions">
              <Button variant="luxury" size="lg" icon="💬">
                احجزي استشارة مجانية
              </Button>
              <a href="https://wa.me/966501234567">
                <Button variant="secondary" size="lg" icon="📞">
                  تواصلي معنا
                </Button>
              </a>
            </div>
          </LuxuryCard>
        </div>
      </div>
    </div>
  );
};

export default Services;
