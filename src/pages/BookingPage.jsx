import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingPage.css";
import {
  getAllServices,
  getServicesByCategory,
} from "../services/servicesService";
import { getUsersByRole } from "../services/usersService";
import {
  createAppointment,
  checkStaffAvailability,
} from "../services/appointmentsService";

const BookingPage = ({ currentUser, userData }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(""); // إضافة حالة لنوع الجلسة
  const [bookingData, setBookingData] = useState({
    serviceId: "",
    staffId: "",
    date: "",
    time: "",
    notes: "",
    customerInfo: {
      name: userData?.name || currentUser?.displayName || "",
      phone: userData?.phone || "",
      email: userData?.email || currentUser?.email || "",
    },
  });

  // Firebase data states
  const [services, setServices] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load services and staff on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [servicesData, staffData] = await Promise.all([
          getAllServices(),
          getUsersByRole("staff"),
        ]);
        setServices(servicesData);
        setStaffMembers(staffData);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("حدث خطأ في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  const handleStaffSelect = (staffId) => {
    setBookingData({ ...bookingData, staffId });
    setStep(3);
  };

  const handleDateTimeSelect = (date, time) => {
    setBookingData({ ...bookingData, date, time });
    setStep(4);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("يرجى تسجيل الدخول أولاً");
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      // Check staff availability
      const isAvailable = await checkStaffAvailability(
        bookingData.staffId,
        bookingData.date,
        bookingData.time
      );

      if (!isAvailable) {
        alert("عذراً، هذا الموعد محجوز بالفعل. يرجى اختيار موعد آخر.");
        setSubmitting(false);
        return;
      }

      // Create appointment
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
        staffId: bookingData.staffId,
        staffName: selectedStaff?.name,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes,
        status: "pending",
      };

      await createAppointment(appointmentData);
      alert("تم حجز موعدك بنجاح! سيتم التواصل معك قريباً لتأكيد الموعد.");
      navigate("/profile");
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("حدث خطأ أثناء حجز الموعد. يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = services.find((s) => s.id === bookingData.serviceId);
  const selectedStaff = staffMembers.find((s) => s.id === bookingData.staffId);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

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
            <div className="category-cards">
              <div
                className="category-card flip-card"
                onClick={() => setSelectedCategory("skincare")}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front skincare-bg">
                    <div className="category-overlay">
                      <h3>جلسة بشرة</h3>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <h3>جلسة بشرة</h3>
                    <p>علاجات العناية بالبشرة والتجميل</p>
                    <ul>
                      <li>تجديد البشرة</li>
                      <li>تنظيف عميق</li>
                      <li>علاج التصبغات</li>
                      <li>مكافحة الشيخوخة</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="category-card flip-card"
                onClick={() => setSelectedCategory("laser")}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front laser-bg">
                    <div className="category-overlay">
                      <h3>جلسة ليزر</h3>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <h3>جلسة ليزر</h3>
                    <p>إزالة الشعر وعلاجات الليزر</p>
                    <ul>
                      <li>إزالة الشعر بالليزر</li>
                      <li>تقشير الليزر</li>
                      <li>علاج الندوب</li>
                      <li>شد البشرة</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
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
                <div className="step-title">اختيار الأخصائية</div>
              </div>
              <div
                className={`progress-step ${step >= 3 ? "active" : ""} ${
                  step > 3 ? "completed" : ""
                }`}
              >
                <div className="step-number">3</div>
                <div className="step-title">اختيار التاريخ والوقت</div>
              </div>
              <div className={`progress-step ${step >= 4 ? "active" : ""}`}>
                <div className="step-number">4</div>
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
                    {selectedCategory === "skincare"
                      ? "جلسات البشرة"
                      : "جلسات الليزر"}
                  </h2>
                </div>
                <div className="services-selection">
                  {services
                    .filter((service) => service.category === selectedCategory)
                    .map((service) => (
                      <div
                        key={service.id}
                        className="service-option"
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        <div className="service-image">
                          <img src={service.image} alt={service.name} />
                        </div>
                        <div className="service-details">
                          <h3>{service.name}</h3>
                          <p>{service.description}</p>
                          <div className="service-meta">
                            <span className="duration">
                              المدة: {service.duration}
                            </span>
                            <span className="price">{service.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Step 2: Staff Selection */}
            {step === 2 && (
              <div className="booking-step">
                <div className="step-header">
                  <button className="back-btn" onClick={() => setStep(1)}>
                    ← العودة
                  </button>
                  <h2>اختاري الأخصائية</h2>
                </div>
                <div className="selected-service-info">
                  <h3>الخدمة المختارة: {selectedService?.name}</h3>
                  <p>{selectedService?.description}</p>
                </div>
                <div className="staff-selection">
                  {staffMembers.map((staff) => (
                    <div
                      key={staff.id}
                      className="staff-option"
                      onClick={() => handleStaffSelect(staff.id)}
                    >
                      <div className="staff-avatar">
                        <img src={staff.avatar} alt={staff.name} />
                      </div>
                      <div className="staff-details">
                        <h3>{staff.name}</h3>
                        <p>{staff.specialization}</p>
                        <div className="staff-experience">
                          خبرة{" "}
                          {new Date().getFullYear() -
                            new Date(staff.joinDate).getFullYear()}{" "}
                          سنوات
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time Selection */}
            {step === 3 && (
              <div className="booking-step">
                <div className="step-header">
                  <button className="back-btn" onClick={() => setStep(2)}>
                    ← العودة
                  </button>
                  <h2>اختاري التاريخ والوقت</h2>
                </div>
                <div className="selected-info">
                  <div className="info-item">
                    <strong>الخدمة:</strong> {selectedService?.name}
                  </div>
                  <div className="info-item">
                    <strong>الأخصائية:</strong> {selectedStaff?.name}
                  </div>
                </div>
                <div className="datetime-selection">
                  <div className="date-selection">
                    <h3>اختاري التاريخ</h3>
                    <input
                      type="date"
                      value={bookingData.date}
                      min={getMinDate()}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, date: e.target.value })
                      }
                      className="form-input"
                    />
                  </div>
                  {bookingData.date && (
                    <div className="time-selection">
                      <h3>اختاري الوقت</h3>
                      <div className="time-slots">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            className={`time-slot ${
                              bookingData.time === time ? "selected" : ""
                            }`}
                            onClick={() =>
                              handleDateTimeSelect(bookingData.date, time)
                            }
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="booking-step">
                <div className="step-header">
                  <button className="back-btn" onClick={() => setStep(3)}>
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
                      <span className="label">الأخصائية:</span>
                      <span className="value">{selectedStaff?.name}</span>
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
                      <span className="value">{selectedService?.duration}</span>
                    </div>
                    <div className="summary-item price-item">
                      <span className="label">السعر:</span>
                      <span className="value">{selectedService?.price}</span>
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
                    <h4>معلومات التواصل</h4>
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

                    <div className="form-group">
                      <label className="form-label">البريد الإلكتروني</label>
                      <input
                        type="email"
                        className="form-input"
                        value={bookingData.customerInfo.email}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            customerInfo: {
                              ...bookingData.customerInfo,
                              email: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">العمر</label>
                      <select className="form-input" required>
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
                        <input type="checkbox" /> حب الشباب
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" /> تصبغات البشرة
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" /> شعر زائد
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" /> تجاعيد وخطوط
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" /> ندوب
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" /> جفاف البشرة
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">التاريخ المفضل</label>
                    <input
                      type="date"
                      className="form-input"
                      value={bookingData.date}
                      min={getMinDate()}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, date: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">الوقت المفضل</label>
                    <select
                      className="form-input"
                      value={bookingData.time}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, time: e.target.value })
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
                      value={bookingData.notes}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
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
              <p>احجزي استشارة مجانية اليوم واكتشفي الخدمة المناسبة لك</p>
              <div className="cta-buttons">
                <button
                  className="btn-primary"
                  onClick={() => setSelectedCategory("consultation")}
                >
                  احجزي استشارة مجانية
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => navigate("/faq")}
                >
                  الأسئلة الشائعة
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BookingPage;
