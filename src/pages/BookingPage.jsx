import React, { useState } from "react";
import "./BookingPage.css";
import { sampleServices } from "../data/sampleServices";
import { sampleUsers } from "../data/sampleUsers";

const BookingPage = ({ currentUser, setCurrentPage }) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(""); // إضافة حالة لنوع الجلسة
  const [bookingData, setBookingData] = useState({
    serviceId: "",
    staffId: "",
    date: "",
    time: "",
    notes: "",
    customerInfo: {
      name: currentUser?.name || "",
      phone: currentUser?.phone || "",
      email: currentUser?.email || "",
    },
  });

  const staffMembers = sampleUsers.filter((user) => user.role === "staff");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the booking data to your backend
    console.log("Booking submitted:", bookingData);
    alert("تم حجز موعدك بنجاح! سيتم التواصل معك قريباً لتأكيد الموعد.");
    setCurrentPage("profile");
  };

  const selectedService = sampleServices.find(
    (s) => s.id === parseInt(bookingData.serviceId)
  );
  const selectedStaff = staffMembers.find(
    (s) => s.id === parseInt(bookingData.staffId)
  );

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
                  onClick={() => setCurrentPage("login")}
                >
                  تسجيل الدخول
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setCurrentPage("register")}
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

  return (
    <div className="booking-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>احجزي موعدك</h1>
          <p>اختاري الخدمة والوقت المناسب لك</p>
        </div>
      </div>

      {/* Service Category Selection */}
      {!selectedCategory && (
        <section className="category-selection section">
          <div className="container">
            <h2>اختاري نوع الجلسة</h2>
            <div className="category-cards">
              <div
                className="category-card"
                onClick={() => setSelectedCategory("skincare")}
              >
                <div className="category-icon">🌟</div>
                <h3>جلسة بشرة</h3>
                <p>علاجات العناية بالبشرة والتجميل</p>
                <ul>
                  <li>تجديد البشرة</li>
                  <li>تنظيف عميق</li>
                  <li>علاج التصبغات</li>
                  <li>مكافحة الشيخوخة</li>
                </ul>
              </div>
              <div
                className="category-card"
                onClick={() => setSelectedCategory("laser")}
              >
                <div className="category-icon">⚡</div>
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
        </section>
      )}

      {/* Booking Steps */}
      {selectedCategory && (
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
                    className="back-to-category"
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
                  {sampleServices
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
                    <button type="submit" className="btn-primary confirm-btn">
                      تأكيد الحجز
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
    </div>
  );
};

export default BookingPage;
