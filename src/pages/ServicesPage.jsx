import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ServicesPage.css";
import {
  getAllServices,
  getServicesByCategory,
} from "../services/servicesService";
import { getAllServiceCategories } from "../services/categoriesService";

const ServicesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bookmarkedServices, setBookmarkedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([
    { id: "all", name: "جميع الخدمات" },
  ]);

  // Fetch services from Firebase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedServices;
        if (selectedCategory === "all") {
          fetchedServices = await getAllServices();
        } else {
          fetchedServices = await getServicesByCategory(selectedCategory);
        }

        console.log("ServicesPage - Loaded services data:", fetchedServices);
        console.log(
          "ServicesPage - First service structure:",
          fetchedServices[0]
        );

        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("حدث خطأ في تحميل الخدمات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory]);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await getAllServiceCategories();
      const allCategories = [
        { id: "all", name: "جميع الخدمات" },
        ...categoriesData,
      ];
      setCategories(allCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      // Keep default categories if loading fails
    }
  };

  const filteredServices = services;

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
      {/* Breadcrumb Section */}
      <section className="services-breadcrumb-section">
        <div className="container">
          <div className="breadcrumb-container">
            <nav className="services-breadcrumb">
              <button
                onClick={() => navigate("/")}
                className="services-breadcrumb-link"
              >
                الرئيسية
              </button>
              <span className="services-breadcrumb-separator">/</span>
              <span className="services-breadcrumb-current">الخدمات</span>
            </nav>
          </div>
        </div>
      </section>

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
                    {bookmarkedServices.map((item) => {
                      // Get primary image or first image - handle object-based images
                      const primaryImage =
                        item.images && item.images.length > 0
                          ? item.images[item.primaryImageIndex || 0]?.url ||
                            item.images[item.primaryImageIndex || 0]
                          : item.image || "/assets/default-service.png";

                      return (
                        <div
                          key={item.id}
                          className="services-page-bookmark-item"
                        >
                          <div className="services-page-bookmark-item-info">
                            <img src={primaryImage} alt={item.name} />
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
                      );
                    })}
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
                  {filteredServices.length} خدمات
                </span>
              </div>

              {loading ? (
                <div className="services-page-loading">
                  <div className="loading-spinner"></div>
                  <p>جاري تحميل الخدمات...</p>
                </div>
              ) : error ? (
                <div className="services-page-error">
                  <i className="fas fa-exclamation-triangle"></i>
                  <p>{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              ) : (
                <div className="services-page-grid">
                  {filteredServices.map((service) => {
                    // Debug logging for each service
                    console.log("ServicesPage - Service data:", {
                      id: service.id,
                      name: service.name,
                      image: service.image,
                      images: service.images,
                      primaryImageIndex: service.primaryImageIndex,
                      hidden: service.hidden,
                    });

                    // Check if service is hidden
                    if (service.hidden) {
                      return (
                        <div
                          key={service.id}
                          className="services-page-card services-page-card-hidden"
                        >
                          <div className="services-page-image services-page-image-skeleton">
                            <div className="coming-soon-overlay">
                              <div className="coming-soon-badge">
                                <i className="fas fa-clock"></i>
                                <span>قريباً</span>
                              </div>
                            </div>
                          </div>
                          <div className="services-page-info">
                            <div className="services-page-category services-skeleton-text"></div>
                            <h3 className="services-skeleton-title"></h3>
                            <p className="services-page-description services-skeleton-description">
                              <span className="services-skeleton-line"></span>
                              <span className="services-skeleton-line"></span>
                              <span className="services-skeleton-line short"></span>
                            </p>
                            <div className="services-page-actions">
                              <button
                                className="services-page-book-btn"
                                disabled
                              >
                                قريباً
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Get primary image or first image - handle object-based images
                    const primaryImage =
                      service.images && service.images.length > 0
                        ? service.images[service.primaryImageIndex || 0]?.url ||
                          service.images[service.primaryImageIndex || 0]
                        : service.image ;

                    console.log(
                      "ServicesPage - Primary image selected:",
                      primaryImage
                    );

                    return (
                      <div key={service.id} className="services-page-card">
                        <div className="services-page-image">
                          <img src={primaryImage} alt={service.name} />
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
                          {/* <button
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
                        </button> */}
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
                          {service.price ? `${service.price} شيكل` : "اتصل للاستفسار"}
                        </span>
                        {service.originalPrice && (
                          <span className="services-page-original-price">
                            {service.originalPrice} شيكل
                          </span>
                        )}
                      </div> */}

                          <div className="services-page-actions">
                            <button
                              className="services-page-book-btn"
                              onClick={() =>
                                navigate("/book", {
                                  state: {
                                    selectedService: service,
                                    fromServicesPage: true,
                                  },
                                })
                              }
                            >
                              احجز الآن
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No Services Message */}
              {!loading && !error && filteredServices.length === 0 && (
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
