import React from "react";
import { Link } from "react-router-dom";
import LuxuryCard from "../components/LuxuryCard";
import Button from "../components/Button";
import {
  services,
  products,
  testimonials,
  promotions,
} from "../data/arabicData";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">احجزي جلستك بكل سهولة ✨</h1>
            <p className="hero-subtitle">
              مركز Mira Beauty Clinic يقدم لكِ أفضل خدمات الليزر والعناية
              بالبشرة في أجواء فاخرة ومريحة مع أحدث التقنيات وأعلى معايير الجودة
            </p>
            <div className="hero-actions">
              <Link to="/booking">
                <Button variant="luxury" size="lg" icon="💫">
                  احجزي الآن
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="secondary" size="lg">
                  اكتشفي خدماتنا
                </Button>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-decoration">
              <div className="decoration-circle circle-1"></div>
              <div className="decoration-circle circle-2"></div>
              <div className="decoration-circle circle-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="home-container">
          <div className="home-section-header">
            <h2>خدماتنا المميزة</h2>
            <p>اختر من بين خدماتنا الفاخرة المصممة خصيصاً لجمالك</p>
          </div>
          <div className="categories-grid">
            <LuxuryCard className="category-card" gradient>
              <div className="category-icon">✨</div>
              <h3>الليزر</h3>
              <p>إزالة الشعر بالليزر بأحدث التقنيات لنتائج دائمة وفعالة</p>
              <Link to="/services?tab=laser">
                <Button variant="primary" size="sm">
                  اكتشفي المزيد
                </Button>
              </Link>
            </LuxuryCard>

            <LuxuryCard className="category-card" gradient>
              <div className="category-icon">🌸</div>
              <h3>العناية بالبشرة</h3>
              <p>علاجات متقدمة للعناية بالبشرة وتجديدها بأفضل المنتجات</p>
              <Link to="/services?tab=skincare">
                <Button variant="primary" size="sm">
                  اكتشفي المزيد
                </Button>
              </Link>
            </LuxuryCard>

            <LuxuryCard className="category-card" gradient>
              <div className="category-icon">💎</div>
              <h3>VIP</h3>
              <p>تجربة VIP حصرية مع خدمات فاخرة ومعاملة مميزة</p>
              <Link to="/services?tab=vip">
                <Button variant="gold" size="sm">
                  اكتشفي المزيد
                </Button>
              </Link>
            </LuxuryCard>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="promotions-section">
        <div className="home-container">
          <div className="home-section-header">
            <h2>عروضنا الحصرية</h2>
            <p>لا تفوتي فرصة الحصول على أفضل العروض والخصومات</p>
          </div>
          <div className="promotions-grid">
            {promotions.map((promo) => (
              <LuxuryCard
                key={promo.id}
                className="promotion-card"
                badge={{ text: promo.title, type: "gold" }}
              >
                <div className="promotion-image">{promo.image}</div>
                <h3>{promo.title}</h3>
                <p>{promo.description}</p>
                <div className="promotion-price">
                  <span className="original-price">{promo.originalPrice}</span>
                  <span className="new-price">{promo.newPrice}</span>
                </div>
                <p className="valid-until">صالح حتى: {promo.validUntil}</p>
                <Button variant="primary" size="sm" className="promotion-btn">
                  احجزي الآن
                </Button>
              </LuxuryCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="home-container">
          <div className="home-section-header">
            <h2>آراء عملائنا</h2>
            <p>اكتشفي تجارب عملائنا المميزة معنا</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <LuxuryCard key={testimonial.id} className="testimonial-card">
                <div className="stars">{"⭐".repeat(testimonial.rating)}</div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="customer-info">
                  <div className="customer-avatar">{testimonial.avatar}</div>
                  <div className="customer-details">
                    <h4>{testimonial.name}</h4>
                    <p>
                      {testimonial.service} • {testimonial.date}
                    </p>
                  </div>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section">
        <div className="home-container">
          <div className="home-section-header">
            <h2>منتجاتنا المميزة</h2>
            <p>منتجات فاخرة للعناية بالبشرة من أفضل الماركات العالمية</p>
          </div>
          <div className="products-grid">
            {products.slice(0, 3).map((product) => (
              <LuxuryCard
                key={product.id}
                className="home-product-card"
                badge={{ text: `${product.discount}% خصم`, type: "discount" }}
              >
                <div className="home-product-image">{product.image}</div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="home-price-container">
                  <span className="home-current-price">{product.price}</span>
                  <span className="home-original-price">
                    {product.originalPrice}
                  </span>
                </div>
                <Button variant="secondary" size="sm">
                  عرض التفاصيل
                </Button>
              </LuxuryCard>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/products">
              <Button variant="primary" size="lg">
                عرض جميع المنتجات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="home-container">
          <LuxuryCard className="cta-card" gradient>
            <h2>جاهزة لبدء رحلتك نحو الجمال؟</h2>
            <p>احجزي جلستك الآن واستمتعي بتجربة فاخرة لا تُنسى</p>
            <div className="cta-actions">
              <Link to="/booking">
                <Button variant="luxury" size="lg" icon="💫">
                  احجزي جلستك
                </Button>
              </Link>
              <a href="https://wa.me/966501234567">
                <Button variant="secondary" size="lg" icon="💬">
                  تواصلي معنا
                </Button>
              </a>
            </div>
          </LuxuryCard>
        </div>
      </section>
    </div>
  );
};

export default Home;
