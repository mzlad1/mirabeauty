import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { adminData } from "../../data/arabicData";
import "./Bookings.css";

const Bookings = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState("all");

  const bookings = adminData.bookings;
  const filters = [
    { id: "all", label: "جميع الحجوزات" },
    { id: "مؤكدة", label: "مؤكدة" },
    { id: "مكتملة", label: "مكتملة" },
    { id: "ملغية", label: "ملغية" },
    { id: "ليزر", label: "ليزر" },
    { id: "عناية بالبشرة", label: "عناية بالبشرة" },
    { id: "VIP", label: "VIP" },
  ];

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter(
          (booking) => booking.status === filter || booking.section === filter
        );

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const closeBookingDetails = () => {
    setSelectedBooking(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "مؤكدة":
        return "confirmed";
      case "مكتملة":
        return "completed";
      case "ملغية":
        return "cancelled";
      default:
        return "primary";
    }
  };

  return (
    <AdminLayout>
      <div className="admin-bookings">
        <div className="admin-bookings-container">
          {/* Header */}
          <div className="admin-bookings-header">
            <h1>إدارة الحجوزات</h1>
            <p>عرض وإدارة جميع حجوزات العملاء</p>
          </div>

          {/* Filters */}
          <div className="bookings-filters">
            <div className="filter-tabs">
              {filters.map((filterItem) => (
                <button
                  key={filterItem.id}
                  className={`filter-tab ${
                    filter === filterItem.id ? "active" : ""
                  }`}
                  onClick={() => setFilter(filterItem.id)}
                >
                  {filterItem.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table */}
          <LuxuryCard className="bookings-table">
            <div className="table-header">
              <h3>قائمة الحجوزات</h3>
              <div className="table-actions">
                <Button variant="primary" size="sm">
                  إضافة حجز جديد
                </Button>
              </div>
            </div>

            <div className="table-content">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="booking-row">
                  <div className="booking-info">
                    <div className="customer-info">
                      <h4>{booking.customer}</h4>
                      <p>{booking.service}</p>
                    </div>
                    <div className="booking-details">
                      <span className="detail-item">
                        <strong>القسم:</strong> {booking.section}
                      </span>
                      <span className="detail-item">
                        <strong>الغرفة:</strong> {booking.room}
                      </span>
                      <span className="detail-item">
                        <strong>الموظف:</strong> {booking.staff}
                      </span>
                      <span className="detail-item">
                        <strong>التاريخ:</strong> {booking.date} -{" "}
                        {booking.time}
                      </span>
                    </div>
                  </div>
                  <div className="booking-status">
                    <span
                      className={`status-badge ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                    <div className="booking-actions">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openBookingDetails(booking)}
                      >
                        عرض التفاصيل
                      </Button>
                      <Button variant="primary" size="sm">
                        تعديل
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </LuxuryCard>

          {/* Booking Details Modal */}
          {selectedBooking && (
            <div className="modal-overlay" onClick={closeBookingDetails}>
              <LuxuryCard
                className="booking-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>تفاصيل الحجز</h3>
                  <button className="close-btn" onClick={closeBookingDetails}>
                    ×
                  </button>
                </div>
                <div className="modal-content">
                  <div className="modal-section">
                    <h4>معلومات العميلة</h4>
                    <div className="modal-details">
                      <div className="detail-item">
                        <span className="label">الاسم:</span>
                        <span className="value">
                          {selectedBooking.customer}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-section">
                    <h4>معلومات الجلسة</h4>
                    <div className="modal-details">
                      <div className="detail-item">
                        <span className="label">الخدمة:</span>
                        <span className="value">{selectedBooking.service}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">القسم:</span>
                        <span className="value">{selectedBooking.section}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">الغرفة:</span>
                        <span className="value">{selectedBooking.room}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">الموظف المسؤول:</span>
                        <span className="value">{selectedBooking.staff}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">التاريخ والوقت:</span>
                        <span className="value">
                          {selectedBooking.date} - {selectedBooking.time}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">الحالة:</span>
                        <span
                          className={`value status-badge ${getStatusBadge(
                            selectedBooking.status
                          )}`}
                        >
                          {selectedBooking.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-section">
                    <h4>الملاحظات التقنية</h4>
                    <div className="technical-notes">
                      <p>{selectedBooking.notes}</p>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <Button variant="secondary" onClick={closeBookingDetails}>
                      إغلاق
                    </Button>
                    <Button variant="primary">تعديل الحجز</Button>
                    <Button variant="danger">إلغاء الحجز</Button>
                  </div>
                </div>
              </LuxuryCard>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Bookings;
