import React from "react";
import AdminLayout from "../../components/AdminLayout";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { products } from "../../data/arabicData";
import "./Products.css";

const AdminProducts = () => {
  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-page-header">
            <h1>إدارة المنتجات</h1>
            <p>عرض وإدارة جميع منتجات المركز</p>
          </div>

          <div className="admin-page-actions">
            <Button variant="primary" size="lg">
              إضافة منتج جديد
            </Button>
          </div>

          <div className="admin-products-grid">
            {products.map((product) => (
              <LuxuryCard key={product.id} className="admin-product-card">
                <div className="admin-product-image">{product.image}</div>
                <div className="admin-product-header">
                  <h3>{product.name}</h3>
                  <span className="category-badge">{product.category}</span>
                </div>
                <p>{product.description}</p>
                <div className="admin-product-details">
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
                <div className="admin-product-actions">
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
    </AdminLayout>
  );
};

export default AdminProducts;
