import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const discountPercentage =
    product.originalPrice && product.price
      ? Math.round(
          ((parseFloat(product.originalPrice.replace(" شيكل", "")) -
            parseFloat(product.price.replace(" شيكل", ""))) /
            parseFloat(product.originalPrice.replace(" شيكل", ""))) *
            100
        )
      : 0;

  return (
    <div className="product-card-wrapper" onClick={handleCardClick}>
      <div className="product-card-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        {discountPercentage > 0 && (
          <div className="product-card-discount-badge">
            -{discountPercentage}%
          </div>
        )}
        {!product.inStock && (
          <div className="product-card-out-of-stock">نفد المخزون</div>
        )}
        {product.inStock && (
          <button
            className="product-card-add-to-cart-icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            title="إضافة إلى السلة"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-0.16 0.28-0.25 0.61-0.25 0.96 0 1.1 0.9 2 2 2h12v-2H7.42c-0.14 0-0.25-0.11-0.25-0.25l0.03-0.12L8.1 13h7.45c0.75 0 1.41-0.42 1.75-1.03L21.7 4H5.21l-0.94-2H1zm16 16c-1.1 0-2 0.9-2 2s0.9 2 2 2 2-0.9 2-2-0.9-2-2-2z" />
            </svg>
          </button>
        )}
      </div>

      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        {/* <p className="product-card-description">{product.description}</p> */}

        <div className="product-card-rating">
          <span className="product-card-rating-stars">
            {"⭐".repeat(Math.floor(product.rating))}
          </span>
          <span className="product-card-rating-text">
            {product.rating} ({product.reviewsCount} تقييم)
          </span>
        </div>

        <div className="product-card-pricing">
          <span className="product-card-current-price">{product.price}</span>
          {product.originalPrice && (
            <span className="product-card-original-price">
              {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
