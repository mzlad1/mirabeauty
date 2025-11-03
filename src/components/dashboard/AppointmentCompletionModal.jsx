import React, { useState } from "react";
import "./AppointmentCompletionModal.css";

const AppointmentCompletionModal = ({
  isOpen,
  onClose,
  appointment,
  onComplete,
}) => {
  const [customerNote, setCustomerNote] = useState("");
  const [staffNote, setStaffNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onComplete(appointment.id, customerNote, staffNote);
      // Reset form
      setCustomerNote("");
      setStaffNote("");
      onClose();
    } catch (error) {
      console.error("Error completing appointment:", error);
      alert("حدث خطأ أثناء إتمام الموعد");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCustomerNote("");
      setStaffNote("");
      onClose();
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="appointment-completion-modal-overlay" onClick={handleClose}>
      <div
        className="appointment-completion-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="appointment-completion-modal-header">
          <h3>إتمام الموعد</h3>
          <button
            className="appointment-completion-modal-close"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <div className="appointment-completion-info">
          <div className="completion-info-item">
            <span className="label">العميل:</span>
            <span className="value">{appointment.customerName}</span>
          </div>
          <div className="completion-info-item">
            <span className="label">الخدمة:</span>
            <span className="value">{appointment.serviceName}</span>
          </div>
          <div className="completion-info-item">
            <span className="label">التاريخ:</span>
            <span className="value">{appointment.date}</span>
          </div>
          <div className="completion-info-item">
            <span className="label">الوقت:</span>
            <span className="value">{appointment.time}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="appointment-completion-form">
          <div className="completion-form-group">
            <label htmlFor="customerNote">
              <i className="fas fa-user"></i>
              ملاحظات للعميل
              <span className="note-description">
                (سيتمكن العميل من رؤية هذه الملاحظات)
              </span>
            </label>
            <textarea
              id="customerNote"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="أضف ملاحظات للعميل حول الجلسة أو نصائح للعناية"
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          <div className="completion-form-group">
            <label htmlFor="staffNote">
              <i className="fas fa-user-md"></i>
              ملاحظات داخلية
              <span className="note-description">
                (ملاحظات خاصة للموظفين والإدارة فقط)
              </span>
            </label>
            <textarea
              id="staffNote"
              value={staffNote}
              onChange={(e) => setStaffNote(e.target.value)}
              placeholder="أضف ملاحظات خاصة أو مهمة للجلسات القادمة و للمركز"
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          <div className="completion-modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  جاري الإتمام...
                </>
              ) : (
                <>إتمام الموعد</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentCompletionModal;
