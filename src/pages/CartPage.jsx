import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import CustomModal from "../components/common/CustomModal";
import { useModal } from "../hooks/useModal";
import { useAuth } from "../hooks/useAuth";
import { createOrder, DELIVERY_AREAS } from "../services/ordersService";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    modalState,
    closeModal,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  } = useModal();
  const { currentUser, userData } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Delivery and user info states
  const [selectedDeliveryArea, setSelectedDeliveryArea] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Get cart items from localStorage
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Pre-fill user info if logged in
  useEffect(() => {
    if (currentUser && userData) {
      setUserInfo((prev) => ({
        ...prev,
        name: userData.name || "",
        phone: userData.phone || "",
      }));
    }
  }, [currentUser, userData]);

  // Update delivery price when area changes
  useEffect(() => {
    if (selectedDeliveryArea) {
      const area = Object.values(DELIVERY_AREAS).find(
        (area) => area.name === selectedDeliveryArea
      );
      setDeliveryPrice(area ? area.price : 0);
    } else {
      setDeliveryPrice(0);
    }
  }, [selectedDeliveryArea]);

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
  const total = subtotal - discountAmount + deliveryPrice;

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) {
      showWarning("السلة فارغة");
      return;
    }

    if (!selectedDeliveryArea) {
      showWarning("يرجى اختيار منطقة التوصيل");
      return;
    }

    setShowUserInfoModal(true);
  };

  const handleCheckout = async () => {
    if (
      !userInfo.name.trim() ||
      !userInfo.phone.trim() ||
      !userInfo.address.trim()
    ) {
      showWarning("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const orderData = {
        items: cartItems,
        subtotal,
        discount,
        discountAmount,
        deliveryArea: selectedDeliveryArea,
        deliveryPrice,
        total,
        promoCode: promoCode || null,
        customerInfo: {
          name: userInfo.name.trim(),
          phone: userInfo.phone.trim(),
          address: userInfo.address.trim(),
          note: userInfo.note.trim(),
        },
        userId: currentUser?.uid || null,
        isSignedIn: !!currentUser,
        userEmail: currentUser?.email || null,
      };

      await createOrder(orderData);

      // Close the user info modal first
      setShowUserInfoModal(false);

      // Show success alert BEFORE clearing cart
      showSuccess("تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً");

      // Clear cart and navigate after delay to allow modal to show
      setTimeout(() => {
        // Clear cart
        setCartItems([]);
        localStorage.removeItem("cartItems");
        window.dispatchEvent(new CustomEvent("cartUpdated"));

        // Reset form
        setSelectedDeliveryArea("");
        setUserInfo({ name: "", phone: "", address: "", note: "" });
        setPromoCode("");
        setDiscount(0);

        // Navigate to home
        navigate("/");
      }, 2500);
    } catch (error) {
      console.error("Error submitting order:", error);
      showError("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleUserInfoChange = (field, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
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

              {/* Delivery Options */}
              <div className="delivery-section">
                <h4>اختر منطقة التوصيل</h4>
                <div className="delivery-options">
                  {Object.entries(DELIVERY_AREAS).map(([key, area]) => (
                    <label key={key} className="delivery-option">
                      <input
                        type="radio"
                        name="deliveryArea"
                        value={area.name}
                        checked={selectedDeliveryArea === area.name}
                        onChange={(e) =>
                          setSelectedDeliveryArea(e.target.value)
                        }
                      />
                      <span className="delivery-info">
                        <span className="area-name">{area.name}</span>
                        <span className="area-price">{area.price} شيكل</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

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

              {selectedDeliveryArea && (
                <div className="summary-row">
                  <span>التوصيل ({selectedDeliveryArea})</span>
                  <span>{deliveryPrice} شيكل</span>
                </div>
              )}

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

              <button
                className="checkout-btn"
                onClick={handleCheckoutClick}
                disabled={isSubmittingOrder}
              >
                إتمام الطلب
              </button>

              <div className="order-info">
                <p>
                  <i className="fas fa-info-circle"></i>
                  سيتم مراجعة طلبك وتأكيده من قبل الإدارة
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Info Modal */}
      {showUserInfoModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowUserInfoModal(false)}
        >
          <div className="user-info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>معلومات التوصيل</h3>
              <button
                className="close-btn"
                onClick={() => setShowUserInfoModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="user-info-form">
                <input
                  type="text"
                  placeholder="الاسم الكامل *"
                  value={userInfo.name}
                  onChange={(e) => handleUserInfoChange("name", e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="رقم الهاتف *"
                  value={userInfo.phone}
                  onChange={(e) =>
                    handleUserInfoChange("phone", e.target.value)
                  }
                  required
                />
                <textarea
                  placeholder="العنوان التفصيلي *"
                  value={userInfo.address}
                  onChange={(e) =>
                    handleUserInfoChange("address", e.target.value)
                  }
                  rows="3"
                  required
                />
                <textarea
                  placeholder="ملاحظات إضافية (اختياري)"
                  value={userInfo.note}
                  onChange={(e) => handleUserInfoChange("note", e.target.value)}
                  rows="2"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowUserInfoModal(false)}
              >
                إلغاء
              </button>
              <button
                className="submit-btn"
                onClick={handleCheckout}
                disabled={isSubmittingOrder}
              >
                {isSubmittingOrder ? "جاري الإرسال..." : "تأكيد الطلب"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message-overlay">
          <div className="success-message">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>تم إرسال طلبك بنجاح!</h3>
            <p>سنقوم بالتواصل معك قريباً لتأكيد الطلب</p>
            <div className="success-loading">
              <div className="loading-bar"></div>
            </div>
          </div>
        </div>
      )}

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
