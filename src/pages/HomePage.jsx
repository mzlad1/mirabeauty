import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { getAllProducts } from "../services/productsService";
import { getPopularServices } from "../services/servicesService";
import { getApprovedGeneralFeedbacks } from "../services/feedbackService";
import PromotionalBanner from "../components/common/PromotionalBanner";
import ProductCard from "../components/customer/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import FeedbackModal from "../components/common/FeedbackModal";
import { useNavigationLoading } from "../hooks/useNavigationLoading";
import { useLoading } from "../hooks/useLoading";
import { useAuth } from "../hooks/useAuth";
import { FEEDBACK_TYPES } from "../services/feedbackService";
import {
  createProgressTracker,
  preloadImagesWithProgress,
} from "../utils/loadingHelpers";

const HomePage = () => {
  const navigate = useNavigate();
  const { navigateWithLoading } = useNavigationLoading();
  const { currentUser, userData } = useAuth();
  const {
    withMultipleLoading,
    registerTask,
    updateTaskProgress,
    completeTask,
  } = useLoading();

  // Hero carousel images
  const heroImages = [
    "https://lasermedicalclinic.com/wp-content/uploads/2024/04/laser-hair-removal-time-between-sessions.png",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Load products and services from Firebase with real progress tracking
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use real loading with multiple tasks
      await withMultipleLoading([
        {
          taskId: "products",
          fn: async (onProgress) => {
            onProgress(20);
            const data = await getAllProducts();
            onProgress(100);
            setProducts(data);
            return data;
          },
        },
        {
          taskId: "services",
          fn: async (onProgress) => {
            onProgress(20);
            const data = await getPopularServices();
            onProgress(100);
            setServices(data);
            return data;
          },
        },
        {
          taskId: "testimonials",
          fn: async (onProgress) => {
            onProgress(20);
            const data = await getApprovedGeneralFeedbacks();
            onProgress(100);
            setTestimonials(data);
            return data;
          },
        },
        {
          taskId: "hero-images",
          fn: async (onProgress) => {
            await preloadImagesWithProgress(heroImages, onProgress);
            return true;
          },
        },
      ]);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-carousel">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${
                index === currentImageIndex ? "active" : ""
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text text-right">
              <h1>اكتشفي إشراقك الطبيعي</h1>
              <p className="hero-subtitle">
                استمتعي بخدمات العناية المتقدمة وعلاجات الليزر في مركز ميرا
                بيوتي
              </p>
              <div className="text-right">
                <button
                  className="btn-primary hero-btn"
                  onClick={() => navigateWithLoading("/book")}
                >
                  احجزي موعدك الآن
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="hero-indicators">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${
                index === currentImageIndex ? "active" : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          className="hero-nav prev"
          onClick={() =>
            setCurrentImageIndex(
              currentImageIndex === heroImages.length - 1
                ? 0
                : currentImageIndex + 1
            )
          }
          aria-label="Previous slide"
        >
          &#8250;
        </button>
        <button
          className="hero-nav next"
          onClick={() =>
            setCurrentImageIndex(
              currentImageIndex === 0
                ? heroImages.length - 1
                : currentImageIndex - 1
            )
          }
          aria-label="Next slide"
        >
          &#8249;
        </button>
      </section>

      {/* Featured Services */}
      <section className="featured-services section">
        <div className="container">
          <div className="section-header text-center mb-3">
            <h2>خدماتنا المميزة</h2>
          </div>
          <div className="services-grid grid-3">
            {loading ? (
              <div style={{ gridColumn: "1/-1" }}>
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center" }}>
                <p style={{ color: "#721c24", marginBottom: "1rem" }}>
                  {error}
                </p>
                <button className="btn-primary" onClick={loadData}>
                  إعادة المحاولة
                </button>
              </div>
            ) : (
              services.map((service) => {
                // Get primary image or first image - handle object-based images
                const primaryImage =
                  service.images && service.images.length > 0
                    ? service.images[service.primaryImageIndex || 0]?.url ||
                      service.images[service.primaryImageIndex || 0]
                    : service.icon || "/assets/default-service.png";

                return (
                  <div key={service.id} className="service-card card">
                    <div className="service-icon">
                      <img src={primaryImage} alt={service.name} />
                    </div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <button
                      className="btn-secondary service-btn"
                      onClick={() => navigateWithLoading("/services")}
                    >
                      اعرفي المزيد
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <div className="text-center" style={{ marginTop: "2rem" }}>
            <button
              className="btn-primary"
              onClick={() => navigateWithLoading("/services")}
            >
              عرض جميع الخدمات
            </button>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promotional-banner-section">
        <div className="promo-container">
          <PromotionalBanner
            backgroundImage="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            headline="عروض حصرية على منتجات العناية الفاخرة"
            subheading="وفري حتى 30% على مجموعات العناية المتكاملة والسيروم المتطور"
            primaryButtonText="تسوقي الآن"
            secondaryButtonText="اعرفي المزيد"
            primaryButtonAction="/products"
            secondaryButtonAction="/services"
          />
        </div>
      </section>

      {/* Top Sales */}
      <section className="top-sales section">
        <div className="container">
          <div className="section-header text-center mb-3">
            <h2>الأكثر مبيعاً</h2>
          </div>
          <div className="products-grid grid-4">
            {loading ? (
              <div style={{ gridColumn: "1/-1" }}>
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center" }}>
                <p style={{ color: "#721c24", marginBottom: "1rem" }}>
                  {error}
                </p>
                <button className="btn-primary" onClick={loadData}>
                  إعادة المحاولة
                </button>
              </div>
            ) : (
              products
                .slice()
                .sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0))
                .slice(0, 4)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(product) => {
                      // Handle add to cart functionality
                      console.log("Added to cart:", product.name);
                    }}
                  />
                ))
            )}
          </div>
          <div className="text-center" style={{ marginTop: "2rem" }}>
            <button
              className="btn-primary"
              onClick={() => navigateWithLoading("/products")}
            >
              عرض جميع المنتجات
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us section">
        <div className="container">
          <div className="why-grid">
            <div className="why-heading text-right">
              <h2>لماذا تختاريننا؟</h2>
              <p>
                نقدم لك تجربة فاخرة بمعايير طبية وتقنيات حديثة واهتمام شخصي.
              </p>
            </div>
            <div className="why-points">
              <ul>
                <li>خبرة طبية متخصصة وفريق نسائي محترف</li>
                <li>أجهزة ليزر معتمدة ونتائج ملموسة بأمان</li>
                <li>خطط علاج مخصصة لكل نوع بشرة واحتياج</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials section">
        <div className="container">
          <div className="section-header text-center mb-3">
            <h2>آراء عميلاتنا</h2>
            <button
              className="btn-secondary"
              onClick={() => setIsFeedbackModalOpen(true)}
              style={{ marginTop: "1rem" }}
            >
              <i className="fas fa-star"></i>
              شاركي رأيك
            </button>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <LoadingSpinner />
            </div>
          ) : testimonials.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <i
                className="fas fa-comments"
                style={{
                  fontSize: "3rem",
                  color: "var(--gold)",
                  marginBottom: "1rem",
                }}
              ></i>
              <p style={{ color: "var(--charcoal)", fontSize: "1.1rem" }}>
                كوني أول من يشارك رأيها!
              </p>
              <button
                className="btn-primary"
                onClick={() => setIsFeedbackModalOpen(true)}
                style={{ marginTop: "1rem" }}
              >
                <i className="fas fa-star"></i>
                شاركي رأيك الآن
              </button>
            </div>
          ) : (
            <div className="testimonials-grid grid-3">
              {testimonials.slice(0, 6).map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card card">
                  <div className="testimonial-rating">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <i
                        key={i}
                        className="fas fa-star"
                        style={{ color: "var(--gold)" }}
                      ></i>
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.service}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        type={FEEDBACK_TYPES.GENERAL}
        currentUser={currentUser}
        userData={userData}
      />

      {/* Call to Action */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-content text-center">
            <h2>هل أنت مستعدة لتجربة التميز؟</h2>
            <p>
              احجزي موعدك اليوم واستمتعي بخدمات العناية الفاخرة في مركز ميرا
              بيوتي
            </p>
            <div className="cta-buttons">
              <button
                className="btn-primary"
                onClick={() => navigateWithLoading("/book")}
              >
                احجزي موعدك الآن
              </button>
              <button
                className="home-btn-secondary"
                onClick={() => navigateWithLoading("/services")}
              >
                اكتشفي خدماتنا
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
