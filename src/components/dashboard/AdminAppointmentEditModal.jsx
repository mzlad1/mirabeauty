import React, { useState, useEffect } from "react";
import "./AdminAppointmentEditModal.css";

const AdminAppointmentEditModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  appointment, 
  staff = [] 
}) => {
  const [formData, setFormData] = useState({
    date: appointment?.date || "",
    time: appointment?.time || "",
    staffId: appointment?.staffId || "",
    staffName: appointment?.staffName || "",
    status: appointment?.status || "مؤكد",
    notes: appointment?.notes || "",
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
        notes: appointment.notes || "",
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

  const statusOptions = [
    "في الانتظار",
    "مؤكد",
    "مكتمل",
    "ملغي"
  ];

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find selected staff member
      const selectedStaff = staff.find(s => s.id === formData.staffId);
      const updatedData = {
        ...formData,
        staffName: selectedStaff ? selectedStaff.name : formData.staffName
      };
      
      await onSubmit(updatedData);
      onClose();
    } catch (error) {
      console.error("Error submitting appointment edit:", error);
      alert("حدث خطأ أثناء الحفظ");
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
    const selectedStaff = staff.find(s => s.id === staffId);
    
    setFormData((prev) => ({
      ...prev,
      staffId: staffId,
      staffName: selectedStaff ? selectedStaff.name : ""
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="admin-appointment-edit-modal-overlay" onClick={onClose}>
      <div className="admin-appointment-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-appointment-edit-modal-header">
          <h3>تعديل الموعد وتعيين الأخصائية</h3>
          <button className="admin-appointment-edit-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-appointment-edit-modal-form">
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
              <span className="value">{appointment?.servicePrice || appointment?.price} شيكل</span>
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

          <div className="admin-appointment-edit-form-row">
            <div className="admin-appointment-edit-form-group">
              <label htmlFor="notes">ملاحظات إضافية (اختياري)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="admin-appointment-edit-form-textarea"
                rows="4"
                placeholder="أي ملاحظات أو طلبات خاصة..."
              />
            </div>
          </div>

          <div className="admin-appointment-edit-notice">
            <i className="fas fa-info-circle"></i>
            <p>
              كمدير، يمكنك تعيين الأخصائية المناسبة وتحديث جميع تفاصيل الموعد.
              سيتم إشعار العميل والأخصائية بأي تغييرات.
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
    </div>
  );
};

export default AdminAppointmentEditModal;