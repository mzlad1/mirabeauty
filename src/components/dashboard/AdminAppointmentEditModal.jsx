import React, { useState, useEffect } from "react";
import "./AdminAppointmentEditModal.css";
import useModal from "../../hooks/useModal";
import CustomModal from "../common/CustomModal";

const AdminAppointmentEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  appointment,
  staff = [],
}) => {
  const { modalState, closeModal, showError } = useModal();
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

  const [formData, setFormData] = useState({
    date: appointment?.date || "",
    time: appointment?.time || "",
    staffId: appointment?.staffId || "",
    staffName: appointment?.staffName || "",
    status: appointment?.status || "مؤكد",
    adminNote: appointment?.adminNote || "",
  });

  const [loading, setLoading] = useState(false);

  // Update form data when appointment changes
  useEffect(() => {
    if (appointment) {
      setFormData({
        date: appointment.date || "",
        time: appointment.time || "",
        staffId: appointment.staffId || "",
        staffName: appointment.staffName || "",
        status: appointment.status || "مؤكد",
        adminNote: appointment.adminNote || "",
      });
    }
  }, [appointment]);

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  const statusOptions = ["في الانتظار", "مؤكد", "مكتمل", "ملغي"];

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find selected staff member
      const selectedStaff = staff.find((s) => s.id === formData.staffId);
      const updatedData = {
        ...formData,
        staffName: selectedStaff ? selectedStaff.name : formData.staffName,
      };

      await onSubmit(updatedData);
      onClose();
    } catch (error) {
      console.error("Error submitting appointment edit:", error);
      showError("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStaffChange = (e) => {
    const staffId = e.target.value;
    const selectedStaff = staff.find((s) => s.id === staffId);

    setFormData((prev) => ({
      ...prev,
      staffId: staffId,
      staffName: selectedStaff ? selectedStaff.name : "",
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="admin-appointment-edit-modal-overlay" onClick={onClose}>
      <div
        className="admin-appointment-edit-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-appointment-edit-modal-header">
          <h3>تعديل الموعد وتعيين الأخصائية</h3>
          <button
            className="admin-appointment-edit-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="admin-appointment-edit-modal-form"
        >
          <div className="admin-appointment-edit-info-section">
            <div className="admin-appointment-edit-info-item">
              <span className="label">العميل:</span>
              <span className="value">{appointment?.customerName}</span>
            </div>
            <div className="admin-appointment-edit-info-item">
              <span className="label">الخدمة:</span>
              <span className="value">{appointment?.serviceName}</span>
            </div>
            <div className="admin-appointment-edit-info-item">
              <span className="label">السعر:</span>
              <span className="value">
                {formatPrice(appointment?.servicePrice || appointment?.price)}
              </span>
            </div>
          </div>

          <div className="admin-appointment-edit-form-row">
            <div className="admin-appointment-edit-form-group">
              <label htmlFor="staffId">تعيين الأخصائية *</label>
              <select
                id="staffId"
                name="staffId"
                value={formData.staffId}
                onChange={handleStaffChange}
                required
                className="admin-appointment-edit-form-input"
              >
                <option value="">اختر الأخصائية</option>
                {staff.map((staffMember) => (
                  <option key={staffMember.id} value={staffMember.id}>
                    {staffMember.name} - {staffMember.specialization || "عام"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-appointment-edit-form-row">
            <div className="admin-appointment-edit-form-group">
              <label htmlFor="date">التاريخ *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={getMinDate()}
                required
                className="admin-appointment-edit-form-input"
              />
            </div>
          </div>

          <div className="admin-appointment-edit-form-row">
            <div className="admin-appointment-edit-form-group">
              <label htmlFor="time">الوقت *</label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="admin-appointment-edit-form-input"
              >
                <option value="">اختر الوقت</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-appointment-edit-form-row">
            <div className="admin-appointment-edit-form-group">
              <label htmlFor="status">حالة الموعد *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="admin-appointment-edit-form-input"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer Note - Read Only */}
          {appointment?.customerNote && (
            <div className="admin-appointment-edit-form-row">
              <div className="admin-appointment-edit-form-group">
                <label htmlFor="customerNote">ملاحظة العميل</label>
                <textarea
                  id="customerNote"
                  name="customerNote"
                  value={appointment.customerNote}
                  readOnly
                  className="admin-appointment-edit-form-textarea readonly"
                  rows="3"
                  style={{
                    backgroundColor: "#f5f5f5",
                    cursor: "not-allowed",
                    border: "1px solid #ddd",
                  }}
                />
                <small style={{ color: "#666", fontSize: "0.85rem" }}>
                  <i className="fas fa-lock"></i> هذه الملاحظة من العميل ولا
                  يمكن تعديلها
                </small>
              </div>
            </div>
          )}

          {/* Staff Note - Editable */}
          <div className="admin-appointment-edit-form-row">
            <div className="admin-appointment-edit-form-group">
              <label htmlFor="adminNote">
                ملاحظة للعميل من الإدارة{" "}
                <span style={{ color: "#071626", fontWeight: "600" }}>
                  (سيتم إرسالها للعميل)
                </span>
              </label>
              <textarea
                id="adminNote"
                name="adminNote"
                value={formData.adminNote}
                onChange={handleChange}
                className="admin-appointment-edit-form-textarea"
                rows="4"
                placeholder="أضف ملاحظة للعميل... سيتم عرضها في صفحة ملفه الشخصي"
              />
              <small style={{ color: "#0f2a5a", fontSize: "0.85rem" }}>
                <i className="fas fa-info-circle"></i> سيرى العميل هذه الملاحظة
                في صفحة الملف الشخصي مع إشارة أنها من الإدارة
              </small>
            </div>
          </div>

          <div className="admin-appointment-edit-notice">
            <i className="fas fa-info-circle"></i>
            <p>
              كمدير، يمكنك تعيين الأخصائية المناسبة وتحديث جميع تفاصيل الموعد.
              يمكنك أيضاً إضافة ملاحظة للعميل سيتم عرضها في ملفه الشخصي.
            </p>
          </div>

          <div className="admin-appointment-edit-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="admin-appointment-edit-btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="admin-appointment-edit-btn-primary"
              disabled={loading}
            >
              {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>

      <CustomModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm || closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancel={modalState.showCancel}
      />
    </div>
  );
};

export default AdminAppointmentEditModal;
