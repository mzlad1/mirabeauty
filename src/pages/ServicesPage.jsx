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
    <div className="services-page-container">
      {/* Services Content */}
      <section className="services-page-content section">
        <div className="container">
          <div className="services-page-layout">
            {/* Sidebar */}
            <aside className="services-page-sidebar">
              {/* Category Filter */}
              <div className="services-page-filter-section">
                <h3>تصفح حسب الفئة</h3>
                <select
                  className="services-page-filter-dropdown"
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
                <div className="services-page-bookmarks-section">
                  <h3>الخدمات المحفوظة ({bookmarkedServices.length})</h3>
                  <div className="services-page-bookmark-items">
                    {bookmarkedServices.map((item) => (
                      <div
                        key={item.id}
                        className="services-page-bookmark-item"
                      >
                        <div className="services-page-bookmark-item-info">
                          <img src={item.image} alt={item.name} />
                          <div>
                            <h4>{item.name}</h4>
                            <span className="services-page-bookmark-item-duration">
                              {item.duration}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromBookmarks(item.id)}
                          className="services-page-remove-bookmark-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="services-page-book-all-btn btn-primary"
                    onClick={() => navigate("/book")}
                  >
                    احجز الكل
                  </button>
                </div>
              )}
            </aside>

            {/* Services Grid */}
            <main className="services-page-main">
              <div className="services-page-header">
                <h2>
                  {selectedCategory === "all"
                    ? "جميع الخدمات"
                    : categories.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <span className="services-page-count">
                  {filteredServices.length} خدمة
                </span>
              </div>

              <div className="services-page-grid">
                {filteredServices.map((service) => (
                  <div key={service.id} className="services-page-card">
                    <div className="services-page-image">
                      <img src={service.image} alt={service.name} />
                      {service.originalPrice && (
                        <div className="services-page-discount-badge">
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
                      <button
                        className="services-page-bookmark-icon"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToBookmarks(service);
                        }}
                        title="احفظ الخدمة"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                        </svg>
                      </button>
                    </div>

                    <div className="services-page-info">
                      <div className="services-page-category">
                        {service.categoryName}
                      </div>
                      <h3>{service.name}</h3>
                      <p className="services-page-description">
                        {service.description}
                      </p>

                      {/* <div className="services-page-rating">
                        <div className="services-page-stars">
                          {"⭐".repeat(Math.floor(service.rating || 5))}
                        </div>
                        <span className="services-page-rating-text">
                          {service.rating || 5} ({service.reviewsCount || 25}{" "}
                          تقييم)
                        </span>
                      </div>

                      <div className="services-page-price">
                        <span className="services-page-current-price">
                          {service.price || "اتصل للاستفسار"}
                        </span>
                        {service.originalPrice && (
                          <span className="services-page-original-price">
                            {service.originalPrice}
                          </span>
                        )}
                      </div> */}

                      <div className="services-page-actions">
                        <button
                          className="services-page-book-btn"
                          onClick={() => navigate("/book")}
                        >
                          احجز الآن
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Services Message */}
              {filteredServices.length === 0 && (
                <div className="services-page-no-services">
                  <h3>لا توجد خدمات في هذه الفئة حالياً</h3>
                  <p>يرجى اختيار فئة أخرى أو العودة لاحقاً</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Service Why Choose Us Section */}
      <section className="services-page-why-choose section">
        <div className="container">
          <div className="services-page-why-grid">
            <div className="services-page-why-heading text-right">
              <h2>لماذا خدماتنا؟</h2>
              <p>
                خدماتنا تمنحك نتائج فعالة بأمان وجودة عالية، مع اهتمام كامل
                بصحتك وجمالك.
              </p>
            </div>
            <div className="services-page-why-points">
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
