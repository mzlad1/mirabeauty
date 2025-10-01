import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsPage.css";
import { sampleProducts } from "../data/sampleProducts";
import CartOverlay from "../components/common/CartOverlay";

const ProductsPage = ({ setCurrentPage }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

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

  useEffect(() => {
    updateCartData();

    const handleCartUpdate = () => {
      updateCartData();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const updateCartData = () => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemsCount(totalCount);
    } else {
      setCartItems([]);
      setCartItemsCount(0);
    }
  };

  const filteredProducts =
    selectedCategory === "all"
      ? sampleProducts
      : sampleProducts.filter(
          (product) => product.category === selectedCategory
        );

  const addToCart = (product) => {
    const savedCart = localStorage.getItem("cartItems");
    const cartItems = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cartItems.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      showToast(`تم زيادة كمية ${product.name} في السلة`, "success");
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
      showToast(`تم إضافة ${product.name} للسلة بنجاح`, "success");
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="products-page">
      {/* New Top Header: Category Filter */}

      {/* Products Content */}
      <section className="products-content section">
        <div className="container">
          <div className="products-layout">
            {/* Sidebar */}
            <aside className="products-sidebar">
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
                  {filteredProducts.length} منتجات
                </span>
              </div>

              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => navigate(`/products/${product.id}`)}
                    style={{ cursor: "pointer" }}
                  >
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
                      {product.inStock && (
                        <button
                          className="product-add-to-cart-icon"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          title="إضافة إلى السلة"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M7 18c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-0.16 0.28-0.25 0.61-0.25 0.96 0 1.1 0.9 2 2 2h12v-2H7.42c-0.14 0-0.25-0.11-0.25-0.25l0.03-0.12L8.1 13h7.45c0.75 0 1.41-0.42 1.75-1.03L21.7 4H5.21l-0.94-2H1zm16 16c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2z" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="product-info">
                      <h3>{product.name}</h3>
                      {/* <p className="product-description">
                        {product.description}
                      </p> */}

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

      {/* Cart Overlay */}
      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default ProductsPage;
