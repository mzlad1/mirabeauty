import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  // Debug logging
  console.log("ProductCard - Product data:", {
    id: product.id,
    name: product.name,
    image: product.image,
    images: product.images,
    primaryImageIndex: product.primaryImageIndex
  });

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  // Get primary image or first image - handle object-based images
  const primaryImage = product.images && product.images.length > 0 
    ? (product.images[product.primaryImageIndex || 0]?.url || product.images[product.primaryImageIndex || 0])
    : product.image || '/assets/default-product.jpg';

  console.log("ProductCard - Primary image selected:", primaryImage);

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
          src={primaryImage}
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
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4" />
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
