import React, { useState, useEffect } from "react";
import "./AdminAppointmentEditModal.css";
import useModal from "../../hooks/useModal";
import CustomModal from "../common/CustomModal";
import { getAllServices } from "../../services/servicesService";
import { getAllServiceCategories } from "../../services/categoriesService";
import { checkStaffAvailabilityWithDuration } from "../../services/appointmentsService";

const AdminAppointmentEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  appointment,
  staff = [],
  specializations = [],
}) => {
  const { modalState, closeModal, showError } = useModal();
  const [services, setServices] = useState([]);
  const [staffAvailability, setStaffAvailability] = useState({
    isChecking: false,
    available: true,
    conflicts: [],
  });
  const [categories, setCategories] = useState([]);

  // Helper function to get specialization name by ID
  const getSpecializationName = (specializationId) => {
    if (!specializationId) return "غير محدد";
    const specialization = specializations.find(
      (s) => s.id === specializationId
    );
    return specialization ? specialization.name : "غير محدد";
  };
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
    flexibleStartHour: "",
    flexibleStartMinute: "",
    useTimeInput: false, // Toggle between hour/minute dropdowns and time input
  });

  const [loading, setLoading] = useState(false);

  // Constants for hour/minute dropdowns
  const FLEXIBLE_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16];
  const FLEXIBLE_MINUTES = ["00", "15", "30", "45"];

  // Load services and categories
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [servicesData, categoriesData] = await Promise.all([
        getAllServices(),
        getAllServiceCategories(),
      ]);
      setServices(servicesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  // Update form data when appointment changes
  useEffect(() => {
    if (appointment) {
      // Parse time if it exists for flexible time services
      const [hour, minute] = appointment.time
        ? appointment.time.split(":")
        : ["", ""];

      setFormData({
        date: appointment.date || "",
        time: appointment.time || "",
        staffId: appointment.staffId || "",
        staffName: appointment.staffName || "",
        status: appointment.status || "مؤكد",
        adminNote: appointment.adminNote || "",
        flexibleStartHour: hour || "",
        flexibleStartMinute: minute || "",
        useTimeInput: false,
      });
    }
  }, [appointment]);

  // Category helper functions
  const getServiceCategory = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return null;
    const categoryId = service.categoryId || service.category;
    return categories.find((c) => c.id === categoryId);
  };

  const getCategoryFromAppointment = () => {
    if (!appointment?.serviceId) return null;
    return getServiceCategory(appointment.serviceId);
  };

  const getCategoryTimeType = () => {
    const category = getCategoryFromAppointment();
    return category?.timeType || "fixed";
  };

  const getCategoryFixedTimeSlots = () => {
    const category = getCategoryFromAppointment();
    return (
      category?.fixedTimeSlots || ["08:30", "10:00", "11:30", "13:00", "15:00"]
    );
  };

  const isFixedTimeService = () => {
    return getCategoryTimeType() === "fixed";
  };

  // Fallback time slots
  const defaultTimeSlots = [
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

  // Get time slots based on service category
  const getTimeSlots = () => {
    if (isFixedTimeService()) {
      return getCategoryFixedTimeSlots();
    }
    // For flexible time services, allow manual time input or show default slots
    return defaultTimeSlots;
  };

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

      // Check for staff conflicts if staff is assigned and time/date changed
      if (
        formData.staffId &&
        (formData.date !== appointment?.date ||
          formData.time !== appointment?.time)
      ) {
        // Get appointment duration
        const duration =
          appointment?.serviceDuration || appointment?.duration || 60;

        // Check for conflicts
        const availabilityCheck = await checkStaffAvailabilityWithDuration(
          formData.staffId,
          formData.date,
          formData.time,
          duration,
          appointment?.id // Exclude current appointment
        );

        if (!availabilityCheck.available) {
          const conflictDetails = availabilityCheck.conflicts
            .map((c) => `- ${c.customerName} (${c.serviceName}) في ${c.time}`)
            .join("\n");

          showError(
            `الأخصائية ${
              selectedStaff?.name || "المحددة"
            } لديها تعارض في المواعيد:\n\n${conflictDetails}\n\nالرجاء اختيار وقت آخر أو أخصائية أخرى.`
          );
          setLoading(false);
          return;
        }
      }

      const updatedData = {
        ...formData,
        staffName: selectedStaff ? selectedStaff.name : formData.staffName,
      };

      await onSubmit(updatedData);
      onClose();
    } catch (error) {
      console.error("Error submitting appointment edit:", error);
      // Don't show error here - parent already handles it
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

  const handleStaffChange = async (e) => {
    const staffId = e.target.value;
    const selectedStaff = staff.find((s) => s.id === staffId);

    setFormData((prev) => ({
      ...prev,
      staffId: staffId,
      staffName: selectedStaff ? selectedStaff.name : "",
    }));

    // Check availability immediately when staff is selected
    if (staffId && formData.date && formData.time) {
      await checkStaffAvailability(staffId);
    } else {
      // Reset availability state if no staff selected
      setStaffAvailability({
        isChecking: false,
        available: true,
        conflicts: [],
      });
    }
  };

  // Check staff availability function
  const checkStaffAvailability = async (staffId) => {
    if (!staffId || !formData.date || !formData.time) return;

    setStaffAvailability({ isChecking: true, available: true, conflicts: [] });

    try {
      const duration =
        appointment?.serviceDuration || appointment?.duration || 60;

      const availabilityCheck = await checkStaffAvailabilityWithDuration(
        staffId,
        formData.date,
        formData.time,
        duration,
        appointment?.id
      );

      setStaffAvailability({
        isChecking: false,
        available: availabilityCheck.available,
        conflicts: availabilityCheck.conflicts || [],
      });
    } catch (error) {
      console.error("Error checking staff availability:", error);
      setStaffAvailability({ isChecking: false, available: true, conflicts: [] });
    }
  };

  // Re-check availability when date or time changes
  useEffect(() => {
    if (formData.staffId && formData.date && formData.time) {
      checkStaffAvailability(formData.staffId);
    }
  }, [formData.date, formData.time]);

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
                className="admin-appointment-edit-form-input"
              >
                <option value="">اختر الأخصائية</option>
                {staff.map((staffMember) => (
                  <option key={staffMember.id} value={staffMember.id}>
                    {staffMember.name} -{" "}
                    {getSpecializationName(staffMember.specialization)}
                  </option>
                ))}
              </select>
              
              {/* Staff Availability Warning */}
              {staffAvailability.isChecking && (
                <div className="staff-availability-checking">
                  <i className="fas fa-spinner fa-spin"></i> جاري التحقق من توفر الأخصائية...
                </div>
              )}
              
              {!staffAvailability.isChecking && !staffAvailability.available && staffAvailability.conflicts.length > 0 && (
                <div className="staff-availability-warning">
                  <div className="warning-header">
                    <i className="fas fa-exclamation-triangle"></i>
                    <strong>تحذير: الأخصائية مشغولة</strong>
                  </div>
                  <div className="warning-content">
                    <p>الأخصائية لديها تعارض في المواعيد التالية:</p>
                    <ul className="conflict-list">
                      {staffAvailability.conflicts.map((conflict, index) => (
                        <li key={index}>
                          {conflict.customerName} ({conflict.serviceName}) في {conflict.time}
                        </li>
                      ))}
                    </ul>
                    <p className="warning-note">
                      <i className="fas fa-info-circle"></i> يمكنك المتابعة بالحفظ إذا كنت متأكداً من التعيين
                    </p>
                  </div>
                </div>
              )}
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

          {/* Time Selection */}
          {isFixedTimeService() ? (
            /* Fixed Time Services - Dropdown */
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
                  {getTimeSlots().map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <small
                  style={{
                    color: "#666",
                    fontSize: "0.85rem",
                    marginTop: "0.25rem",
                    display: "block",
                  }}
                >
                  هذه الخدمة تستخدم أوقات ثابتة محددة في التصنيف
                </small>
              </div>
            </div>
          ) : (
            /* Flexible Time Services - Hour/Minute or Time Input */
            <>
              <div className="admin-appointment-edit-form-row">
                <div className="admin-appointment-edit-form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.useTimeInput}
                      onChange={(e) => {
                        const useInput = e.target.checked;
                        setFormData({
                          ...formData,
                          useTimeInput: useInput,
                          time: useInput
                            ? formData.time
                            : `${formData.flexibleStartHour}:${formData.flexibleStartMinute}`,
                        });
                      }}
                      style={{ marginLeft: "0.5rem" }}
                    />
                    استخدام إدخال الوقت المباشر
                  </label>
                </div>
              </div>

              {formData.useTimeInput ? (
                /* Time Input Field */
                <div className="admin-appointment-edit-form-row">
                  <div className="admin-appointment-edit-form-group">
                    <label htmlFor="time">الوقت *</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="admin-appointment-edit-form-input"
                    />
                    <small
                      style={{
                        color: "#666",
                        fontSize: "0.85rem",
                        marginTop: "0.25rem",
                        display: "block",
                      }}
                    >
                      يمكن إدخال أي وقت مباشرة
                    </small>
                  </div>
                </div>
              ) : (
                /* Hour and Minute Dropdowns */
                <div
                  className="admin-appointment-edit-form-row"
                  style={{ display: "flex", gap: "1rem" }}
                >
                  <div
                    className="admin-appointment-edit-form-group"
                    style={{ flex: 1 }}
                  >
                    <label htmlFor="flexibleStartHour">الساعة *</label>
                    <select
                      id="flexibleStartHour"
                      value={formData.flexibleStartHour}
                      onChange={(e) => {
                        const hour = e.target.value;
                        setFormData({
                          ...formData,
                          flexibleStartHour: hour,
                          time:
                            hour && formData.flexibleStartMinute
                              ? `${hour}:${formData.flexibleStartMinute}`
                              : "",
                        });
                      }}
                      required
                      className="admin-appointment-edit-form-input"
                    >
                      <option value="">اختر الساعة</option>
                      {FLEXIBLE_HOURS.map((hour) => (
                        <option
                          key={hour}
                          value={String(hour).padStart(2, "0")}
                        >
                          {String(hour).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    className="admin-appointment-edit-form-group"
                    style={{ flex: 1 }}
                  >
                    <label htmlFor="flexibleStartMinute">الدقائق *</label>
                    <select
                      id="flexibleStartMinute"
                      value={formData.flexibleStartMinute}
                      onChange={(e) => {
                        const minute = e.target.value;
                        setFormData({
                          ...formData,
                          flexibleStartMinute: minute,
                          time:
                            formData.flexibleStartHour && minute
                              ? `${formData.flexibleStartHour}:${minute}`
                              : "",
                        });
                      }}
                      required
                      className="admin-appointment-edit-form-input"
                    >
                      <option value="">اختر الدقائق</option>
                      {FLEXIBLE_MINUTES.map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="admin-appointment-edit-form-row">
                <small
                  style={{
                    color: "#666",
                    fontSize: "0.85rem",
                    display: "block",
                  }}
                >
                  هذه الخدمة تستخدم أوقات مرنة - يمكن استخدام القوائم المنسدلة
                  أو إدخال الوقت مباشرة
                </small>
              </div>
            </>
          )}

          {/* Status field removed - status changes are now handled via table actions (confirm, complete, cancel buttons) */}

          {/* Customer Note - Read Only */}
          {appointment?.notes && (
            <div className="admin-appointment-edit-form-row">
              <div className="admin-appointment-edit-form-group">
                <label htmlFor="notes">ملاحظة العميل</label>
                <span className="detail-value">{appointment.notes}</span>
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
