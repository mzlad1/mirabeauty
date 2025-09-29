import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ServicesPage.css";
import { sampleServices } from "../data/sampleServices";

const ServicesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bookmarkedServices, setBookmarkedServices] = useState([]);

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

  const addToBookmarks = (service) => {
    const existingItem = bookmarkedServices.find(
      (item) => item.id === service.id
    );
    if (!existingItem) {
      setBookmarkedServices([...bookmarkedServices, service]);
    }
  };

  const removeFromBookmarks = (serviceId) => {
    setBookmarkedServices(
      bookmarkedServices.filter((item) => item.id !== serviceId)
    );
  };

  return (
    <div className="services-page">
      {/* Services Content */}
      <section className="services-content section">
        <div className="container">
          <div className="services-layout">
            {/* Sidebar */}
            <aside className="services-sidebar">
              {/* Category Filter */}
              <div className="filter-section">
                <h3>تصفح حسب الفئة</h3>
                <select
                  className="filter-dropdown"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bookmarked Services */}
              {bookmarkedServices.length > 0 && (
                <div className="bookmarks-section">
                  <h3>الخدمات المحفوظة ({bookmarkedServices.length})</h3>
                  <div className="bookmark-items">
                    {bookmarkedServices.map((item) => (
                      <div key={item.id} className="bookmark-item">
                        <div className="bookmark-item-info">
                          <img src={item.image} alt={item.name} />
                          <div>
                            <h4>{item.name}</h4>
                            <span className="bookmark-item-duration">
                              {item.duration}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromBookmarks(item.id)}
                          className="remove-bookmark-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="book-all-btn btn-primary"
                    onClick={() => navigate("/book")}
                  >
                    احجز الكل
                  </button>
                </div>
              )}
            </aside>

            {/* Services Grid */}
            <main className="services-main">
              <div className="services-header">
                <h2>
                  {selectedCategory === "all"
                    ? "جميع الخدمات"
                    : categories.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <span className="services-count">
                  {filteredServices.length} خدمة
                </span>
              </div>

              <div className="services-grid">
                {filteredServices.map((service) => (
                  <div key={service.id} className="service-card">
                    <div className="service-image">
                      <img src={service.image} alt={service.name} />
                      {service.originalPrice && (
                        <div className="discount-badge">
                          خصم{" "}
                          {Math.round(
                            (1 -
                              parseInt(service.price) /
                                parseInt(service.originalPrice)) *
                              100
                          )}
                          %
                        </div>
                      )}
                    </div>

                    <div className="service-info">
                      <div className="service-category">
                        {service.categoryName}
                      </div>
                      <h3>{service.name}</h3>
                      <p className="service-description">
                        {service.description}
                      </p>

                      <div className="service-rating">
                        <div className="stars">
                          {"⭐".repeat(Math.floor(service.rating || 5))}
                        </div>
                        <span className="rating-text">
                          {service.rating || 5} ({service.reviewsCount || 25}{" "}
                          تقييم)
                        </span>
                      </div>

                      <div className="service-price">
                        <span className="current-price">
                          {service.price || "اتصل للاستفسار"}
                        </span>
                        {service.originalPrice && (
                          <span className="original-price">
                            {service.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="service-actions">
                        <button
                          className="book-service-btn"
                          onClick={() => navigate("/book")}
                        >
                          احجز الآن
                        </button>
                        <button
                          className="bookmark-btn btn-secondary"
                          onClick={() => addToBookmarks(service)}
                        >
                          احفظ
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
            </main>
          </div>
        </div>
      </section>

      {/* Service Why Choose Us Section */}
      <section className="why-choose-services section">
        <div className="container">
          <div className="why-grid">
            <div className="why-heading text-right">
              <h2>لماذا خدماتنا؟</h2>
              <p>
                خدماتنا تمنحك نتائج فعالة بأمان وجودة عالية، مع اهتمام كامل
                بصحتك وجمالك.
              </p>
            </div>
            <div className="why-points">
              <ul>
                <li>أجهزة حديثة ومعتمدة عالمياً</li>
                <li>فريق متخصص بخبرة تزيد عن 10 سنوات</li>
                <li>استشارة مجانية قبل البدء بالعلاج</li>
                <li>ضمان النتائج مع المتابعة المستمرة</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
