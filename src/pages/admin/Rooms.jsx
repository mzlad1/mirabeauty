import React from "react";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { adminData } from "../../data/arabicData";
import "./AdminPage.css";

const AdminRooms = () => {
  const rooms = adminData.rooms;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>إدارة الغرف</h1>
          <p>عرض وإدارة جميع غرف المركز</p>
        </div>

        <div className="page-actions">
          <Button variant="primary" size="lg">
            إضافة غرفة جديدة
          </Button>
        </div>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <LuxuryCard key={room.id} className="room-card">
              <div className="room-header">
                <h3>{room.name}</h3>
                <span
                  className={`status-badge ${
                    room.status === "نشطة" ? "active" : "inactive"
                  }`}
                >
                  {room.status}
                </span>
              </div>
              <div className="room-details">
                <div className="detail-item">
                  <span>القسم: {room.section}</span>
                </div>
                <div className="detail-item">
                  <span>السعة: {room.capacity} شخص</span>
                </div>
              </div>
              <div className="room-actions">
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

export default AdminRooms;
