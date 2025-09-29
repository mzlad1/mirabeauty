import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { sampleServices } from "../data/sampleServices";
import { sampleTestimonials } from "../data/sampleTestimonials";
import { sampleProducts } from "../data/sampleProducts";
import PromotionalBanner from "../components/common/PromotionalBanner";
import ProductCard from "../components/customer/ProductCard";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
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
                  onClick={() => navigate("/book")}
                >
                  احجزي موعدك الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="featured-services section">
        <div className="container">
          <div className="section-header text-center mb-3">
            <h2>خدماتنا المميزة</h2>
            <p>اكتشفي مجموعة شاملة من خدمات العناية والتجميل المتطورة</p>
          </div>
          <div className="services-grid grid-3">
            {sampleServices.slice(0, 3).map((service) => (
              <div key={service.id} className="service-card card">
                <div className="service-icon">
                  <img src={service.icon} alt={service.name} />
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <button
                  className="btn-secondary service-btn"
                  onClick={() => navigate("/services")}
                >
                  اعرفي المزيد
                </button>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: "2rem" }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/services")}
            >
              عرض جميع الخدمات
            </button>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promotional-banner-section">
        <div className="container">
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
            <p>اكتشفي منتجاتنا الأكثر شعبية وثقة من عميلاتنا</p>
          </div>
          <div className="products-grid grid-4">
            {sampleProducts
              .sort((a, b) => b.reviewsCount - a.reviewsCount)
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
              ))}
          </div>
          <div className="text-center" style={{ marginTop: "2rem" }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/products")}
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
            <p>اقرئي تجارب عميلاتنا وآرائهن حول خدماتنا المميزة</p>
          </div>
          <div className="testimonials-grid grid-3">
            {sampleTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card card">
                <div className="testimonial-rating">
                  {"⭐".repeat(testimonial.rating)}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              <button className="btn-primary" onClick={() => navigate("/book")}>
                احجزي موعدك الآن
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/services")}
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
