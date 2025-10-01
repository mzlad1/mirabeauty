import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetailsPage.css";
import { sampleProducts } from "../data/sampleProducts";
import CartOverlay from "../components/common/CartOverlay";
import ProductCard from "../components/customer/ProductCard";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartOpenedFromAdd, setCartOpenedFromAdd] = useState(false);

  useEffect(() => {
    const foundProduct = sampleProducts.find((p) => p.id === parseInt(id));
    if (foundProduct) {
      setProduct({
        ...foundProduct,
        images: foundProduct.image
          ? [foundProduct.image, foundProduct.image, foundProduct.image]
          : [],
        fullDescription:
          foundProduct.description ||
          "هذا المنتج مصنوع من أفضل المواد الطبيعية والآمنة على البشرة. يحتوي على مكونات فعالة تساعد في تحسين ملمس البشرة ونعومتها. مناسب لجميع أنواع البشرة ومختبر علمياً للحصول على أفضل النتائج.",
        ingredients: foundProduct.ingredients || [
          "حمض الهيالورونيك",
          "فيتامين C",
          "كولاجين طبيعي",
          "مستخلص الصبار",
          "زيت الأرغان",
        ],
        howToUse:
          foundProduct.howToUse ||
          "يُستخدم مرتين يومياً صباحاً ومساءً. ضعي كمية مناسبة على البشرة النظيفة ودلكي بلطف حتى الامتصاص الكامل.",
        benefits: foundProduct.benefits || [
          "ترطيب عميق للبشرة",
          "تحسين ملمس البشرة",
          "تقليل علامات الشيخوخة",
          "حماية من العوامل الخارجية",
        ],
      });
    }
  }, [id]);

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
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemsCount(totalCount);
    } else {
      setCartItemsCount(0);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleAddToCart = () => {
    if (product && product.inStock && !isAddingToCart) {
      setIsAddingToCart(true);

      const savedCart = localStorage.getItem("cartItems");
      const cartItems = savedCart ? JSON.parse(savedCart) : [];

      const existingItem = cartItems.find((item) => item.id === product.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...cartItems, { ...product, quantity }];
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));

      showToast(
        `تم إضافة ${quantity} من ${product.name} للسلة بنجاح`,
        "success"
      );

      // Reset button state and open cart with smooth transition
      setTimeout(() => {
        setIsAddingToCart(false);
        setCartOpenedFromAdd(true);
        setIsCartOpen(true);
      }, 800);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (!product) {
    return (
      <div className="product-details-loading">
        <div className="product-details-loading-spinner"></div>
        <p>جاري تحميل تفاصيل المنتج...</p>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}
      <section className="product-details-breadcrumb-section">
        <div className="container">
          <div className="breadcrumb-container">
            <nav className="product-details-breadcrumb">
              <button
                onClick={() => navigate("/")}
                className="product-details-breadcrumb-link"
              >
                الرئيسية
              </button>
              <span className="product-details-breadcrumb-separator">/</span>
              <button
                onClick={() => navigate("/products")}
                className="product-details-breadcrumb-link"
              >
                المنتجات
              </button>
              <span className="product-details-breadcrumb-separator">/</span>
              <span className="product-details-breadcrumb-current">
                {product.name}
              </span>
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

      {/* Product Details */}
      <section className="product-details-content section">
        <div className="container">
          <div className="product-details-layout">
            {/* Product Images */}
            <div className="product-details-images">
              <div className="product-details-main-image">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="product-details-main-product-image"
                />
                {product.originalPrice && (
                  <div className="product-details-discount-badge">
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
                  <div className="product-details-out-of-stock-overlay">
                    <span>نفذ من المخزن</span>
                  </div>
                )}
              </div>
              <div className="product-details-thumbnail-images">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`product-details-thumbnail ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-details-info">
              <div className="product-details-category">
                {product.categoryName}
              </div>
              <h1 className="product-details-title">{product.name}</h1>

              <div className="product-details-rating">
                <div className="product-details-stars">
                  {Array.from(
                    { length: Math.floor(product.rating) },
                    (_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    )
                  )}
                </div>
                <span className="product-details-rating-text">
                  {product.rating} ({product.reviewsCount} تقييم)
                </span>
              </div>

              <div className="product-details-price">
                <span className="product-details-current-price">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="product-details-original-price">
                    {product.originalPrice}
                  </span>
                )}
              </div>

              <p className="product-details-short-description">
                {product.description}
              </p>

              {/* Quantity and Add to Cart */}
              <div className="product-details-actions">
                <div className="product-details-quantity-selector">
                  <label>الكمية:</label>
                  <div className="product-details-quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="product-details-quantity-btn"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="product-details-quantity-display">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="product-details-quantity-btn"
                      disabled={quantity >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className={`product-details-add-to-cart-btn ${
                    !product.inStock ? "disabled" : ""
                  } ${isAddingToCart ? "adding" : ""}`}
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>جاري الإضافة...</span>
                    </>
                  ) : product.inStock ? (
                    `أضف للسلة - ${product.price}`
                  ) : (
                    "غير متوفر"
                  )}
                </button>
              </div>

              {/* Product Features */}
              <div className="product-details-features">
                <div className="product-details-feature">
                  <i className="fas fa-shipping-fast product-details-feature-icon"></i>
                  <span>توصيل مجاني فوق 100 شيكل</span>
                </div>
                <div className="product-details-feature">
                  <i className="fas fa-undo product-details-feature-icon"></i>
                  <span>إمكانية الاسترداد خلال 30 يوم</span>
                </div>
                <div className="product-details-feature">
                  <i className="fas fa-certificate product-details-feature-icon"></i>
                  <span>منتج أصلي ومضمون</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="product-details-tabs">
            <div className="product-details-tabs-header">
              <button
                className={`product-details-tab-btn ${
                  activeTab === "description" ? "active" : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                الوصف
              </button>
              <button
                className={`product-details-tab-btn ${
                  activeTab === "ingredients" ? "active" : ""
                }`}
                onClick={() => setActiveTab("ingredients")}
              >
                المكونات
              </button>
              <button
                className={`product-details-tab-btn ${
                  activeTab === "howToUse" ? "active" : ""
                }`}
                onClick={() => setActiveTab("howToUse")}
              >
                طريقة الاستخدام
              </button>
              <button
                className={`product-details-tab-btn ${
                  activeTab === "reviews" ? "active" : ""
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                التقييمات ({product.reviewsCount})
              </button>
            </div>

            <div className="product-details-tabs-content">
              {activeTab === "description" && (
                <div className="product-details-tab-content">
                  <h3>وصف المنتج</h3>
                  <p>{product.fullDescription}</p>
                  <h4>الفوائد:</h4>
                  <ul>
                    {product.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "ingredients" && (
                <div className="product-details-tab-content">
                  <h3>المكونات الفعالة</h3>
                  <ul className="product-details-ingredients-list">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "howToUse" && (
                <div className="product-details-tab-content">
                  <h3>طريقة الاستخدام</h3>
                  <p>{product.howToUse}</p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="product-details-tab-content">
                  <h3>آراء العملاء</h3>
                  <div className="product-details-reviews-summary">
                    <div className="product-details-overall-rating">
                      <span className="product-details-rating-number">
                        {product.rating}
                      </span>
                      <div className="product-details-stars">
                        {Array.from(
                          { length: Math.floor(product.rating) },
                          (_, i) => (
                            <i key={i} className="fas fa-star"></i>
                          )
                        )}
                      </div>
                      <span>({product.reviewsCount} تقييم)</span>
                    </div>
                  </div>
                  <div className="product-details-reviews-list">
                    <div className="product-details-review-item">
                      <div className="product-details-reviewer-info">
                        <strong>سارة أحمد</strong>
                        <div className="product-details-review-stars">
                          {Array.from({ length: 5 }, (_, i) => (
                            <i key={i} className="fas fa-star"></i>
                          ))}
                        </div>
                      </div>
                      <p>
                        منتج ممتاز! لاحظت الفرق من أول استخدام. بشرتي أصبحت أكثر
                        نعومة وإشراقاً.
                      </p>
                    </div>
                    <div className="product-details-review-item">
                      <div className="product-details-reviewer-info">
                        <strong>منى خالد</strong>
                        <div className="product-details-review-stars">
                          {Array.from({ length: 5 }, (_, i) => (
                            <i key={i} className="fas fa-star"></i>
                          ))}
                        </div>
                      </div>
                      <p>
                        أنصح به بشدة! مناسب جداً للبشرة الحساسة ولا يسبب أي
                        تهيج.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="product-details-related-products section">
        <div className="container">
          <div className="section-header text-center mb-3">
            <h2>منتجات مشابهة</h2>
            <p>اكتشفي منتجات أخرى قد تعجبك</p>
          </div>
          <div className="products-grid grid-4">
            {(() => {
              // First try to get products from same category
              let relatedProducts = sampleProducts.filter((p) => {
                const matchesCategory =
                  p.category === product.category ||
                  p.categoryName === product.categoryName;
                const isDifferentProduct = p.id !== product.id;
                return matchesCategory && isDifferentProduct;
              });

              // If no products found in same category, get random different products
              if (relatedProducts.length === 0) {
                relatedProducts = sampleProducts.filter(
                  (p) => p.id !== product.id
                );
              }

              return relatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={(product) => {
                    // Handle add to cart for related products
                    const savedCart = localStorage.getItem("cartItems");
                    const cartItems = savedCart ? JSON.parse(savedCart) : [];

                    const existingItem = cartItems.find(
                      (item) => item.id === product.id
                    );
                    let updatedCart;

                    if (existingItem) {
                      updatedCart = cartItems.map((item) =>
                        item.id === product.id
                          ? { ...item, quantity: item.quantity + 1 }
                          : item
                      );
                      showToast(
                        `تم زيادة كمية ${product.name} في السلة`,
                        "success"
                      );
                    } else {
                      updatedCart = [...cartItems, { ...product, quantity: 1 }];
                      showToast(
                        `تم إضافة ${product.name} للسلة بنجاح`,
                        "success"
                      );
                    }

                    localStorage.setItem(
                      "cartItems",
                      JSON.stringify(updatedCart)
                    );
                    window.dispatchEvent(new Event("cartUpdated"));
                  }}
                />
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`product-details-toast product-details-toast-${toast.type}`}
        >
          <div className="product-details-toast-content">
            <i className="fas fa-check-circle product-details-toast-icon"></i>
            <span className="product-details-toast-message">
              {toast.message}
            </span>
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

export default ProductDetailsPage;
