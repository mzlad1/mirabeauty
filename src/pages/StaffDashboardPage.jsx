import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StaffDashboardPage.css";
import {
  getAppointmentsByStaff,
  updateAppointmentStatus,
  confirmAppointment,
  completeAppointment,
} from "../services/appointmentsService";
import { getCustomers } from "../services/usersService";

const StaffDashboardPage = ({ currentUser, userData }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [myAppointments, setMyAppointments] = useState([]);
  const [myCustomers, setMyCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to parse price string to number
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    if (typeof priceString === "number") return priceString;
    // Extract numeric value from strings like "200 شيكل" or "200"
    const match = priceString.toString().match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // Load staff appointments and customers
  useEffect(() => {
    const loadStaffData = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);
        const [appointmentsData, customersData] = await Promise.all([
          getAppointmentsByStaff(currentUser.uid),
          getCustomers(),
        ]);

        setMyAppointments(appointmentsData);

        // Filter customers who have appointments with this staff member
        const staffCustomers = customersData.filter((customer) =>
          appointmentsData.some((apt) => apt.customerId === customer.id)
        );
        setMyCustomers(staffCustomers);
      } catch (err) {
        console.error("Error loading staff data:", err);
        setError("فشل في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    loadStaffData();
  }, [currentUser?.uid]);

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

  const myRevenue = completedAppointments.reduce((sum, apt) => {
    const price = parsePrice(apt.servicePrice || apt.price);
    return sum + price;
  }, 0);
  const completionRate =
    myAppointments.length > 0
      ? Math.round((completedAppointments.length / myAppointments.length) * 100)
      : 0;

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

  // Reload appointments
  const reloadAppointments = async () => {
    try {
      const appointmentsData = await getAppointmentsByStaff(currentUser.uid);
      setMyAppointments(appointmentsData);
    } catch (error) {
      console.error("Error reloading appointments:", error);
    }
  };

  // Handle confirm appointment
  const handleConfirmAppointment = async (appointmentId) => {
    if (!window.confirm("هل تريد تأكيد هذا الموعد؟")) {
      return;
    }

    try {
      await confirmAppointment(appointmentId);
      await reloadAppointments();
      alert("تم تأكيد الموعد بنجاح");
    } catch (error) {
      console.error("Error confirming appointment:", error);
      alert("حدث خطأ أثناء تأكيد الموعد");
    }
  };

  // Handle complete appointment
  const handleCompleteAppointment = async (appointmentId) => {
    if (!window.confirm("هل تريد إتمام هذا الموعد؟")) {
      return;
    }

    try {
      await completeAppointment(appointmentId);
      await reloadAppointments();
      alert("تم إتمام الموعد بنجاح");
    } catch (error) {
      console.error("Error completing appointment:", error);
      alert("حدث خطأ أثناء إتمام الموعد");
    }
  };

  // Handle edit appointment
  const handleEditAppointment = (appointment) => {
    alert(
      "لتعديل الموعد، يرجى التواصل مع الإدارة. سيتم إضافة هذه الميزة قريباً."
    );
  };

  // Handle view appointment details
  const handleViewAppointmentDetails = (appointment) => {
    alert(
      `تفاصيل الموعد:\n\nالعميل: ${appointment.customerName}\nالخدمة: ${
        appointment.serviceName
      }\nالتاريخ: ${appointment.date}\nالوقت: ${appointment.time}\nالمدة: ${
        appointment.serviceDuration || appointment.duration
      } دقيقة\nالسعر: ${
        appointment.servicePrice || appointment.price
      } شيكل\nالملاحظات: ${appointment.notes || "لا توجد"}`
    );
  };

  // Handle book appointment for customer
  const handleBookAppointment = () => {
    navigate("/book");
  };

  // Handle view customer history
  const handleViewCustomerHistory = (customer) => {
    const customerAppts = myAppointments.filter(
      (apt) => apt.customerId === customer.id
    );
    const history = customerAppts
      .map((apt) => `${apt.date} - ${apt.serviceName} - ${apt.status}`)
      .join("\n");

    alert(
      `تاريخ جلسات ${customer.name}:\n\n${history || "لا توجد جلسات سابقة"}`
    );
  };

  if (loading) {
    return (
      <div className="staff-dashboard">
        <section className="dashboard-content">
          <div className="container">
            <div className="loading-state">
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
      <div className="staff-dashboard">
        <section className="dashboard-content">
          <div className="container">
            <div className="error-state">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
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
    <div className="staff-dashboard">
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
                  <i className="nav-icon fas fa-chart-pie"></i>
                  نظرة عامة
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "schedule" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("schedule")}
                >
                  <i className="nav-icon fas fa-calendar-alt"></i>
                  جدول المواعيد
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "appointments" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("appointments")}
                >
                  <i className="nav-icon fas fa-clipboard-list"></i>
                  المواعيد
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "customers" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("customers")}
                >
                  <i className="nav-icon fas fa-users"></i>
                  عملائي
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "performance" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("performance")}
                >
                  <i className="nav-icon fas fa-chart-line"></i>
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

                  {/* Header Statistics */}
                  <div className="header-stats-overview">
                    <div className="header-stat-card">
                      <i className="stat-icon fas fa-calendar-day"></i>
                      <div className="stat-info">
                        <h3>{todayAppointments.length}</h3>
                        <p>مواعيد اليوم</p>
                      </div>
                    </div>
                    <div className="header-stat-card">
                      <i className="stat-icon fas fa-calendar-plus"></i>
                      <div className="stat-info">
                        <h3>{upcomingAppointments.length}</h3>
                        <p>مواعيد قادمة</p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics Cards */}
                  <div className="stats-grid">
                    <div className="stat-card total">
                      <i className="stat-icon fas fa-calendar-check"></i>
                      <div className="stat-info">
                        <h3>{myAppointments.length}</h3>
                        <p>إجمالي المواعيد</p>
                      </div>
                    </div>
                    <div className="stat-card completed">
                      <i className="stat-icon fas fa-check-circle"></i>
                      <div className="stat-info">
                        <h3>{completedAppointments.length}</h3>
                        <p>مواعيد مكتملة</p>
                      </div>
                    </div>
                    <div className="stat-card revenue">
                      <i className="stat-icon fas fa-dollar-sign"></i>
                      <div className="stat-info">
                        <h3>{myRevenue.toLocaleString()}</h3>
                        <p>إجمالي الإيرادات</p>
                      </div>
                    </div>
                    <div className="stat-card rate">
                      <i className="stat-icon fas fa-percentage"></i>
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
                                  {appointment.serviceDuration ||
                                    appointment.duration}{" "}
                                  دقيقة
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
                        {new Date(selectedDate).toLocaleDateString("en-US", {
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
                                    {appointment.serviceDuration ||
                                      appointment.duration}{" "}
                                    دقيقة
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
                                <span>
                                  <i className="fas fa-calendar"></i>{" "}
                                  {appointment.date}
                                </span>
                                <span>
                                  <i className="fas fa-clock"></i>{" "}
                                  {appointment.time}
                                </span>
                                <span>
                                  <i className="fas fa-hourglass-half"></i>{" "}
                                  {appointment.serviceDuration ||
                                    appointment.duration}{" "}
                                  دقيقة
                                </span>
                                <span>
                                  <i className="fas fa-money-bill"></i>{" "}
                                  {appointment.servicePrice ||
                                    appointment.price}{" "}
                                  شيكل
                                </span>
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
                              <button
                                className="action-btn confirm"
                                onClick={() =>
                                  handleConfirmAppointment(appointment.id)
                                }
                              >
                                تأكيد
                              </button>
                            )}
                            {appointment.status === "مؤكد" && (
                              <button
                                className="action-btn complete"
                                onClick={() =>
                                  handleCompleteAppointment(appointment.id)
                                }
                              >
                                إتمام
                              </button>
                            )}
                            <button
                              className="action-btn edit"
                              onClick={() => handleEditAppointment(appointment)}
                            >
                              تعديل
                            </button>
                            <button
                              className="action-btn view"
                              onClick={() =>
                                handleViewAppointmentDetails(appointment)
                              }
                            >
                              تفاصيل
                            </button>
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
                        .reduce((sum, apt) => {
                          const price = parsePrice(
                            apt.servicePrice || apt.price
                          );
                          return sum + price;
                        }, 0);

                      return (
                        <div key={customer.id} className="customer-card">
                          <div className="customer-header">
                            <img
                              src={
                                customer.avatar || "/assets/default-avatar.jpg"
                              }
                              alt={customer.name}
                              onError={(e) => {
                                e.target.src = "/assets/default-avatar.jpg";
                              }}
                            />
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
                            <button
                              className="action-btn"
                              onClick={handleBookAppointment}
                            >
                              حجز موعد
                            </button>
                            <button
                              className="action-btn"
                              onClick={() =>
                                handleViewCustomerHistory(customer)
                              }
                            >
                              عرض التاريخ
                            </button>
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
                      <i className="fas fa-chart-area"></i> مخطط الأداء الشهري
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
