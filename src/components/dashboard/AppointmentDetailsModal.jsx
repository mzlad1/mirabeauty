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
                {appointment.serviceDuration || appointment.duration} دقيقة
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
                <span className="detail-label">ملاحظات:</span>
                <span className="detail-value">{appointment.notes}</span>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="appointment-notes-section">
            {appointment.customerNote && (
              <div className="note-item customer-note">
                <h4>ملاحظات للعميل:</h4>
                <p>{appointment.customerNote}</p>
              </div>
            )}

            {appointment.staffNote && (
              <div className="note-item staff-note">
                <h4>ملاحظات الموظف:</h4>
                <p>{appointment.staffNote}</p>
              </div>
            )}

            {!appointment.customerNote && !appointment.staffNote && (
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
