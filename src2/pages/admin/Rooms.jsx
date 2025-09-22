import React from "react";
import AdminLayout from "../../components/AdminLayout";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { adminData } from "../../data/arabicData";
import "./Rooms.css";

const AdminRooms = () => {
  const rooms = adminData.rooms;

  return (
    <AdminLayout>
      <div className="admin-rooms-page">
        <div className="admin-rooms-container">
          <div className="admin-rooms-header">
            <h1>إدارة الغرف</h1>
            <p>عرض وإدارة جميع غرف المركز</p>
          </div>

          <div className="admin-rooms-actions">
            <Button variant="primary" size="lg">
              إضافة غرفة جديدة
            </Button>
          </div>

          <div className="admin-rooms-grid">
            {rooms.map((room) => (
              <LuxuryCard key={room.id} className="admin-rooms-card">
                <div className="admin-rooms-card-header">
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
    </AdminLayout>
  );
};

export default AdminRooms;
