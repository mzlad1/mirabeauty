import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsPage.css";
import {
  getAllProducts,
  getProductsByCategory,
} from "../services/productsService";
import { getAllProductCategories } from "../services/categoriesService";
import CartOverlay from "../components/common/CartOverlay";

const ProductsPage = ({ setCurrentPage }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpenedFromAdd, setCartOpenedFromAdd] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([
    { id: "all", name: "جميع المنتجات" },
  ]);

  useEffect(() => {
    updateCartData();
    loadProducts();
    loadCategories();

    const handleCartUpdate = () => {
      updateCartData();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

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

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let productsData;
      if (selectedCategory === "all") {
        productsData = await getAllProducts();
      } else {
        productsData = await getProductsByCategory(selectedCategory);
      }

      console.log("ProductsPage - Loaded products data:", productsData);
      console.log("ProductsPage - First product structure:", productsData[0]);

      setProducts(productsData);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await getAllProductCategories();
      const allCategories = [
        { id: "all", name: "جميع المنتجات" },
        ...categoriesData,
      ];
      setCategories(allCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      // Keep default categories if loading fails
    }
  };

  // Products are already filtered by loadProducts function
  const filteredProducts = products;

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

    // Open cart overlay after adding item with animation flag
    setTimeout(() => {
      setCartOpenedFromAdd(true);
      setIsCartOpen(true);
    }, 500);
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="products-page">
      {/* Breadcrumb with Cart Icon */}
      <section className="products-breadcrumb-section">
        <div className="container">
          <div className="breadcrumb-container">
            <nav className="products-breadcrumb">
              <button
                onClick={() => navigate("/")}
                className="products-breadcrumb-link"
              >
                الرئيسية
              </button>
              <span className="products-breadcrumb-separator">/</span>
              <span className="products-breadcrumb-current">المنتجات</span>
            </nav>

            {/* Cart Icon */}
            <div className="breadcrumb-cart-section">
              <div
                className="breadcrumb-cart-header"
                onClick={() => {
                  setCartOpenedFromAdd(false);
                  setIsCartOpen(true);
                }}
              >
                <div className="breadcrumb-cart-icon-container">
                  <i className="fas fa-shopping-cart"></i>
                  {cartItemsCount > 0 && (
                    <span className="breadcrumb-cart-badge">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  {loading
                    ? "جاري التحميل..."
                    : `${filteredProducts.length} منتجات`}
                </span>
              </div>

              {/* Loading State */}
              {loading && (
                <div
                  className="products-loading"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px",
                    fontSize: "1.2rem",
                    color: "#0b2235",
                  }}
                >
                  <i
                    className="fas fa-spinner fa-spin"
                    style={{ marginLeft: "10px" }}
                  ></i>
                  جاري تحميل المنتجات...
                </div>
              )}

              {/* Error State */}
              {error && (
                <div
                  className="products-error"
                  style={{
                    background: "#f8d7da",
                    color: "#721c24",
                    padding: "1rem",
                    borderRadius: "8px",
                    textAlign: "center",
                    margin: "2rem 0",
                  }}
                >
                  <i
                    className="fas fa-exclamation-triangle"
                    style={{ marginLeft: "10px" }}
                  ></i>
                  {error}
                  <button
                    onClick={loadProducts}
                    style={{
                      marginRight: "10px",
                      background: "#721c24",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    إعادة المحاولة
                  </button>
                </div>
              )}

              <div className="products-grid">
                {!loading &&
                  !error &&
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => navigate(`/products/${product.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="product-image">
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? product.primaryImageIndex !== undefined &&
                                product.images[product.primaryImageIndex]
                                ? product.images[product.primaryImageIndex]
                                    ?.url ||
                                  product.images[product.primaryImageIndex]
                                : product.images[0]?.url || product.images[0]
                              : product.image || "/images/placeholder.jpg"
                          }
                          alt={product.name}
                        />
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
                          <div className="out-of-stock-badge">
                            نفذ من المخزن
                          </div>
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
                            <i
                              className="fas fa-shopping-cart"
                              style={{ color: "white" }}
                            ></i>
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
                            {Array.from({ length: product.rating }, (_, i) => (
                              <i
                                key={i}
                                className="fas fa-star"
                                style={{ color: "var(--gold)" }}
                              ></i>
                            ))}
                          </div>
                          <span className="rating-text">
                            {product.rating} ({product.reviewsCount} تقييمات)
                          </span>
                        </div>

                        <div className="product-price">
                          <span className="current-price">
                            {product.price} شيكل
                          </span>
                          {product.originalPrice && (
                            <span className="original-price">
                              {product.originalPrice} شيكل
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* No Products Message */}
              {!loading && !error && filteredProducts.length === 0 && (
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
      <CartOverlay
        isOpen={isCartOpen}
        onClose={() => {
          setIsCartOpen(false);
          setCartOpenedFromAdd(false);
        }}
        fromAddToCart={cartOpenedFromAdd}
      />
    </div>
  );
};

export default ProductsPage;
