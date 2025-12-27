import React, { useState, useEffect } from "react";
import "./AdminCreateAppointmentModal.css";
import { getAllServices } from "../../services/servicesService";
import { getUsersByRole } from "../../services/usersService";
import {
  createAppointment,
  getAppointmentsByDate,
  checkStaffAvailabilityWithDuration,
} from "../../services/appointmentsService";
import { getAllServiceCategories } from "../../services/categoriesService";
import { useModal } from "../../hooks/useModal";
import CustomModal from "../common/CustomModal";

// Constants (fallback defaults)
const LASER_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const LASER_MINUTES = ["00", "15", "30", "45"];

const AdminCreateAppointmentModal = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
  userData,
}) => {
  const { modalState, closeModal, showConfirm } = useModal();
  const [formData, setFormData] = useState({
    // Customer info (optional - admin can leave blank)
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    // Service details
    serviceId: "",
    date: "",
    time: "",
    notes: "",
    // Staff assignment
    staffId: "",
    // Flexible time-specific
    laserStartHour: "",
    laserStartMinute: "",
    // Fixed time custom time (admin only)
    useCustomTime: false,
    customStartTime: "",
    customEndTime: "",
  });

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [staffAvailability, setStaffAvailability] = useState({
    isChecking: false,
    available: true,
    conflicts: [],
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [servicesData, staffData, categoriesData] = await Promise.all([
        getAllServices(),
        getUsersByRole("staff"),
        getAllServiceCategories(),
      ]);
      setServices(servicesData.filter((s) => !s.hidden));
      setStaffMembers(staffData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("فشل في تحميل البيانات");
    }
  };

  // Category helper functions
  const getServiceCategory = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return null;
    const categoryId = service.categoryId || service.category;
    return categories.find((c) => c.id === categoryId);
  };

  const getCategoryTimeType = (serviceId) => {
    const category = getServiceCategory(serviceId);
    return category?.timeType || "fixed";
  };

  const getCategoryFixedTimeSlots = (serviceId) => {
    const category = getServiceCategory(serviceId);
    return (
      category?.fixedTimeSlots || ["08:30", "10:00", "11:30", "13:00", "15:00"]
    );
  };

  const getCategoryForbiddenStartTimes = (serviceId) => {
    const category = getServiceCategory(serviceId);
    return category?.forbiddenStartTimes || ["08:00", "08:30", "16:30"];
  };

  const getCategoryMaxEndTime = (serviceId) => {
    const category = getServiceCategory(serviceId);
    return category?.maxEndTime || "16:30";
  };

  const isFixedTimeService = (serviceId) => {
    return getCategoryTimeType(serviceId) === "fixed";
  };

  const isFlexibleTimeService = (serviceId) => {
    return getCategoryTimeType(serviceId) === "flexible";
  };

  // Helper functions
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  const calculateLaserEndTime = (startTime, durationMinutes) => {
    const startMinutes = timeToMinutes(startTime);
    // Ensure durationMinutes is a number to prevent string concatenation
    const duration = parseInt(durationMinutes, 10) || 0;
    const endMinutes = startMinutes + duration;
    return minutesToTime(endMinutes);
  };

  const isStartTimeForbidden = (timeStr, serviceId) => {
    const forbiddenTimes = getCategoryForbiddenStartTimes(serviceId);
    return forbiddenTimes.includes(timeStr);
  };

  const validateFlexibleTime = (startTime, durationMinutes, serviceId) => {
    // Admin can use any start time - skip forbidden time check

    const endTime = calculateLaserEndTime(startTime, durationMinutes);
    const maxEndTime = getCategoryMaxEndTime(serviceId);
    const maxEndMinutes = timeToMinutes(maxEndTime);
    const endMinutes = timeToMinutes(endTime);

    if (endMinutes > maxEndMinutes) {
      return {
        valid: true, // Allow with warning
        warning: true,
        endTime,
        message: `تحذير: الجلسة ستنتهي في ${endTime} وهذا يتجاوز الحد الأقصى (${maxEndTime}). هل أنت متأكد من المتابعة؟`,
      };
    }

    return { valid: true, endTime };
  };

  const checkLaserOverlapping = async (date, startTime, endTime) => {
    try {
      const dateAppointments = await getAppointmentsByDate(date);

      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);

      // Get all appointments for the same category
      const selectedService = services.find((s) => s.id === formData.serviceId);
      const serviceCategoryId =
        selectedService?.categoryId || selectedService?.category || "";

      const sameCategoryAppointments = dateAppointments.filter((apt) => {
        if (apt.status === "ملغي") return false;

        // Check if same category
        const aptCategoryId =
          apt.serviceCategory || apt.serviceCategoryName || "";

        return aptCategoryId === serviceCategoryId;
      });

      // Create time events for all appointments
      const events = [];

      // Add new booking events
      events.push({ time: startMinutes, type: "start" });
      events.push({ time: endMinutes, type: "end" });

      // Add existing appointments events
      sameCategoryAppointments.forEach((apt) => {
        const aptStartMinutes = timeToMinutes(apt.time);
        const aptDuration = apt.serviceDuration || 60;
        const aptEndMinutes = aptStartMinutes + aptDuration;

        events.push({ time: aptStartMinutes, type: "start" });
        events.push({ time: aptEndMinutes, type: "end" });
      });

      // Sort events by time, with "end" events before "start" at same time
      events.sort((a, b) => {
        if (a.time !== b.time) return a.time - b.time;
        return a.type === "end" ? -1 : 1;
      });

      // Calculate maximum concurrent appointments
      let currentCount = 0;
      let maxConcurrent = 0;

      events.forEach((event) => {
        if (event.type === "start") {
          currentCount++;
          maxConcurrent = Math.max(maxConcurrent, currentCount);
        } else {
          currentCount--;
        }
      });

      // Return max concurrent minus 1 (to exclude the new booking itself)
      return maxConcurrent - 1;
    } catch (error) {
      console.error("Error checking overlapping:", error);
      return 0;
    }
  };

  const getServiceCategoryName = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return "";
    return service.categoryName || service.category || "";
  };

  const isSkinService = (serviceId) => {
    const categoryName = getServiceCategoryName(serviceId);
    return (
      categoryName.toLowerCase().includes("skin") ||
      categoryName.toLowerCase().includes("بشرة") ||
      categoryName.toLowerCase().includes("جلد")
    );
  };

  const isLaserService = (serviceId) => {
    const categoryName = getServiceCategoryName(serviceId);
    return (
      categoryName.toLowerCase().includes("laser") ||
      categoryName.toLowerCase().includes("ليزر")
    );
  };

  // Check staff availability function
  const checkStaffAvailability = async (staffId) => {
    if (!staffId || !formData.date || !formData.time) {
      setStaffAvailability({
        isChecking: false,
        available: true,
        conflicts: [],
      });
      return;
    }

    setStaffAvailability({ isChecking: true, available: true, conflicts: [] });

    try {
      const selectedService = services.find((s) => s.id === formData.serviceId);
      const duration = selectedService?.duration || 60;

      const availabilityCheck = await checkStaffAvailabilityWithDuration(
        staffId,
        formData.date,
        formData.time,
        duration,
        null // No appointment to exclude (new appointment)
      );

      setStaffAvailability({
        isChecking: false,
        available: availabilityCheck.available,
        conflicts: availabilityCheck.conflicts || [],
      });
    } catch (error) {
      console.error("Error checking staff availability:", error);
      setStaffAvailability({
        isChecking: false,
        available: true,
        conflicts: [],
      });
    }
  };

  // Re-check availability when staff, date, time, or service changes
  useEffect(() => {
    if (
      formData.staffId &&
      formData.date &&
      formData.time &&
      formData.serviceId
    ) {
      checkStaffAvailability(formData.staffId);
    } else {
      setStaffAvailability({
        isChecking: false,
        available: true,
        conflicts: [],
      });
    }
  }, [formData.staffId, formData.date, formData.time, formData.serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.serviceId || !formData.date || !formData.time) {
        setError("يرجى ملء جميع الحقول المطلوبة");
        setLoading(false);
        return;
      }

      // Get selected service
      const selectedService = services.find((s) => s.id === formData.serviceId);
      if (!selectedService) {
        setError("الخدمة المحددة غير موجودة");
        setLoading(false);
        return;
      }

      // Calculate duration and end time
      let appointmentDuration = selectedService.duration || 60;
      let appointmentEndTime = null;

      if (isFlexibleTimeService(formData.serviceId)) {
        // Use service duration for flexible time services
        appointmentDuration = parseInt(selectedService.duration, 10) || 60;
        appointmentEndTime = calculateLaserEndTime(
          formData.time,
          appointmentDuration
        );

        // Validate flexible time
        const validation = validateFlexibleTime(
          formData.time,
          appointmentDuration,
          formData.serviceId
        );
        if (!validation.valid) {
          setError(validation.message);
          setLoading(false);
          return;
        }

        // If there's a warning, ask for confirmation
        if (validation.warning) {
          setLoading(false);
          showConfirm(
            validation.message,
            async () => {
              // User confirmed, continue with appointment creation
              setLoading(true);
              try {
                await processAppointmentCreation(
                  selectedService,
                  appointmentDuration,
                  appointmentEndTime,
                  validation
                );
              } catch (err) {
                console.error("Error creating appointment:", err);
                setError("فشل في إنشاء الموعد");
                setLoading(false);
              }
            },
            "تحذير",
            "متابعة",
            "إلغاء"
          );
          return;
        }

        // No warning, continue normally
        await processAppointmentCreation(
          selectedService,
          appointmentDuration,
          appointmentEndTime,
          validation
        );
      } else {
        // For non-flexible services
        if (
          isFixedTimeService(formData.serviceId) &&
          formData.useCustomTime &&
          formData.customEndTime
        ) {
          appointmentDuration =
            timeToMinutes(formData.customEndTime) -
            timeToMinutes(formData.time);
          appointmentEndTime = formData.customEndTime;
        }

        await processAppointmentCreation(
          selectedService,
          appointmentDuration,
          appointmentEndTime,
          null
        );
      }
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError("فشل في إنشاء الموعد");
      setLoading(false);
    }
  };

  const processAppointmentCreation = async (
    selectedService,
    appointmentDuration,
    appointmentEndTime,
    validation
  ) => {
    try {
      // For flexible services, check overlapping
      if (isFlexibleTimeService(formData.serviceId)) {
        // Get booking limit from category
        const selectedService = services.find(
          (s) => s.id === formData.serviceId
        );
        const serviceCategory = categories.find(
          (cat) =>
            cat.id === selectedService?.categoryId ||
            cat.id === selectedService?.category
        );
        const bookingLimit = serviceCategory?.bookingLimit || 999;

        const endTime = validation?.endTime || appointmentEndTime;
        const overlapping = await checkLaserOverlapping(
          formData.date,
          formData.time,
          endTime
        );

        if (overlapping >= bookingLimit) {
          console.log("🔔 Overlap limit reached, showing confirmation...");
          // Show warning but allow admin to proceed
          const confirmed = await showConfirm(
            `تحذير: تم الوصول للحد الأقصى من الحجوزات المتداخلة (${overlapping}/${bookingLimit}). هل تريد المتابعة؟`,
            "تأكيد الحجز",
            "نعم، متابعة",
            "إلغاء"
          );

          console.log("🎯 Confirmation result:", confirmed);

          if (!confirmed) {
            console.log("❌ User cancelled, resetting loading...");
            setLoading(false);
            return;
          }

          console.log("✅ User confirmed, continuing...");
        }
      }

      // Get staff name if staff is assigned
      // Note: Admin can proceed even if staff has conflicts (warning is shown in UI)
      let staffName = null;
      if (formData.staffId) {
        const staff = staffMembers.find((s) => s.id === formData.staffId);
        staffName = staff?.name || null;
      }

      // Create appointment data
      const appointmentData = {
        customerId: null, // Admin-created, not assigned to user
        customerName: formData.customerName || "غير محدد",
        customerPhone: formData.customerPhone || "غير محدد",
        customerEmail: formData.customerEmail || "غير محدد",
        serviceId: formData.serviceId,
        serviceName: selectedService.name,
        serviceCategory: selectedService.category,
        serviceCategoryName:
          selectedService.categoryName || selectedService.category,
        servicePrice: selectedService.price,
        serviceDuration: appointmentDuration,
        endTime: appointmentEndTime,
        staffId: formData.staffId || null,
        staffName: staffName,
        date: formData.date,
        time: formData.time,
        notes: formData.notes || "",
        status: "مؤكد", // Admin-created appointments are confirmed by default
        createdByAdmin: true, // Flag to indicate admin creation
        createdBy: currentUser?.uid || null, // Store admin ID who created this
      };

      await createAppointment(appointmentData);

      // Reset form
      setFormData({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        serviceId: "",
        date: "",
        time: "",
        notes: "",
        staffId: "",
        laserStartHour: "",
        laserStartMinute: "",
        useCustomTime: false,
        customStartTime: "",
        customEndTime: "",
      });

      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error in processAppointmentCreation:", err);
      setError("فشل في إنشاء الموعد");
      setLoading(false);
      throw err;
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  return (
    <div className="admin-create-appointment-modal-overlay">
      <div className="admin-create-appointment-modal">
        <div className="modal-header">
          <h2>إنشاء موعد جديد (Admin)</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="error-message">{error}</div>}

          {/* Customer Info (Optional) */}
          <div className="form-section">
            <h3>معلومات العميل (اختياري)</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>اسم العميل</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="اختياري"
                />
              </div>
              <div className="form-group">
                <label>رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  placeholder="اختياري"
                />
              </div>
              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                  placeholder="اختياري"
                />
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div className="form-section">
            <h3>تفاصيل الموعد</h3>
            <div className="form-group">
              <label>الخدمة *</label>
              <select
                value={formData.serviceId}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    serviceId: e.target.value,
                    time: "",
                    laserStartHour: "",
                    laserStartMinute: "",
                    useCustomTime: false,
                    customStartTime: "",
                    customEndTime: "",
                  });
                }}
                required
              >
                <option value="">اختر الخدمة</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.categoryName || service.category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>التاريخ *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                min={getMinDate()}
                required
              />
            </div>

            {/* Time Selection based on service type */}
            {formData.serviceId && formData.date && (
              <>
                {isFlexibleTimeService(formData.serviceId) ? (
                  /* Flexible Time Selection (Laser-like) */
                  <>
                    <div className="form-group">
                      <label>المدة</label>
                      <input
                        type="text"
                        value={`${
                          services.find((s) => s.id === formData.serviceId)
                            ?.duration || 60
                        } دقيقة`}
                        disabled
                        className="form-input"
                        style={{
                          backgroundColor: "#f5f5f5",
                          cursor: "not-allowed",
                        }}
                      />
                      <small style={{ color: "#666", fontSize: "0.85rem" }}>
                        المدة محددة من الخدمة المختارة
                      </small>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>الساعة *</label>
                        <select
                          value={formData.laserStartHour}
                          onChange={(e) => {
                            const hour = e.target.value;
                            const newFormData = {
                              ...formData,
                              laserStartHour: hour,
                            };
                            // Update time if both hour and minute are selected
                            if (hour && formData.laserStartMinute) {
                              newFormData.time = `${hour}:${formData.laserStartMinute}`;
                            }
                            setFormData(newFormData);
                          }}
                          required
                        >
                          <option value="">اختر الساعة</option>
                          {LASER_HOURS.map((hour) => (
                            <option
                              key={hour}
                              value={String(hour).padStart(2, "0")}
                            >
                              {String(hour).padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>الدقائق *</label>
                        <select
                          value={formData.laserStartMinute}
                          onChange={(e) => {
                            const minute = e.target.value;
                            const newFormData = {
                              ...formData,
                              laserStartMinute: minute,
                            };
                            // Update time if both hour and minute are selected
                            if (formData.laserStartHour && minute) {
                              newFormData.time = `${formData.laserStartHour}:${minute}`;
                            }
                            setFormData(newFormData);
                          }}
                          required
                        >
                          <option value="">اختر الدقائق</option>
                          {LASER_MINUTES.map((minute) => (
                            <option key={minute} value={minute}>
                              {minute}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {formData.time && (
                      <div className="time-preview">
                        <strong>وقت البدء:</strong> {formData.time}
                        <br />
                        <strong>وقت الانتهاء المتوقع:</strong>{" "}
                        {(() => {
                          // Build time string directly from hour/minute to ensure it's properly formatted
                          const startTime =
                            formData.laserStartHour && formData.laserStartMinute
                              ? `${formData.laserStartHour}:${formData.laserStartMinute}`
                              : formData.time;
                          const duration =
                            parseInt(
                              services.find((s) => s.id === formData.serviceId)
                                ?.duration
                            ) || 60;
                          return calculateLaserEndTime(startTime, duration);
                        })()}
                      </div>
                    )}
                  </>
                ) : isFixedTimeService(formData.serviceId) ? (
                  /* Fixed Time Selection (Skin-like services) */
                  <>
                    <div className="form-group">
                      <label>الوقت *</label>
                      <select
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            time: e.target.value,
                            useCustomTime: false,
                          })
                        }
                        disabled={formData.useCustomTime}
                        required={!formData.useCustomTime}
                      >
                        <option value="">اختر الوقت</option>
                        {getCategoryFixedTimeSlots(formData.serviceId).map(
                          (time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="custom-time-section">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.useCustomTime}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              useCustomTime: e.target.checked,
                              time: "",
                              customStartTime: "",
                              customEndTime: "",
                            });
                          }}
                        />
                        استخدام وقت مخصص
                      </label>

                      {formData.useCustomTime && (
                        <>
                          <div className="info-box">
                            <strong>مدة الخدمة:</strong>{" "}
                            {services.find((s) => s.id === formData.serviceId)
                              ?.duration || 60}{" "}
                            دقيقة
                          </div>
                          <div className="form-group">
                            <label>وقت البدء *</label>
                            <input
                              type="time"
                              value={formData.customStartTime}
                              onChange={(e) => {
                                const startTime = e.target.value;
                                const duration =
                                  parseInt(
                                    services.find(
                                      (s) => s.id === formData.serviceId
                                    )?.duration
                                  ) || 60;
                                const endTime = calculateLaserEndTime(
                                  startTime,
                                  duration
                                );
                                setFormData({
                                  ...formData,
                                  customStartTime: startTime,
                                  time: startTime,
                                  customEndTime: endTime,
                                });
                              }}
                              required
                            />
                          </div>
                          {formData.customStartTime && (
                            <div className="time-preview">
                              <strong>وقت البدء:</strong>{" "}
                              {formData.customStartTime}
                              <br />
                              <strong>وقت الانتهاء المتوقع:</strong>{" "}
                              {formData.customEndTime}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  /* Default Time Selection */
                  <div className="form-group">
                    <label>الوقت *</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      required
                    />
                  </div>
                )}
              </>
            )}

            {/* Staff Assignment */}
            <div className="form-group">
              <label>تعيين أخصائية (اختياري)</label>
              <select
                value={formData.staffId}
                onChange={(e) =>
                  setFormData({ ...formData, staffId: e.target.value })
                }
              >
                <option value="">لم يتم التعيين بعد</option>
                {staffMembers.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>

              {/* Staff Availability Warning */}
              {staffAvailability.isChecking && (
                <div className="staff-availability-checking">
                  <i className="fas fa-spinner fa-spin"></i> جاري التحقق من توفر
                  الأخصائية...
                </div>
              )}

              {!staffAvailability.isChecking &&
                !staffAvailability.available &&
                staffAvailability.conflicts.length > 0 && (
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
                            {conflict.customerName} ({conflict.serviceName}) في{" "}
                            {conflict.time}
                          </li>
                        ))}
                      </ul>
                      <p className="warning-note">
                        <i className="fas fa-info-circle"></i> يمكنك المتابعة
                        بإنشاء الموعد إذا كنت متأكداً من التعيين
                      </p>
                    </div>
                  </div>
                )}
            </div>

            <div className="form-group">
              <label>ملاحظات</label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows="3"
                placeholder="أي ملاحظات إضافية..."
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cr-btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              إلغاء
            </button>
            <button type="submit" className="cr-btn-primary" disabled={loading}>
              {loading ? "جاري الإنشاء..." : "إنشاء الموعد"}
            </button>
          </div>
        </form>
      </div>

      {/* Custom Modal for confirmation dialogs */}
      <CustomModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancel={modalState.showCancel}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
      />
    </div>
  );
};

export default AdminCreateAppointmentModal;
