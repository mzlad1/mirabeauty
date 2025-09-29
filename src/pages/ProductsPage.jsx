import React, { useState } from "react";
import "./ProductsPage.css";
import { sampleProducts } from "../data/sampleProducts";

const ProductsPage = ({ setCurrentPage }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const categories = [
    { id: "all", name: "جميع المنتجات" },
    { id: "skincare", name: "العناية بالبشرة" },
    { id: "anti-aging", name: "مكافحة الشيخوخة" },
    { id: "whitening", name: "تفتيح البشرة" },
    { id: "serums", name: "السيروم" },
    { id: "masks", name: "الماسكات" },
    { id: "eye-care", name: "العناية بالعين" },
    { id: "sunscreen", name: "واقي الشمس" },
    { id: "body-care", name: "العناية بالجسم" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? sampleProducts
      : sampleProducts.filter(
          (product) => product.category === selectedCategory
        );

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      showToast(`تم زيادة كمية ${product.name} في السلة`, "success");
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      showToast(`تم إضافة ${product.name} للسلة بنجاح`, "success");
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace(" شيكل", ""));
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <div className="products-page">
      {/* New Top Header: Category Filter */}

      {/* Products Content */}
      <section className="products-content section">
        <div className="container">
          <div className="products-layout">
            {/* Sidebar */}
            <aside
              className={`products-sidebar ${
                cart.length > 0 ? "non-sticky" : ""
              }`}
            >
              {/* Category Filter */}
              <div className="filter-section">
                <h3>تصفح حسب الفئة</h3>
                <div className="filter-list">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`filter-item ${
                        selectedCategory === category.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shopping Cart */}
              {cart.length > 0 && (
                <div className="cart-section">
                  <div className="cart-header">
                    <div className="cart-icon-container">
                      <i className="fas fa-shopping-cart"></i>
                      <span className="cart-badge">{getTotalItems()}</span>
                    </div>
                    <h3>سلة التسوق </h3>
                  </div>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                          <img src={item.image} alt={item.name} />
                          <div>
                            <h4>{item.name}</h4>
                            <span className="cart-item-price">
                              {item.price}
                            </span>
                          </div>
                        </div>
                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="quantity-btn"
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="cart-total">
                    <strong>المجموع: {getTotalPrice()} شيكل</strong>
                  </div>
                  <button className="checkout-btn btn-primary">
                    إتمام الشراء
                  </button>
                </div>
              )}
            </aside>

            {/* Products Grid */}
            <main className="products-main">
              <div className="products-header">
                <h2>
                  {selectedCategory === "all"
                    ? "جميع المنتجات"
                    : categories.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <span className="products-count">
                  {filteredProducts.length} منتج
                </span>
              </div>

              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      {product.originalPrice && (
                        <div className="discount-badge">
                          خصم{" "}
                          {Math.round(
                            (1 -
                              parseInt(product.price) /
                                parseInt(product.originalPrice)) *
                              100
                          )}
                          %
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="out-of-stock-badge">نفذ من المخزن</div>
                      )}
                    </div>

                    <div className="product-info">
                      <div className="product-category">
                        {product.categoryName}
                      </div>
                      <h3>{product.name}</h3>
                      <p className="product-description">
                        {product.description}
                      </p>

                      <div className="product-rating">
                        <div className="stars">
                          {"⭐".repeat(Math.floor(product.rating))}
                        </div>
                        <span className="rating-text">
                          {product.rating} ({product.reviewsCount} تقييم)
                        </span>
                      </div>

                      <div className="product-price">
                        <span className="current-price">{product.price}</span>
                        {product.originalPrice && (
                          <span className="original-price">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="product-actions">
                        <button
                          className={`add-to-cart-btn ${
                            !product.inStock ? "disabled" : ""
                          }`}
                          onClick={() => product.inStock && addToCart(product)}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? "أضف للسلة" : "غير متوفر"}
                        </button>
                        <button className="quick-view-btn btn-secondary">
                          عرض سريع
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Products Message */}
              {filteredProducts.length === 0 && (
                <div className="no-products">
                  <h3>لا توجد منتجات في هذه الفئة حالياً</h3>
                  <p>يرجى اختيار فئة أخرى أو العودة لاحقاً</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Product Why Choose Us Section */}
      <section className="why-choose-products section">
        <div className="container">
          <div className="why-grid">
            <div className="why-heading text-right">
              <h2>لماذا منتجاتنا؟</h2>
              <p>
                منتجاتنا تمنحك نتائج فعالة بأمان وجودة عالية، مع اهتمام كامل
                بصحتك وجمالك.
              </p>
            </div>
            <div className="why-points">
              <ul>
                <li>مكونات طبيعية وآمنة على البشرة</li>
                <li>مختبرة علمياً ومعتمدة من الجهات المختصة</li>
                <li>توصيل مجاني للطلبات فوق 100 شيكل</li>
                <li>ضمان استرداد المبلغ في حالة عدم الرضا</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <i className="fas fa-check-circle toast-icon"></i>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
