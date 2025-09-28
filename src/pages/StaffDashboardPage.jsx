import React, { useState, useEffect } from "react";
import "./StaffDashboardPage.css";
import { sampleAppointments } from "../data/sampleAppointments";
import { sampleUsers } from "../data/sampleUsers";

const StaffDashboardPage = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Filter appointments for current staff member
  const myAppointments = sampleAppointments.filter(
    (appointment) => appointment.staffId === currentUser.id
  );

  const todayAppointments = myAppointments.filter((apt) => {
    const today = new Date().toISOString().split("T")[0];
    return apt.date === today;
  });

  const upcomingAppointments = myAppointments.filter(
    (apt) =>
      (apt.status === "مؤكد" || apt.status === "في الانتظار") &&
      apt.date >= new Date().toISOString().split("T")[0]
  );

  const completedAppointments = myAppointments.filter(
    (apt) => apt.status === "مكتمل"
  );

  const selectedDateAppointments = myAppointments.filter(
    (apt) => apt.date === selectedDate
  );

  const myRevenue = completedAppointments.reduce(
    (sum, apt) => sum + apt.price,
    0
  );
  const completionRate =
    myAppointments.length > 0
      ? Math.round((completedAppointments.length / myAppointments.length) * 100)
      : 0;

  // Get customers for this staff member
  const myCustomers = sampleUsers.filter((user) => {
    return (
      user.role === "customer" &&
      myAppointments.some((apt) => apt.customerId === user.id)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "مؤكد":
        return "confirmed";
      case "في الانتظار":
        return "pending";
      case "مكتمل":
        return "completed";
      case "ملغي":
        return "cancelled";
      default:
        return "pending";
    }
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    return slots;
  };

  return (
    <div className="staff-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-stats">
              <div className="header-stat">
                <span className="stat-number">{todayAppointments.length}</span>
                <span className="stat-label">مواعيد اليوم</span>
              </div>
              <div className="header-stat">
                <span className="stat-number">
                  {upcomingAppointments.length}
                </span>
                <span className="stat-label">مواعيد قادمة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <section className="dashboard-content">
        <div className="container">
          <div className="dashboard-layout">
            {/* Dashboard Navigation */}
            <aside className="dashboard-sidebar">
              <nav className="dashboard-nav">
                <button
                  className={`nav-item ${
                    activeTab === "overview" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  <span className="nav-icon">📊</span>
                  نظرة عامة
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "schedule" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("schedule")}
                >
                  <span className="nav-icon">📅</span>
                  جدولي اليومي
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "appointments" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("appointments")}
                >
                  <span className="nav-icon">📋</span>
                  مواعيدي
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "customers" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("customers")}
                >
                  <span className="nav-icon">👥</span>
                  عملائي
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "performance" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("performance")}
                >
                  <span className="nav-icon">📈</span>
                  أدائي
                </button>
              </nav>
            </aside>

            {/* Dashboard Main Content */}
            <main className="dashboard-main">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="tab-content">
                  <h2>نظرة عامة</h2>

                  {/* Statistics Cards */}
                  <div className="stats-grid">
                    <div className="stat-card total">
                      <div className="stat-icon">📅</div>
                      <div className="stat-info">
                        <h3>{myAppointments.length}</h3>
                        <p>إجمالي المواعيد</p>
                      </div>
                    </div>
                    <div className="stat-card completed">
                      <div className="stat-icon">✅</div>
                      <div className="stat-info">
                        <h3>{completedAppointments.length}</h3>
                        <p>مواعيد مكتملة</p>
                      </div>
                    </div>
                    <div className="stat-card revenue">
                      <div className="stat-icon">💰</div>
                      <div className="stat-info">
                        <h3>{myRevenue.toLocaleString()} شيكل</h3>
                        <p>إجمالي الإيرادات</p>
                      </div>
                    </div>
                    <div className="stat-card rate">
                      <div className="stat-icon">📊</div>
                      <div className="stat-info">
                        <h3>{completionRate}%</h3>
                        <p>معدل الإتمام</p>
                      </div>
                    </div>
                  </div>

                  {/* Today's Schedule */}
                  <div className="today-schedule">
                    <h3>جدول اليوم</h3>
                    {todayAppointments.length > 0 ? (
                      <div className="schedule-list">
                        {todayAppointments
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((appointment) => (
                            <div key={appointment.id} className="schedule-item">
                              <div className="schedule-time">
                                {appointment.time}
                              </div>
                              <div className="schedule-info">
                                <h4>{appointment.customerName}</h4>
                                <p>{appointment.serviceName}</p>
                                <span className="duration">
                                  {appointment.duration} دقيقة
                                </span>
                              </div>
                              <span
                                className={`status ${getStatusColor(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status}
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="empty-schedule">
                        <p>لا توجد مواعيد اليوم</p>
                      </div>
                    )}
                  </div>

                  {/* Upcoming Appointments */}
                  <div className="upcoming-appointments">
                    <h3>المواعيد القادمة</h3>
                    {upcomingAppointments.length > 0 ? (
                      <div className="upcoming-list">
                        {upcomingAppointments.slice(0, 5).map((appointment) => (
                          <div key={appointment.id} className="upcoming-item">
                            <div className="upcoming-date">
                              {appointment.date}
                            </div>
                            <div className="upcoming-info">
                              <h4>{appointment.customerName}</h4>
                              <p>{appointment.serviceName}</p>
                              <span className="upcoming-time">
                                {appointment.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-upcoming">
                        <p>لا توجد مواعيد قادمة</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === "schedule" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>جدولي اليومي</h2>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="date-picker"
                    />
                  </div>

                  <div className="schedule-view">
                    <div className="schedule-header">
                      <h3>
                        {new Date(selectedDate).toLocaleDateString("ar-SA", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <span className="appointments-count">
                        {selectedDateAppointments.length} موعد
                      </span>
                    </div>

                    <div className="time-schedule">
                      {getTimeSlots().map((timeSlot) => {
                        const appointment = selectedDateAppointments.find(
                          (apt) => apt.time === timeSlot
                        );

                        return (
                          <div key={timeSlot} className="time-slot">
                            <div className="slot-time">{timeSlot}</div>
                            <div
                              className={`slot-content ${
                                appointment ? "booked" : "free"
                              }`}
                            >
                              {appointment ? (
                                <div className="appointment-slot">
                                  <h4>{appointment.customerName}</h4>
                                  <p>{appointment.serviceName}</p>
                                  <span className="slot-duration">
                                    {appointment.duration} دقيقة
                                  </span>
                                  <span
                                    className={`slot-status ${getStatusColor(
                                      appointment.status
                                    )}`}
                                  >
                                    {appointment.status}
                                  </span>
                                </div>
                              ) : (
                                <div className="free-slot">
                                  <span>متاح</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === "appointments" && (
                <div className="tab-content">
                  <h2>مواعيدي</h2>

                  <div className="appointments-filters">
                    <select className="filter-select">
                      <option value="">جميع الحالات</option>
                      <option value="مؤكد">مؤكد</option>
                      <option value="في الانتظار">في الانتظار</option>
                      <option value="مكتمل">مكتمل</option>
                      <option value="ملغي">ملغي</option>
                    </select>
                    <input type="date" className="filter-date" />
                    <input
                      type="text"
                      placeholder="بحث بالعميل..."
                      className="filter-search"
                    />
                  </div>

                  <div className="appointments-list">
                    {myAppointments
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((appointment) => (
                        <div key={appointment.id} className="appointment-card">
                          <div className="appointment-header">
                            <div className="appointment-customer">
                              <h4>{appointment.customerName}</h4>
                              <p>{appointment.customerPhone}</p>
                            </div>
                            <span
                              className={`status ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                          <div className="appointment-body">
                            <div className="appointment-service">
                              <h3>{appointment.serviceName}</h3>
                              <div className="service-details">
                                <span>📅 {appointment.date}</span>
                                <span>🕐 {appointment.time}</span>
                                <span>⏱️ {appointment.duration} دقيقة</span>
                                <span>💰 {appointment.price} شيكل</span>
                              </div>
                            </div>
                            {appointment.notes && (
                              <div className="appointment-notes">
                                <h5>ملاحظات:</h5>
                                <p>{appointment.notes}</p>
                              </div>
                            )}
                          </div>
                          <div className="appointment-actions">
                            {appointment.status === "في الانتظار" && (
                              <button className="action-btn confirm">
                                تأكيد
                              </button>
                            )}
                            {appointment.status === "مؤكد" && (
                              <button className="action-btn complete">
                                إتمام
                              </button>
                            )}
                            <button className="action-btn edit">تعديل</button>
                            <button className="action-btn view">تفاصيل</button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Customers Tab */}
              {activeTab === "customers" && (
                <div className="tab-content">
                  <h2>عملائي</h2>

                  <div className="customers-grid">
                    {myCustomers.map((customer) => {
                      const customerAppointments = myAppointments.filter(
                        (apt) => apt.customerId === customer.id
                      );
                      const customerRevenue = customerAppointments
                        .filter((apt) => apt.status === "مكتمل")
                        .reduce((sum, apt) => sum + apt.price, 0);

                      return (
                        <div key={customer.id} className="customer-card">
                          <div className="customer-header">
                            <img src={customer.avatar} alt={customer.name} />
                            <div className="customer-info">
                              <h4>{customer.name}</h4>
                              <p>{customer.phone}</p>
                              <p>{customer.email}</p>
                            </div>
                          </div>
                          <div className="customer-details">
                            <div className="detail-item">
                              <span className="detail-label">نوع البشرة:</span>
                              <span className="detail-value">
                                {customer.skinType || "غير محدد"}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">الحساسية:</span>
                              <span className="detail-value">
                                {customer.allergies
                                  ? customer.allergies.join(", ")
                                  : "لا توجد"}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">عدد الجلسات:</span>
                              <span className="detail-value">
                                {customerAppointments.length}
                              </span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">
                                إجمالي المصروفات:
                              </span>
                              <span className="detail-value">
                                {customerRevenue} شيكل
                              </span>
                            </div>
                          </div>
                          <div className="customer-actions">
                            <button className="action-btn">حجز موعد</button>
                            <button className="action-btn">عرض التاريخ</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === "performance" && (
                <div className="tab-content">
                  <h2>تقرير الأداء</h2>

                  <div className="performance-overview">
                    <div className="performance-stats">
                      <div className="perf-stat">
                        <span className="perf-number">
                          {myAppointments.length}
                        </span>
                        <span className="perf-label">إجمالي المواعيد</span>
                      </div>
                      <div className="perf-stat">
                        <span className="perf-number">
                          {completedAppointments.length}
                        </span>
                        <span className="perf-label">مواعيد مكتملة</span>
                      </div>
                      <div className="perf-stat">
                        <span className="perf-number">{completionRate}%</span>
                        <span className="perf-label">معدل الإتمام</span>
                      </div>
                      <div className="perf-stat">
                        <span className="perf-number">
                          {myRevenue.toLocaleString()}
                        </span>
                        <span className="perf-label">
                          إجمالي الإيرادات (شيكل)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="performance-chart">
                    <h3>الأداء الشهري</h3>
                    <div className="chart-placeholder">
                      📊 مخطط الأداء الشهري
                      <p>عدد المواعيد والإيرادات لكل شهر</p>
                    </div>
                  </div>

                  <div className="recent-feedback">
                    <h3>آراء العملاء الأخيرة</h3>
                    <div className="feedback-list">
                      {myAppointments
                        .filter((apt) => apt.feedback && apt.rating)
                        .slice(0, 5)
                        .map((appointment) => (
                          <div key={appointment.id} className="feedback-item">
                            <div className="feedback-header">
                              <span className="customer-name">
                                {appointment.customerName}
                              </span>
                              <div className="rating">
                                {"⭐".repeat(appointment.rating)}
                              </div>
                            </div>
                            <p className="feedback-text">
                              "{appointment.feedback}"
                            </p>
                            <span className="feedback-date">
                              {appointment.date}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StaffDashboardPage;
