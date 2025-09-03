import React from "react";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { products } from "../../data/arabicData";
import "./AdminPage.css";

const AdminProducts = () => {
  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>إدارة المنتجات</h1>
          <p>عرض وإدارة جميع منتجات المركز</p>
        </div>

        <div className="page-actions">
          <Button variant="primary" size="lg">
            إضافة منتج جديد
          </Button>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <LuxuryCard key={product.id} className="product-card">
              <div className="product-image">{product.image}</div>
              <div className="product-header">
                <h3>{product.name}</h3>
                <span className="category-badge">{product.category}</span>
              </div>
              <p>{product.description}</p>
              <div className="product-details">
                <div className="price-container">
                  <span className="current-price">{product.price}</span>
                  <span className="original-price">
                    {product.originalPrice}
                  </span>
                </div>
                <div className="discount-info">
                  <span>خصم {product.discount}%</span>
                </div>
              </div>
              <div className="product-actions">
                <Button variant="secondary" size="sm">
                  تعديل
                </Button>
                <Button variant="primary" size="sm">
                  عرض/إخفاء
                </Button>
              </div>
            </LuxuryCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
