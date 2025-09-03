import React from "react";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { adminData } from "../../data/arabicData";
import "./AdminPage.css";

const AdminStaff = () => {
  const staff = adminData.staff;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>إدارة الموظفين</h1>
          <p>عرض وإدارة جميع موظفي المركز</p>
        </div>

        <div className="page-actions">
          <Button variant="primary" size="lg">
            إضافة موظف جديد
          </Button>
        </div>

        <div className="staff-grid">
          {staff.map((member) => (
            <LuxuryCard key={member.id} className="staff-card">
              <div className="staff-header">
                <div className="staff-avatar">{member.avatar}</div>
                <div className="staff-info">
                  <h3>{member.name}</h3>
                  <span className="section-badge">{member.section}</span>
                </div>
              </div>
              <div className="staff-details">
                <div className="detail-item">
                  <span>ساعات العمل: {member.hours}</span>
                </div>
              </div>
              <div className="staff-actions">
                <Button variant="secondary" size="sm">
                  تعديل
                </Button>
                <Button variant="primary" size="sm">
                  عرض الجدول
                </Button>
              </div>
            </LuxuryCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStaff;
