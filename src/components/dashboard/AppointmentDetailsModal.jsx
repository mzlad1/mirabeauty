import React from "react";
import "./AppointmentDetailsModal.css";

const AppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointment,
  userRole = "staff", // "staff" or "admin"
}) => {
  if (!isOpen || !appointment) return null;

  // Helper function to format price display (avoid duplicate currency)
  const formatPrice = (priceString) => {
    if (!priceString) return "0 شيكل";
    const priceStr = priceString.toString();
    // If price already contains "شيكل", return as is
    if (priceStr.includes("شيكل")) {
      return priceStr;
    }
    // If it's just a number, add "شيكل"
    return `${priceStr} شيكل`;
  };

  const handleClose = () => {
    onClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "مؤكد":
        return "confirmed";
      case "مكتمل":
        return "completed";
      case "ملغي":
        return "cancelled";
      case "في الانتظار":
        return "pending";
      default:
        return "pending";
    }
  };

  return (
    <div className="appointment-details-modal-overlay" onClick={handleClose}>
      <div
        className="appointment-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="appointment-details-modal-header">
          <h3>تفاصيل الموعد</h3>
          <button
            className="appointment-details-modal-close"
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        <div className="appointment-details-content">
          <div className="appointment-details-grid">
            <div className="detail-item">
              <span className="detail-label">العميل:</span>
              <span className="detail-value">{appointment.customerName}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">الخدمة:</span>
              <span className="detail-value">{appointment.serviceName}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">التاريخ:</span>
              <span className="detail-value">{appointment.date}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">الوقت:</span>
              <span className="detail-value">{appointment.time}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">المدة:</span>
              <span className="detail-value">
                {appointment.serviceDuration || appointment.duration}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">السعر:</span>
              <span className="detail-value">
                {formatPrice(appointment.servicePrice || appointment.price)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">الحالة:</span>
              <span
                className={`detail-value status ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
            </div>

            {userRole === "staff" && appointment.staffName && (
              <div className="detail-item">
                <span className="detail-label">الأخصائية:</span>
                <span className="detail-value">{appointment.staffName}</span>
              </div>
            )}

            {appointment.customerPhone && (
              <div className="detail-item">
                <span className="detail-label">رقم الهاتف:</span>
                <span className="detail-value">
                  {appointment.customerPhone}
                </span>
              </div>
            )}

            {appointment.notes && (
              <div className="detail-item full-width">
                <span className="detail-label">ملاحظات العميل:</span>
                <span className="detail-value">{appointment.notes}</span>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="appointment-notes-section">
            {/* 1. Customer Note (when booking) */}
            {appointment.customerNote && (
              <div className="note-item customer-note">
                <h4>
                  <i className="fas fa-comment"></i> ملاحظة العميل (عند الحجز):
                </h4>
                <p>{appointment.customerNote}</p>
              </div>
            )}

            {/* 2. Admin Note to Customer (when accepting) */}
            {appointment.adminNote && (
              <div className="note-item admin-note">
                <h4>
                  <i className="fas fa-user-shield"></i> ملاحظة الإدارة للعميل
                  (عند القبول أو الالغاء):
                </h4>
                <p>{appointment.adminNote}</p>
              </div>
            )}

            {/* 3. Staff Note to Customer (after completion) */}
            {appointment.staffNoteToCustomer && (
              <div className="note-item staff-note-customer">
                <h4>
                  <i className="fas fa-user-nurse"></i> ملاحظة الموظفة للعميل
                  (بعد الجلسة):
                </h4>
                <p>{appointment.staffNoteToCustomer}</p>
              </div>
            )}

            {/* 4. Staff Internal Note (only for admin/staff) */}
            {appointment.staffInternalNote && (
              <div className="note-item staff-internal-note">
                <h4>
                  <i className="fas fa-lock"></i> ملاحظة داخلية (للموظفين
                  والإدارة فقط):
                </h4>
                <p>{appointment.staffInternalNote}</p>
              </div>
            )}

            {!appointment.customerNote &&
              !appointment.adminNote &&
              !appointment.staffNoteToCustomer &&
              !appointment.staffInternalNote && (
                <div className="no-notes">
                  <p>لا توجد ملاحظات لهذا الموعد</p>
                </div>
              )}
          </div>
        </div>

        <div className="appointment-details-modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
