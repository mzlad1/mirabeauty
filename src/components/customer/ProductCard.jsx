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
    navigate("/products");
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
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {discountPercentage > 0 && (
          <div className="product-discount-badge">-{discountPercentage}%</div>
        )}
        {!product.inStock && (
          <div className="product-out-of-stock">نفد المخزون</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-rating">
          <span className="rating-stars">
            {"⭐".repeat(Math.floor(product.rating))}
          </span>
          <span className="rating-text">
            {product.rating} ({product.reviewsCount} تقييم)
          </span>
        </div>

        <div className="product-pricing">
          <span className="current-price">{product.price}</span>
          {product.originalPrice && (
            <span className="original-price">{product.originalPrice}</span>
          )}
        </div>

        <button
          className={`add-to-cart-btn ${!product.inStock ? "disabled" : ""}`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? "أضيفي للسلة" : "نفد المخزون"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
