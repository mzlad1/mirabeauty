import React, { useState } from "react";
import { Link } from "react-router-dom";
import LuxuryCard from "../components/LuxuryCard";
import Button from "../components/Button";
import { services, timeSlots, weekDays } from "../data/arabicData";
import "./Booking.css";

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const allServices = [
    ...services.laser,
    ...services.skincare,
    ...services.vip,
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  const handleTimeSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentStep(3);
  };

  const handleConfirm = () => {
    // Static demo - just show success message
    alert("تم تأكيد الحجز بنجاح! (هذا عرض تجريبي)");
  };

  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date,
        dayName: weekDays[date.getDay()],
        dayNumber: date.getDate(),
        month: date.getMonth() + 1,
      });
    }
    return dates;
  };

  const weekDates = generateWeekDates();

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Header */}
        <div className="booking-page-header">
          <h1>احجزي جلستك</h1>
          <p>اختيار الخدمة المناسبة لكِ وتحديد الموعد المناسب</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div
            className={`step ${currentStep >= 1 ? "active" : ""} ${
              currentStep > 1 ? "completed" : ""
            }`}
          >
            <div className="step-number">1</div>
            <div className="step-label">اختيار الخدمة</div>
          </div>
          <div
            className={`step ${currentStep >= 2 ? "active" : ""} ${
              currentStep > 2 ? "completed" : ""
            }`}
          >
            <div className="step-number">2</div>
            <div className="step-label">تحديد الموعد</div>
          </div>
          <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">تأكيد الحجز</div>
          </div>
        </div>

        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="booking-step">
            <h2>اختر الخدمة المناسبة لكِ</h2>
            <div className="services-grid">
              {allServices.map((service) => (
                <LuxuryCard
                  key={service.id}
                  className="service-option"
                  badge={
                    service.popular
                      ? { text: "الأكثر طلباً", type: "gold" }
                      : null
                  }
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="service-info">
                    <div className="service-duration">
                      <span>المدة: {service.duration}</span>
                    </div>
                    <div className="service-price">
                      <span className="price">{service.price}</span>
                      {service.originalPrice && (
                        <span className="original-price">
                          {service.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </LuxuryCard>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Time Selection */}
        {currentStep === 2 && (
          <div className="booking-step">
            <div className="step-header">
              <h2>اختر الموعد المناسب</h2>
              <div className="selected-service">
                <span>الخدمة المختارة: </span>
                <strong>{selectedService?.name}</strong>
              </div>
            </div>

            <div className="time-selection">
              <h3>اختر اليوم</h3>
              <div className="dates-grid">
                {weekDates.map((dateInfo, index) => (
                  <button
                    key={index}
                    className={`date-option ${
                      selectedDate === dateInfo.date ? "selected" : ""
                    }`}
                    onClick={() => setSelectedDate(dateInfo.date)}
                  >
                    <div className="day-name">{dateInfo.dayName}</div>
                    <div className="day-number">{dateInfo.dayNumber}</div>
                    <div className="month">{dateInfo.month}</div>
                  </button>
                ))}
              </div>

              {selectedDate && (
                <>
                  <h3>اختر الوقت</h3>
                  <div className="times-grid">
                    {timeSlots.slice(0, 4).map((time, index) => (
                      <button
                        key={index}
                        className={`time-option ${
                          selectedTime === time ? "selected" : ""
                        }`}
                        onClick={() => handleTimeSelect(selectedDate, time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="step-actions">
              <Button variant="secondary" onClick={() => setCurrentStep(1)}>
                العودة
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="booking-step">
            <h2>تأكيد الحجز</h2>

            <LuxuryCard className="booking-summary">
              <h3>ملخص الحجز</h3>
              <div className="summary-details">
                <div className="summary-item">
                  <span className="label">الخدمة:</span>
                  <span className="value">{selectedService?.name}</span>
                </div>
                <div className="summary-item">
                  <span className="label">التاريخ:</span>
                  <span className="value">
                    {selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">الوقت:</span>
                  <span className="value">{selectedTime}</span>
                </div>
                <div className="summary-item">
                  <span className="label">المدة:</span>
                  <span className="value">{selectedService?.duration}</span>
                </div>
                <div className="summary-item total">
                  <span className="label">المجموع:</span>
                  <span className="value price">{selectedService?.price}</span>
                </div>
              </div>
            </LuxuryCard>

            <div className="booking-note">
              <LuxuryCard className="note-card">
                <h4>ملاحظات مهمة:</h4>
                <ul>
                  <li>يرجى الحضور قبل الموعد بـ 15 دقيقة</li>
                  <li>تجنبي التعرض للشمس قبل الجلسة</li>
                  <li>احرصي على حلاقة الشعر قبل الجلسة بـ 24 ساعة</li>
                  <li>يمكن إلغاء أو تأجيل الحجز قبل 24 ساعة</li>
                </ul>
              </LuxuryCard>
            </div>

            <div className="step-actions">
              <Button variant="secondary" onClick={() => setCurrentStep(2)}>
                العودة
              </Button>
              <Button variant="luxury" size="lg" onClick={handleConfirm}>
                تأكيد الحجز (تجريبي)
              </Button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="booking-help">
          <LuxuryCard className="help-card" gradient>
            <h3>تحتاجين مساعدة؟</h3>
            <p>فريقنا جاهز لمساعدتك في اختيار الخدمة المناسبة وتحديد الموعد</p>
            <div className="help-actions">
              <a href="https://wa.me/966501234567">
                <Button variant="secondary" icon="💬">
                  واتساب
                </Button>
              </a>
              <a href="tel:+970501234567">
                <Button variant="secondary" icon="📞">
                  اتصل بنا
                </Button>
              </a>
            </div>
          </LuxuryCard>
        </div>
      </div>
    </div>
  );
};

export default Booking;
