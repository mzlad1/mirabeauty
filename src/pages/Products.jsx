import React, { useState } from "react";
import LuxuryCard from "../components/LuxuryCard";
import Button from "../components/Button";
import { products } from "../data/arabicData";
import "./Products.css";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "جميع المنتجات", icon: "🛍️" },
    { id: "العناية بالبشرة", label: "العناية بالبشرة", icon: "🌸" },
    { id: "المصلات", label: "المصلات", icon: "💧" },
    { id: "الحماية", label: "الحماية", icon: "☀️" },
    { id: "الأقنعة", label: "الأقنعة", icon: "🎭" },
    { id: "التونر", label: "التونر", icon: "🌹" },
    { id: "العناية بالعين", label: "العناية بالعين", icon: "👁️" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>منتجاتنا الفاخرة</h1>
          <p>
            اكتشفي مجموعة منتجات العناية بالبشرة الفاخرة من أفضل الماركات
            العالمية
          </p>
        </div>

        {/* Categories Filter */}
        <div className="categories-filter">
          <div className="filter-tabs">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-tab ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="tab-icon">{category.icon}</span>
                <span className="tab-label">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <LuxuryCard
              key={product.id}
              className="product-card"
              badge={{ text: `${product.discount}% خصم`, type: "discount" }}
            >
              <div className="product-image">{product.image}</div>
              <div className="product-category">{product.category}</div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-price">
                <div className="price-container">
                  <span className="current-price">{product.price}</span>
                  <span className="original-price">
                    {product.originalPrice}
                  </span>
                </div>
                <div className="discount-badge">
                  وفرت{" "}
                  {Math.round(
                    ((parseInt(product.originalPrice) -
                      parseInt(product.price)) /
                      parseInt(product.originalPrice)) *
                      100
                  )}
                  %
                </div>
              </div>
              <Button variant="secondary" size="md" className="product-btn">
                عرض التفاصيل
              </Button>
            </LuxuryCard>
          ))}
        </div>

        {/* Purchase Notice */}
        <div className="purchase-notice">
          <LuxuryCard className="notice-card" gradient>
            <div className="notice-icon">🏪</div>
            <h3>معلومات الشراء</h3>
            <p>
              جميع منتجاتنا متاحة للشراء داخل المركز فقط. يمكنكِ تجربة المنتجات
              قبل الشراء والحصول على استشارة مجانية من خبرائنا.
            </p>
            <div className="notice-actions">
              <Button variant="primary" size="lg" icon="📍">
                زوري المركز
              </Button>
              <a href="https://wa.me/966501234567">
                <Button variant="secondary" size="lg" icon="💬">
                  استشاري مجاني
                </Button>
              </a>
            </div>
          </LuxuryCard>
        </div>

        {/* Product Benefits */}
        <div className="product-benefits">
          <h2>لماذا تختارين منتجاتنا؟</h2>
          <div className="benefits-grid">
            <LuxuryCard className="benefit-card">
              <div className="benefit-icon">✨</div>
              <h3>جودة عالية</h3>
              <p>منتجات من أفضل الماركات العالمية مع ضمان الجودة</p>
            </LuxuryCard>

            <LuxuryCard className="benefit-card">
              <div className="benefit-icon">🧪</div>
              <h3>مكونات طبيعية</h3>
              <p>مكونات طبيعية آمنة ومناسبة لجميع أنواع البشرة</p>
            </LuxuryCard>

            <LuxuryCard className="benefit-card">
              <div className="benefit-icon">👩‍⚕️</div>
              <h3>استشارة متخصصة</h3>
              <p>استشارة مجانية من خبراء العناية بالبشرة</p>
            </LuxuryCard>

            <LuxuryCard className="benefit-card">
              <div className="benefit-icon">🎁</div>
              <h3>عروض حصرية</h3>
              <p>خصومات وعروض حصرية للعملاء المميزين</p>
            </LuxuryCard>
          </div>
        </div>

        {/* CTA Section */}
        <div className="products-cta">
          <LuxuryCard className="cta-card" gradient>
            <h2>جاهزة لبدء رحلة العناية ببشرتك؟</h2>
            <p>احجزي استشارة مجانية واكتشفي المنتجات المناسبة لبشرتك</p>
            <div className="cta-actions">
              <Button variant="luxury" size="lg" icon="💫">
                احجزي استشارة مجانية
              </Button>
              <a href="https://wa.me/966501234567">
                <Button variant="secondary" size="lg" icon="💬">
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

export default Products;
