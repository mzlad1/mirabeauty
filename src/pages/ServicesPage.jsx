import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ServicesPage.css";
import { sampleServices } from "../data/sampleServices";

const ServicesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "جميع الخدمات" },
    { id: "laser", name: "الليزر" },
    { id: "skincare", name: "العناية بالبشرة" },
    { id: "body", name: "نحت الجسم" },
    { id: "facial", name: "العناية بالوجه" },
  ];

  const filteredServices =
    selectedCategory === "all"
      ? sampleServices
      : sampleServices.filter(
          (service) => service.category === selectedCategory
        );

  return (
    <div className="services-page">

      {/* Services Content */}
      <section className="services-content section">
        <div className="container">
          {/* Category Filter */}
          <div className="category-filter">
            <h3>تصفح حسب الفئة</h3>
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`filter-btn ${
                    selectedCategory === category.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="services-container">
            {filteredServices.map((service) => (
              <div key={service.id} className="service-detail-card">
                <div className="service-image">
                  <img src={service.image} alt={service.name} />
                  <div className="service-overlay">
                    <button
                      className="view-details-btn"
                      onClick={() => setCurrentPage("book")}
                    >
                      احجز الآن
                    </button>
                  </div>
                </div>
                <div className="service-info">
                  <div className="service-category">{service.categoryName}</div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="service-features">
                    <ul>
                      {service.features?.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="service-details">
                    <div className="service-duration">
                      <span className="detail-label">المدة:</span>
                      <span className="detail-value">{service.duration}</span>
                    </div>
                    <div className="service-price">
                      <span className="price-label">السعر:</span>
                      <span className="price-value">{service.price}</span>
                    </div>
                  </div>
                  <div className="service-actions">
                    <button
                      className="btn-primary book-service-btn"
                      onClick={() => setCurrentPage("book")}
                    >
                      احجز الآن
                    </button>
                    <button className="btn-secondary info-btn">
                      معلومات أكثر
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Services Message */}
          {filteredServices.length === 0 && (
            <div className="no-services">
              <h3>لا توجد خدمات في هذه الفئة حالياً</h3>
              <p>يرجى اختيار فئة أخرى أو العودة لاحقاً</p>
            </div>
          )}
        </div>
      </section>

      {/* Service Benefits */}
      <section className="service-benefits section">
        <div className="container">
          <div className="section-header text-center mb-3">
            <h2>مميزات خدماتنا</h2>
            <p>نحن نضمن لك أفضل تجربة وأعلى معايير الجودة</p>
          </div>
          <div className="benefits-grid grid-4">
            <div className="benefit-card">
              <div className="benefit-icon">🏆</div>
              <h4>جودة عالية</h4>
              <p>خدمات بأعلى معايير الجودة العالمية</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h4>نتائج سريعة</h4>
              <p>نتائج واضحة ومرضية من الجلسة الأولى</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h4>آمان تام</h4>
              <p>بروتوكولات صحية صارمة وأجهزة معقمة</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💎</div>
              <h4>خبرة متميزة</h4>
              <p>فريق متخصص بخبرة تزيد عن 10 سنوات</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="services-cta section">
        <div className="container">
          <div className="cta-content text-center">
            <h2>مستعدة لتجربة التميز؟</h2>
            <p>احجزي استشارة مجانية اليوم واكتشفي الخدمة المناسبة لك</p>
            <div className="cta-buttons">
              <button
                className="btn-primary"
                onClick={() => setCurrentPage("book")}
              >
                احجزي استشارة مجانية
              </button>
              <button
                className="btn-secondary"
                onClick={() => setCurrentPage("faq")}
              >
                الأسئلة الشائعة
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
