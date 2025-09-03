import React from "react";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { services } from "../../data/arabicData";
import "./AdminPage.css";

const AdminServices = () => {
  const allServices = [
    ...services.laser,
    ...services.skincare,
    ...services.vip,
  ];

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>إدارة الخدمات</h1>
          <p>عرض وإدارة جميع خدمات المركز</p>
        </div>

        <div className="page-actions">
          <Button variant="primary" size="lg">
            إضافة خدمة جديدة
          </Button>
        </div>

        <div className="services-grid">
          {allServices.map((service) => (
            <LuxuryCard key={service.id} className="service-card">
              <div className="service-header">
                <h3>{service.name}</h3>
                <span
                  className={`section-badge ${
                    service.id <= 4
                      ? "laser"
                      : service.id <= 8
                      ? "skincare"
                      : "vip"
                  }`}
                >
                  {service.id <= 4
                    ? "ليزر"
                    : service.id <= 8
                    ? "عناية بالبشرة"
                    : "VIP"}
                </span>
              </div>
              <p>{service.description}</p>
              <div className="service-details">
                <div className="detail-item">
                  <span>المدة: {service.duration}</span>
                </div>
                <div className="detail-item">
                  <span>السعر: {service.price}</span>
                </div>
                <div className="detail-item">
                  <span
                    className={`status ${
                      service.popular ? "popular" : "normal"
                    }`}
                  >
                    {service.popular ? "الأكثر طلباً" : "عادي"}
                  </span>
                </div>
              </div>
              <div className="service-actions">
                <Button variant="secondary" size="sm">
                  تعديل
                </Button>
                <Button variant="primary" size="sm">
                  تفعيل/إلغاء
                </Button>
              </div>
            </LuxuryCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
