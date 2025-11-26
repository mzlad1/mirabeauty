import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookingPage.css";
import {
  getAllServices,
  getServicesByCategory,
} from "../services/servicesService";
import { getUsersByRole } from "../services/usersService";
import {
  createAppointment,
  checkStaffAvailability,
  getAppointmentsByCustomer,
  getAppointmentsByDate,
} from "../services/appointmentsService";
import {
  createConsultation,
  getConsultationsByCustomer,
} from "../services/consultationsService";
import { getAllServiceCategories } from "../services/categoriesService";
import CustomModal from "../components/common/CustomModal";
import { useModal } from "../hooks/useModal";

// Available time slots
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
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

const BookingPage = ({ currentUser, userData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    modalState,
    closeModal,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  } = useModal();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(""); // إضافة حالة لنوع الجلسة
  const [bookingData, setBookingData] = useState({
    serviceId: "",
    date: "",
    time: "",
    notes: "",
    customerInfo: {
      name: userData?.name || currentUser?.displayName || "",
      phone: userData?.phone || "",
      email: userData?.email || currentUser?.email || "",
    },
  });

  // Consultation data state
  const [consultationData, setConsultationData] = useState({
    customerInfo: {
      name: userData?.name || currentUser?.displayName || "",
      phone: userData?.phone || "",
      email: userData?.email || currentUser?.email || "",
    },
    ageRange: "",
    skinConcerns: [],
    date: "",
    timeSlot: "",
    notes: "",
  });

  // Firebase data states
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categoryServices, setCategoryServices] = useState({});
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [userAppointments, setUserAppointments] = useState([]);
  const [userConsultations, setUserConsultations] = useState([]);

  // Update consultation data when userData changes
  useEffect(() => {
    if (userData || currentUser) {
      setConsultationData((prev) => ({
        ...prev,
        customerInfo: {
          name: userData?.name || currentUser?.displayName || "",
          phone: userData?.phone || "",
          email: userData?.email || currentUser?.email || "",
        },
      }));
      setBookingData((prev) => ({
        ...prev,
        customerInfo: {
          name: userData?.name || currentUser?.displayName || "",
          phone: userData?.phone || "",
          email: userData?.email || currentUser?.email || "",
        },
      }));
    }
  }, [userData, currentUser]);

  // Load services and staff on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [servicesData, staffData, categoriesData] = await Promise.all([
          getAllServices(),
          getUsersByRole("staff"),
          getAllServiceCategories(),
        ]);

        // Debug: Log services data
        console.log("BookingPage - All services loaded:", servicesData);
        console.log("BookingPage - Categories loaded:", categoriesData);
        console.log(
          "BookingPage - Service categories:",
          servicesData.map((s) => ({
            name: s.name,
            category: s.category,
            categoryId: s.categoryId,
            categoryName: s.categoryName,
          }))
        );

        setServices(servicesData);
        setStaffMembers(staffData);
        setCategories(categoriesData);

        // Group services by category for quick lookup
        const servicesByCategory = {};
        servicesData.forEach((service) => {
          const catId = service.categoryId || service.category;
          if (!servicesByCategory[catId]) {
            servicesByCategory[catId] = [];
          }
          servicesByCategory[catId].push(service);
        });
        setCategoryServices(servicesByCategory);

        // Load user appointments and consultations if user is logged in
        if (currentUser) {
          const [userAppts, userConsults] = await Promise.all([
            getAppointmentsByCustomer(currentUser.uid),
            getConsultationsByCustomer(currentUser.uid),
          ]);
          setUserAppointments(userAppts);
          setUserConsultations(userConsults);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("حدث خطأ في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser]);

  // Handle pre-selected service from ServicesPage
  useEffect(() => {
    if (
      location.state?.fromServicesPage &&
      location.state?.selectedService &&
      services.length > 0
    ) {
      const service = location.state.selectedService;

      // Set the category based on the service's categoryName
      setSelectedCategory(service.categoryName || service.category);

      // Set the selected service in booking data
      setBookingData((prev) => ({
        ...prev,
        serviceId: service.id,
      }));

      // Move directly to step 2 (date & time selection)
      setStep(2);

      // Clear the navigation state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state, services]);

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

  const handleServiceSelect = (serviceId) => {
    setBookingData({ ...bookingData, serviceId });
    setStep(2);
  };

  const handleDateTimeSelect = (date, time) => {
    setBookingData({ ...bookingData, date, time });
    setStep(3);
  };

  // Load available time slots for selected date
  const loadAvailableTimeSlots = async (selectedDate) => {
    if (!selectedDate) {
      setAvailableTimeSlots([]);
      return;
    }

    try {
      // Get the selected service and its category
      const selectedService = services.find(
        (s) => s.id === bookingData.serviceId
      );
      if (!selectedService) {
        setAvailableTimeSlots(timeSlots);
        return;
      }

      // Get the category booking limit
      const serviceCategory = categories.find(
        (cat) =>
          cat.id === selectedService.categoryId ||
          cat.id === selectedService.category
      );
      const bookingLimit = serviceCategory?.bookingLimit || 999; // Default high number if not set

      // Get all appointments for the selected date
      const dateAppointments = await getAppointmentsByDate(selectedDate);

      // Group appointments by time slot and count per category
      const timeSlotsBookingCount = {};

      dateAppointments.forEach((apt) => {
        // Only count confirmed and pending appointments
        if (apt.status === "مؤكد" || apt.status === "في الانتظار") {
          // Check if appointment is for same category
          if (
            apt.serviceCategory === selectedService.category ||
            apt.serviceCategory === selectedService.categoryId
          ) {
            if (!timeSlotsBookingCount[apt.time]) {
              timeSlotsBookingCount[apt.time] = 0;
            }
            timeSlotsBookingCount[apt.time]++;
          }
        }
      });

      // Get booked time slots
      // 1. User's own pending appointments block for them only
      const userBookedTimes = dateAppointments
        .filter((apt) => {
          // Block user's own pending appointments
          if (
            apt.status === "في الانتظار" &&
            apt.customerId === currentUser?.uid
          )
            return true;
          return false;
        })
        .map((apt) => apt.time);

      // Filter available time slots based on booking limit
      const available = timeSlots.filter((time) => {
        // Block user's own bookings
        if (userBookedTimes.includes(time)) return false;

        // Check if this time slot has reached the booking limit
        const bookingsAtThisTime = timeSlotsBookingCount[time] || 0;
        return bookingsAtThisTime < bookingLimit;
      });

      setAvailableTimeSlots(available);
    } catch (error) {
      console.error("Error loading available time slots:", error);
      setAvailableTimeSlots(timeSlots); // Fallback to all slots
    }
  };

  // Check for duplicate bookings
  const checkDuplicateBooking = (serviceId, date, time) => {
    const selectedService = services.find((s) => s.id === serviceId);

    // Check if user has same service on same day
    const sameServiceSameDay = userAppointments.some(
      (apt) =>
        apt.serviceId === serviceId &&
        apt.date === date &&
        (apt.status === "في الانتظار" || apt.status === "مؤكد")
    );

    // Check if user has any appointment at same date and time
    const sameDateTime = userAppointments.some(
      (apt) =>
        apt.date === date &&
        apt.time === time &&
        (apt.status === "في الانتظار" || apt.status === "مؤكد")
    );

    return { sameServiceSameDay, sameDateTime };
  };

  // Get minimum date for booking (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      showWarning("يرجى تسجيل الدخول أولاً");
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      // Handle consultation booking
      if (selectedCategory === "consultation") {
        console.log("Submitting consultation with data:", consultationData);

        // Check if user already has a consultation on the same day
        const hasConsultationSameDay = userConsultations.some(
          (consult) =>
            consult.date === consultationData.date &&
            (consult.status === "في الانتظار" || consult.status === "مؤكد")
        );

        if (hasConsultationSameDay) {
          showError(
            "لديك استشارة مسبقة في نفس اليوم. لا يمكن حجز أكثر من استشارة واحدة في اليوم الواحد."
          );
          setSubmitting(false);
          return;
        }

        // Validate required fields
        if (
          !consultationData.customerInfo.name ||
          !consultationData.customerInfo.phone ||
          !consultationData.customerInfo.email ||
          !consultationData.ageRange ||
          !consultationData.date ||
          !consultationData.timeSlot
        ) {
          showError("الرجاء ملء جميع الحقول المطلوبة");
          setSubmitting(false);
          return;
        }

        const consultationSubmitData = {
          customerId: currentUser.uid,
          customerName: consultationData.customerInfo.name,
          customerPhone: consultationData.customerInfo.phone,
          customerEmail: consultationData.customerInfo.email,
          ageRange: consultationData.ageRange,
          skinConcerns: consultationData.skinConcerns,
          date: consultationData.date,
          timeSlot: consultationData.timeSlot,
          notes: consultationData.notes,
          staffId: null, // Will be assigned by admin
          staffName: null, // Will be assigned by admin
          status: "في الانتظار",
        };

        console.log("Creating consultation with:", consultationSubmitData);
        const result = await createConsultation(consultationSubmitData);
        console.log("Consultation created successfully:", result);
        showSuccess(
          "تم حجز استشارتك بنجاح! سيتم التواصل معك خلال 24 ساعة لتأكيد الموعد."
        );
        // Wait for user to see the success message before redirecting
        setTimeout(() => {
          navigate("/profile");
        }, 2500);
        return;
      }

      // Handle regular appointment booking
      // Check for duplicate bookings
      const { sameServiceSameDay, sameDateTime } = checkDuplicateBooking(
        bookingData.serviceId,
        bookingData.date,
        bookingData.time
      );

      if (sameServiceSameDay) {
        showError(
          "لديك حجز مسبق لنفس الخدمة في هذا اليوم. لا يمكن حجز نفس الخدمة أكثر من مرة في اليوم الواحد."
        );
        setSubmitting(false);
        return;
      }

      if (sameDateTime) {
        showError("لديك حجز مسبق في نفس التاريخ والوقت. يرجى اختيار وقت آخر.");
        setSubmitting(false);
        return;
      }

      // Create appointment without staff assignment (admin will assign later)
      const appointmentData = {
        customerId: currentUser.uid,
        customerName: bookingData.customerInfo.name,
        customerPhone: bookingData.customerInfo.phone,
        customerEmail: bookingData.customerInfo.email,
        serviceId: bookingData.serviceId,
        serviceName: selectedService?.name,
        serviceCategory: selectedService?.category,
        servicePrice: selectedService?.price,
        serviceDuration: selectedService?.duration || 60, // Default 60 minutes
        staffId: null, // Will be assigned by admin
        staffName: null, // Will be assigned by admin
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes,
        status: "pending",
      };

      await createAppointment(appointmentData);
      showSuccess(
        <>
          <p style={{ marginBottom: "1rem" }}>
            تم حجز موعدك بنجاح! سيتم تعيين الأخصائية المناسبة والتواصل معك
            قريباً لتأكيد الموعد.
          </p>
          <div
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "8px",
              padding: "0.75rem",
              marginTop: "1rem",
            }}
          >
            <p
              style={{
                color: "#856404",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: "#dc3545" }}>⚠️</span> تنبيه هام:
            </p>
            <ul
              style={{
                margin: 0,
                paddingRight: "1.5rem",
                color: "#856404",
                lineHeight: "1.8",
              }}
            >
              <li>
                في حال تأخرتي عن الموعد المحدد لأكثر من 10 دقائق، سيتم إلغاء
                الحجز.
              </li>
              <li>
                يمكنك إلغاء الموعد قبل 12 ساعة على الأقل من وقت الموعد المحدد.
              </li>
            </ul>
          </div>
        </>
      );
      // Wait for user to see the success message before redirecting
      setTimeout(() => {
        navigate("/profile");
      }, 6500);
    } catch (error) {
      console.error("Error creating booking:", error);
      console.error("Error details:", error.message, error.code);
      showError(
        `حدث خطأ أثناء الحجز: ${error.message || "يرجى المحاولة مرة أخرى"}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = services.find((s) => s.id === bookingData.serviceId);

  if (!currentUser) {
    return (
      <div className="booking-page">
        <section className="login-required section">
          <div className="container">
            <div className="login-card">
              <h2>تسجيل الدخول مطلوب</h2>
              <p>يرجى تسجيل الدخول أو إنشاء حساب جديد لحجز موعد</p>
              <div className="login-actions">
                <button
                  className="btn-primary"
                  onClick={() => navigate("/login")}
                >
                  تسجيل الدخول
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => navigate("/register")}
                >
                  إنشاء حساب جديد
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="booking-page">
        <section className="loading-section section">
          <div className="container">
            <div className="loading-card">
              <div className="loading-spinner"></div>
              <p>جاري تحميل البيانات...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-page">
        <section className="error-section section">
          <div className="container">
            <div className="error-card">
              <h2>حدث خطأ</h2>
              <p>{error}</p>
              <button
                className="btn-primary"
                onClick={() => window.location.reload()}
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* Breadcrumb Navigation */}
      <section className="booking-breadcrumb-section">
        <div className="container">
          <nav className="booking-breadcrumb">
            <button
              className="booking-breadcrumb-item"
              onClick={() => navigate("/")}
            >
              الرئيسية
            </button>
            <span className="booking-breadcrumb-separator">/</span>
            <span className="booking-breadcrumb-item active">حجز موعد</span>
          </nav>
        </div>
      </section>

      {/* Service Category Selection */}
      {!selectedCategory && (
        <section className="category-selection section">
          <div className="container">
            <h2>اختاري نوع الجلسة</h2>
            {loading ? (
              <div className="loading">جاري تحميل التصنيفات...</div>
            ) : (
              <div className="category-cards">
                {categories.map((category) => {
                  const services = categoryServices[category.id] || [];

                  // فلترة الخدمات المخفية
                  const visibleServices = services.filter((s) => !s.hidden);

                  // لو ما في خدمات مرئية → ما نعرض التصنيف
                  if (visibleServices.length === 0) return null;

                  const displayServices = visibleServices.slice(0, 4);
                  const hasMore = visibleServices.length > 4;

                  return (
                    <div
                      key={category.id}
                      className="category-card"
                      onClick={() => setSelectedCategory(category.id)}
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <div className="category-card-inner">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="category-image"
                          />
                        ) : (
                          <div className="category-placeholder">
                            <i className="fas fa-spa"></i>
                          </div>
                        )}

                        <div className="category-overlay">
                          <h3>{category.name}</h3>
                          {category.description && (
                            <p className="category-desc">
                              {category.description}
                            </p>
                          )}
                        </div>

                        {/* Services Preview on Hover */}
                        {hoveredCategory === category.id && (
                          <div className="services-preview">
                            <h4>الخدمات المتاحة:</h4>
                            <ul>
                              {displayServices.map((service) => (
                                <li key={service.id}>
                                  <i className="fas fa-check-circle"></i>
                                  {service.name}
                                </li>
                              ))}

                              {hasMore && (
                                <li className="more-services">
                                  <i className="fas fa-plus-circle"></i>و{" "}
                                  {visibleServices.length - 4} خدمات أخرى
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Booking Steps */}
      {selectedCategory && selectedCategory !== "consultation" && (
        <section className="booking-content section">
          <div className="container">
            {/* Progress Indicator */}
            <div className="booking-progress">
              <div
                className={`progress-step ${step >= 1 ? "active" : ""} ${
                  step > 1 ? "completed" : ""
                }`}
              >
                <div className="step-number">1</div>
                <div className="step-title">اختيار الخدمة</div>
              </div>
              <div
                className={`progress-step ${step >= 2 ? "active" : ""} ${
                  step > 2 ? "completed" : ""
                }`}
              >
                <div className="step-number">2</div>
                <div className="step-title">اختيار التاريخ والوقت</div>
              </div>
              <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
                <div className="step-number">3</div>
                <div className="step-title">تأكيد الحجز</div>
              </div>
            </div>

            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div className="booking-step">
                <div className="step-header">
                  <button
                    className="back-btn"
                    onClick={() => setSelectedCategory("")}
                  >
                    ← العودة لاختيار نوع الجلسة
                  </button>
                  <h2>
                    اختاري الخدمة -{" "}
                    {categories.find((c) => c.id === selectedCategory)?.name ||
                      selectedCategory}
                  </h2>
                </div>

                {/* Pricing Info Banner for selected category */}
                {(() => {
                  const selectedCat = categories.find(
                    (c) => c.id === selectedCategory
                  );
                  if (selectedCat && selectedCat.price) {
                    return (
                      <div className="pricing-info-banner">
                        <div className="pricing-banner-content">
                          <i className="fas fa-tag"></i>
                          <div className="pricing-text">
                            <p>
                              سعر فئة <strong>{selectedCat.name}</strong> يبدأ
                              من{" "}
                              <strong className="price-highlight">
                                {selectedCat.price} شيكل
                              </strong>
                            </p>
                            <p className="discount-note">
                              ستحصلين على أي خصم او عرض خاص بكِ عند الدفع!
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="services-selection">
                  {(() => {
                    console.log("BookingPage - Filtering services...");
                    console.log(
                      "BookingPage - Selected category:",
                      selectedCategory
                    );
                    console.log(
                      "BookingPage - Total services:",
                      services.length
                    );

                    const filtered = services.filter((service) => {
                      // Skip hidden services
                      if (service.hidden) {
                        return false;
                      }

                      // Check if category matches using ID
                      const matches =
                        service.categoryId === selectedCategory ||
                        service.category === selectedCategory ||
                        service.categoryName === selectedCategory ||
                        (service.categoryName &&
                          service.categoryName
                            .toLowerCase()
                            .includes(selectedCategory.toLowerCase()));

                      if (matches) {
                        console.log(
                          "BookingPage - Service matched:",
                          service.name,
                          {
                            category: service.category,
                            categoryName: service.categoryName,
                            categoryId: service.categoryId,
                          }
                        );
                      }

                      return matches;
                    });

                    console.log(
                      "BookingPage - Filtered services count:",
                      filtered.length
                    );

                    return filtered.map((service) => (
                      <div
                        key={service.id}
                        className="service-option"
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        <div className="service-image">
                          <img
                            src={
                              service.images && service.images.length > 0
                                ? service.images[service.primaryImageIndex || 0]
                                    ?.url ||
                                  service.images[service.primaryImageIndex || 0]
                                : service.image || "/assets/default-service.jpg"
                            }
                            alt={service.name}
                          />
                        </div>
                        <div className="service-details">
                          <h3>{service.name}</h3>
                          <p>{service.description}</p>
                          <div className="service-meta">
                            <span className="duration">
                              المدة: {service.duration}
                            </span>
                            {/* <span className="price">
                              السعر: {service.price}
                            </span> */}
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* Step 2: Date & Time Selection */}
            {step === 2 && (
              <div className="booking-step">
                <div className="step-header">
                  <button className="back-btn" onClick={() => setStep(1)}>
                    ← العودة
                  </button>
                  <h2>اختاري التاريخ والوقت</h2>
                </div>
                <div className="selected-info">
                  <div className="info-item">
                    <strong>الخدمة:</strong> {selectedService?.name}
                  </div>
                  <div className="info-item">
                    <strong>المدة:</strong> {selectedService?.duration || 60}
                  </div>
                </div>
                <div className="datetime-selection">
                  <div className="date-selection">
                    <h3>اختاري التاريخ</h3>
                    <input
                      type="date"
                      value={bookingData.date}
                      min={getMinDate()}
                      onChange={async (e) => {
                        const selectedDate = e.target.value;
                        setBookingData({
                          ...bookingData,
                          date: selectedDate,
                          time: "",
                        });
                        await loadAvailableTimeSlots(selectedDate);
                      }}
                      className="form-input"
                    />
                  </div>
                  {bookingData.date && (
                    <div className="time-selection">
                      <h3>اختاري الوقت المتاح</h3>
                      {availableTimeSlots.length === 0 ? (
                        <p className="no-slots-message">
                          لا توجد أوقات متاحة في هذا التاريخ. يرجى اختيار تاريخ
                          آخر.
                        </p>
                      ) : (
                        <>
                          {/* Check if there are any disabled slots and show warning message */}
                          {(() => {
                            const disabledSlots = availableTimeSlots.filter(
                              (time) => {
                                const { sameServiceSameDay, sameDateTime } =
                                  checkDuplicateBooking(
                                    bookingData.serviceId,
                                    bookingData.date,
                                    time
                                  );
                                return sameServiceSameDay || sameDateTime;
                              }
                            );

                            const hasSameServiceSameDay = disabledSlots.some(
                              (time) => {
                                const { sameServiceSameDay } =
                                  checkDuplicateBooking(
                                    bookingData.serviceId,
                                    bookingData.date,
                                    time
                                  );
                                return sameServiceSameDay;
                              }
                            );

                            const hasSameDateTime = disabledSlots.some(
                              (time) => {
                                const { sameDateTime } = checkDuplicateBooking(
                                  bookingData.serviceId,
                                  bookingData.date,
                                  time
                                );
                                return sameDateTime;
                              }
                            );

                            if (disabledSlots.length > 0) {
                              return (
                                <div className="booking-warning-message">
                                  <i className="fas fa-exclamation-triangle warning-icon"></i>
                                  {hasSameServiceSameDay && (
                                    <p>
                                      لديك حجز مسبق لنفس الخدمة في هذا اليوم.
                                      الأوقات المعطلة غير متاحة للحجز.
                                    </p>
                                  )}
                                  {hasSameDateTime &&
                                    !hasSameServiceSameDay && (
                                      <p>
                                        لديك حجز مسبق في بعض الأوقات. الأوقات
                                        المعطلة غير متاحة للحجز.
                                      </p>
                                    )}
                                </div>
                              );
                            }
                            return null;
                          })()}

                          <div className="time-slots">
                            {availableTimeSlots.map((time) => {
                              // Check if this time would create a duplicate booking
                              const { sameServiceSameDay, sameDateTime } =
                                checkDuplicateBooking(
                                  bookingData.serviceId,
                                  bookingData.date,
                                  time
                                );
                              const isDisabled =
                                sameServiceSameDay || sameDateTime;

                              return (
                                <button
                                  key={time}
                                  className={`time-slot ${
                                    bookingData.time === time ? "selected" : ""
                                  } ${isDisabled ? "disabled" : ""}`}
                                  onClick={() => {
                                    if (!isDisabled) {
                                      handleDateTimeSelect(
                                        bookingData.date,
                                        time
                                      );
                                    }
                                  }}
                                  disabled={isDisabled}
                                  title={
                                    isDisabled
                                      ? sameServiceSameDay
                                        ? "لديك حجز مسبق لنفس الخدمة في هذا اليوم"
                                        : "لديك حجز مسبق في نفس الوقت"
                                      : ""
                                  }
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="booking-step">
                <div className="step-header">
                  <button className="back-btn" onClick={() => setStep(2)}>
                    ← العودة
                  </button>
                  <h2>تأكيد الحجز</h2>
                </div>
                <div className="booking-summary">
                  <h3>ملخص الحجز</h3>
                  <div className="summary-details">
                    <div className="summary-item">
                      <span className="label">الخدمة:</span>
                      <span className="value">{selectedService?.name}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">التاريخ:</span>
                      <span className="value">{bookingData.date}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">الوقت:</span>
                      <span className="value">{bookingData.time}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">المدة:</span>
                      <span className="value">
                        {selectedService?.duration || 60}
                      </span>
                    </div>
                    {/* <div className="summary-item price-item">
                      <span className="label">السعر:</span>
                      <span className="value">{selectedService?.price}</span>
                    </div> */}
                    <div className="summary-note">
                      {(() => {
                        // Check if user has appointments in the last 6 months
                        const sixMonthsAgo = new Date();
                        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

                        const hasRecentAppointments = userAppointments.some(
                          (apt) => {
                            const aptDate = new Date(apt.date);
                            return aptDate >= sixMonthsAgo;
                          }
                        );

                        return (
                          hasRecentAppointments && (
                            <p className="summary-note-info">
                              <i className="fas fa-info-circle"></i>
                              <strong>ملاحظة:</strong> اذا كنت تفضلين أخصائية
                              معينة، يرجى ذكر ذلك في قسم الملاحظات أدناه.
                            </p>
                          )
                        );
                      })()}
                      <p className="summary-note-warning">
                        <i className="fas fa-exclamation-triangle"></i>
                        <strong>تنبيه:</strong> في حال تأخرتي عن الموعد المحدد
                        لأكثر من 10 دقيقة، سيتم إلغاء الحجز.
                      </p>
                      <p className="summary-note-warning">
                        <i className="fas fa-exclamation-triangle"></i>
                        <strong>تنبيه:</strong> يمكنك إلغاء الموعد قبل 12 ساعة
                        على الأقل من وقت الموعد المحدد.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                  <div className="form-group">
                    <label className="form-label">
                      ملاحظات إضافية (اختياري)
                    </label>
                    <textarea
                      className="form-textarea"
                      value={bookingData.notes}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          notes: e.target.value,
                        })
                      }
                      placeholder="أي ملاحظات أو طلبات خاصة..."
                      rows="4"
                    />
                  </div>

                  <div className="customer-info">
                    <h4>معلومات صاحبة الجلسة</h4>
                    <div className="info-grid">
                      <div className="form-group">
                        <label className="form-label">الاسم</label>
                        <input
                          type="text"
                          className="form-input"
                          value={bookingData.customerInfo.name}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              customerInfo: {
                                ...bookingData.customerInfo,
                                name: e.target.value,
                              },
                            })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">رقم الهاتف</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={bookingData.customerInfo.phone}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              customerInfo: {
                                ...bookingData.customerInfo,
                                phone: e.target.value,
                              },
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button
                      type="submit"
                      className="btn-primary confirm-btn"
                      disabled={submitting}
                    >
                      {submitting ? "جاري الحجز..." : "تأكيد الحجز"}
                    </button>
                    <p className="booking-note">
                      سيتم التواصل معك خلال 24 ساعة لتأكيد الموعد
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Consultation Booking */}
      {selectedCategory === "consultation" && (
        <section className="consultation-booking section">
          <div className="container">
            <div className="consultation-header">
              <button
                className="back-btn"
                onClick={() => setSelectedCategory("")}
              >
                ← العودة لاختيار نوع الجلسة
              </button>
            </div>

            <div className="consultation-content">
              <div className="consultation-why-grid">
                <div className="consultation-why-heading text-right">
                  <h2>لماذا الاستشارة المجانية؟</h2>
                  <p>
                    احصلي على تقييم شخصي مجاني لاحتياجاتك الجمالية مع خبراء
                    متخصصين
                  </p>
                </div>
                <div className="consultation-why-points">
                  <ul>
                    <li>تحليل شامل لنوع بشرتك وتحديد المشاكل</li>
                    <li>استشارة مع أخصائيات معتمدات ذوات خبرة عالية</li>
                    <li>وضع برنامج علاجي مخصص يناسب احتياجاتك</li>
                    <li>استشارة 30 دقيقة مجانية تماماً بدون أي تكلفة</li>
                  </ul>
                </div>
              </div>

              <div className="consultation-form-container">
                <form onSubmit={handleSubmit} className="consultation-form">
                  <h3>معلومات الحجز</h3>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">الاسم الكامل</label>
                      <input
                        type="text"
                        className="form-input"
                        value={consultationData.customerInfo.name}
                        onChange={(e) =>
                          setConsultationData({
                            ...consultationData,
                            customerInfo: {
                              ...consultationData.customerInfo,
                              name: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">رقم الهاتف</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={consultationData.customerInfo.phone}
                        onChange={(e) =>
                          setConsultationData({
                            ...consultationData,
                            customerInfo: {
                              ...consultationData.customerInfo,
                              phone: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">البريد الإلكتروني</label>
                      <input
                        type="email"
                        className="form-input"
                        value={consultationData.customerInfo.email}
                        onChange={(e) =>
                          setConsultationData({
                            ...consultationData,
                            customerInfo: {
                              ...consultationData.customerInfo,
                              email: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">العمر</label>
                      <select
                        className="form-input"
                        value={consultationData.ageRange}
                        onChange={(e) =>
                          setConsultationData({
                            ...consultationData,
                            ageRange: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">اختاري الفئة العمرية</option>
                        <option value="18-25">18-25 سنة</option>
                        <option value="26-35">26-35 سنة</option>
                        <option value="36-45">36-45 سنة</option>
                        <option value="46+">46+ سنة</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      المشاكل الجمالية الحالية
                    </label>
                    <div className="checkbox-group">
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={consultationData.skinConcerns.includes(
                            "حب الشباب"
                          )}
                          onChange={(e) => {
                            const concern = "حب الشباب";
                            setConsultationData({
                              ...consultationData,
                              skinConcerns: e.target.checked
                                ? [...consultationData.skinConcerns, concern]
                                : consultationData.skinConcerns.filter(
                                    (c) => c !== concern
                                  ),
                            });
                          }}
                        />{" "}
                        حب الشباب
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={consultationData.skinConcerns.includes(
                            "تصبغات البشرة"
                          )}
                          onChange={(e) => {
                            const concern = "تصبغات البشرة";
                            setConsultationData({
                              ...consultationData,
                              skinConcerns: e.target.checked
                                ? [...consultationData.skinConcerns, concern]
                                : consultationData.skinConcerns.filter(
                                    (c) => c !== concern
                                  ),
                            });
                          }}
                        />{" "}
                        تصبغات البشرة
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={consultationData.skinConcerns.includes(
                            "شعر زائد"
                          )}
                          onChange={(e) => {
                            const concern = "شعر زائد";
                            setConsultationData({
                              ...consultationData,
                              skinConcerns: e.target.checked
                                ? [...consultationData.skinConcerns, concern]
                                : consultationData.skinConcerns.filter(
                                    (c) => c !== concern
                                  ),
                            });
                          }}
                        />{" "}
                        شعر زائد
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={consultationData.skinConcerns.includes(
                            "تجاعيد وخطوط"
                          )}
                          onChange={(e) => {
                            const concern = "تجاعيد وخطوط";
                            setConsultationData({
                              ...consultationData,
                              skinConcerns: e.target.checked
                                ? [...consultationData.skinConcerns, concern]
                                : consultationData.skinConcerns.filter(
                                    (c) => c !== concern
                                  ),
                            });
                          }}
                        />{" "}
                        تجاعيد وخطوط
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={consultationData.skinConcerns.includes(
                            "ندوب"
                          )}
                          onChange={(e) => {
                            const concern = "ندوب";
                            setConsultationData({
                              ...consultationData,
                              skinConcerns: e.target.checked
                                ? [...consultationData.skinConcerns, concern]
                                : consultationData.skinConcerns.filter(
                                    (c) => c !== concern
                                  ),
                            });
                          }}
                        />{" "}
                        ندوب
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={consultationData.skinConcerns.includes(
                            "جفاف البشرة"
                          )}
                          onChange={(e) => {
                            const concern = "جفاف البشرة";
                            setConsultationData({
                              ...consultationData,
                              skinConcerns: e.target.checked
                                ? [...consultationData.skinConcerns, concern]
                                : consultationData.skinConcerns.filter(
                                    (c) => c !== concern
                                  ),
                            });
                          }}
                        />{" "}
                        جفاف البشرة
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">التاريخ المفضل</label>
                    <input
                      type="date"
                      className="form-input"
                      value={consultationData.date}
                      min={getMinDate()}
                      onChange={(e) =>
                        setConsultationData({
                          ...consultationData,
                          date: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">الوقت المفضل</label>
                    <select
                      className="form-input"
                      value={consultationData.timeSlot}
                      onChange={(e) =>
                        setConsultationData({
                          ...consultationData,
                          timeSlot: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">اختاري الوقت</option>
                      <option value="morning">الصباح (9:00 - 12:00)</option>
                      <option value="afternoon">
                        بعد الظهر (12:00 - 16:00)
                      </option>
                      <option value="evening">المساء (16:00 - 20:00)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ملاحظات إضافية</label>
                    <textarea
                      className="form-textarea"
                      value={consultationData.notes}
                      onChange={(e) =>
                        setConsultationData({
                          ...consultationData,
                          notes: e.target.value,
                        })
                      }
                      placeholder="اذكري أي معلومات إضافية تساعدنا في تقديم الاستشارة الأنسب لك..."
                      rows="4"
                    />
                  </div>

                  <div className="consultation-actions">
                    <button
                      type="submit"
                      className="btn-primary consultation-btn"
                      disabled={submitting}
                    >
                      {submitting ? "جاري الحجز..." : "احجزي استشارتك المجانية"}
                    </button>
                    <p className="consultation-note">
                      سيتم التواصل معك خلال 24 ساعة لتأكيد موعد الاستشارة
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action - Only show when no category is selected */}
      {!selectedCategory && (
        <section className="booking-cta section">
          <div className="container">
            <div className="cta-content text-center">
              <h2>مستعدة لتجربة التميز؟</h2>
              <p>اكتشفي الخدمة المناسبة لك</p>
              <div className="cta-buttons">
                {/* <button
                  className="btn-primary"
                  onClick={() => setSelectedCategory("consultation")}
                >
                  احجزي استشارة مجانية
                </button> */}
                <button
                  className="consultation-btn-secondary"
                  onClick={() => navigate("/faq")}
                >
                  الأسئلة الشائعة
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <CustomModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
        onClose={closeModal}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancel={modalState.showCancel}
      />
    </div>
  );
};

export default BookingPage;
