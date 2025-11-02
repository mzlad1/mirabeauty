import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import CustomModal from "../components/common/CustomModal";
import { useModal } from "../hooks/useModal";

const CartPage = () => {
  const navigate = useNavigate();
  const { modalState, closeModal, showSuccess, showError, showWarning, showConfirm } = useModal();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // Get cart items from localStorage
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    // Dispatch custom event to update cart count
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    // Dispatch custom event to update cart count
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(0.1);
    } else if (promoCode.toLowerCase() === "welcome20") {
      setDiscount(0.2);
    } else {
      showError("رمز الخصم غير صحيح");
      setDiscount(0);
    }
  };

  const getPrice = (priceString) => {
    return parseFloat(priceString.replace(/[^\d.]/g, "")) || 0;
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getPrice(item.price) * item.quantity,
    0
  );
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 200 ? 0 : 25;
  const total = subtotal - discountAmount + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showWarning("السلة فارغة");
      return;
    }
    // Navigate to checkout or booking page
    navigate("/book");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <section className="cart-empty section">
          <div className="container">
            <div className="cart-empty-content">
              <div className="cart-empty-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h2>سلة التسوق فارغة</h2>
              <p>لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
              <button
                className="btn-primary"
                onClick={() => navigate("/products")}
              >
                تسوق الآن
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <section className="cart-content section">
        <div className="container">
          <div className="cart-header">
            <h1>سلة التسوق</h1>
            <span className="cart-items-count">{cartItems.length} منتج</span>
          </div>

          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div
                    className="cart-item-image clickable"
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item-details">
                    <h3
                      className="clickable"
                      onClick={() => navigate(`/products/${item.id}`)}
                    >
                      {item.name}
                    </h3>
                    <p className="cart-item-category">{item.categoryName}</p>
                    <div className="cart-item-price">
                      <span className="current-price">{item.price}</span>
                      {item.originalPrice && (
                        <span className="original-price">
                          {item.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      title="إزالة من السلة"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <h3>ملخص الطلب</h3>

              <div className="summary-row">
                <span>المجموع الفرعي</span>
                <span>{subtotal.toFixed(2)} شيكل</span>
              </div>

              {discount > 0 && (
                <div className="summary-row discount">
                  <span>الخصم ({(discount * 100).toFixed(0)}%)</span>
                  <span>-{discountAmount.toFixed(2)} شيكل</span>
                </div>
              )}

              <div className="summary-row">
                <span>الشحن</span>
                <span>{shipping === 0 ? "مجاني" : `${shipping} شيكل`}</span>
              </div>

              <div className="summary-row total">
                <span>المجموع الكلي</span>
                <span>{total.toFixed(2)} شيكل</span>
              </div>

              <div className="promo-code">
                <input
                  type="text"
                  placeholder="رمز الخصم"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={applyPromoCode}>تطبيق</button>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                إتمام الطلب
              </button>

              <div className="shipping-info">
                <p>
                  <i className="fas fa-truck"></i>
                  شحن مجاني للطلبات أكثر من 200 شيكل
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <CustomModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
        onClose={closeModal}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancel={modalState.showCancel}
      />
    </div>
  );
};

export default CartPage;
