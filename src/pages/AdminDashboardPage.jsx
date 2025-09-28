import React, { useState, useEffect } from "react";
import "./AdminDashboardPage.css";
import { sampleAppointments } from "../data/sampleAppointments";
import { sampleUsers } from "../data/sampleUsers";
import { sampleServices } from "../data/sampleServices";

const AdminDashboardPage = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("thisMonth");

  // Calculate statistics
  const totalCustomers = sampleUsers.filter(
    (user) => user.role === "customer"
  ).length;
  const totalStaff = sampleUsers.filter((user) => user.role === "staff").length;
  const totalAppointments = sampleAppointments.length;
  const completedAppointments = sampleAppointments.filter(
    (apt) => apt.status === "مكتمل"
  ).length;
  const totalRevenue = sampleAppointments
    .filter((apt) => apt.status === "مكتمل")
    .reduce((sum, apt) => sum + apt.price, 0);

  const todayAppointments = sampleAppointments.filter((apt) => {
    const today = new Date().toISOString().split("T")[0];
    return apt.date === today;
  });

  const upcomingAppointments = sampleAppointments.filter(
    (apt) => apt.status === "مؤكد" || apt.status === "في الانتظار"
  );

  const recentAppointments = sampleAppointments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  const customers = sampleUsers.filter((user) => user.role === "customer");
  const staff = sampleUsers.filter((user) => user.role === "staff");

  // Service popularity
  const serviceStats = sampleServices
    .map((service) => {
      const serviceAppointments = sampleAppointments.filter(
        (apt) => apt.serviceId === service.id
      );
      const revenue = serviceAppointments.reduce(
        (sum, apt) => sum + apt.price,
        0
      );
      return {
        ...service,
        appointmentCount: serviceAppointments.length,
        revenue: revenue,
      };
    })
    .sort((a, b) => b.appointmentCount - a.appointmentCount);

  // Staff performance
  const staffStats = staff
    .map((staffMember) => {
      const staffAppointments = sampleAppointments.filter(
        (apt) => apt.staffId === staffMember.id
      );
      const completedAppts = staffAppointments.filter(
        (apt) => apt.status === "مكتمل"
      );
      const revenue = completedAppts.reduce((sum, apt) => sum + apt.price, 0);
      return {
        ...staffMember,
        appointmentCount: staffAppointments.length,
        completedCount: completedAppts.length,
        revenue: revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

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

  return (
    <div className="admin-dashboard">
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
                    activeTab === "appointments" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("appointments")}
                >
                  <i className="nav-icon fas fa-calendar-alt"></i>
                  المواعيد
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "customers" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("customers")}
                >
                  <i className="nav-icon fas fa-users"></i>
                  العملاء
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "staff" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("staff")}
                >
                  <i className="nav-icon fas fa-user-tie"></i>
                  الموظفات
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "services" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("services")}
                >
                  <i className="nav-icon fas fa-spa"></i>
                  الخدمات
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "reports" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("reports")}
                >
                  <i className="nav-icon fas fa-chart-line"></i>
                  التقارير
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "settings" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  <i className="nav-icon fas fa-cog"></i>
                  الإعدادات
                </button>
              </nav>
            </aside>

            {/* Dashboard Main Content */}
            <main className="dashboard-main">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>نظرة عامة</h2>
                    <div className="overview-actions">
                      <select
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        className="timeframe-select"
                      >
                        <option value="today">اليوم</option>
                        <option value="thisWeek">هذا الأسبوع</option>
                        <option value="thisMonth">هذا الشهر</option>
                        <option value="thisYear">هذا العام</option>
                      </select>
                      <button className="btn-primary">تقرير جديد</button>
                    </div>
                  </div>

                  {/* Statistics Cards */}
                  <div className="stats-grid">
                    <div className="stat-card revenue">
                      <i className="stat-icon fas fa-dollar-sign"></i>
                      <div className="stat-info">
                        <h3>{totalRevenue.toLocaleString()} شيكل</h3>
                        <p>إجمالي الإيرادات</p>
                        <span className="stat-change positive">
                          +12% من الشهر الماضي
                        </span>
                      </div>
                    </div>
                    <div className="stat-card appointments">
                      <i className="stat-icon fas fa-calendar-check"></i>
                      <div className="stat-info">
                        <h3>{totalAppointments}</h3>
                        <p>إجمالي المواعيد</p>
                        <span className="stat-change positive">
                          +8% من الشهر الماضي
                        </span>
                      </div>
                    </div>
                    <div className="stat-card customers">
                      <i className="stat-icon fas fa-user-friends"></i>
                      <div className="stat-info">
                        <h3>{totalCustomers}</h3>
                        <p>إجمالي العملاء</p>
                        <span className="stat-change positive">
                          +15% من الشهر الماضي
                        </span>
                      </div>
                    </div>
                    <div className="stat-card completion">
                      <i className="stat-icon fas fa-check-circle"></i>
                      <div className="stat-info">
                        <h3>
                          {Math.round(
                            (completedAppointments / totalAppointments) * 100
                          )}
                          %
                        </h3>
                        <p>معدل إتمام المواعيد</p>
                        <span className="stat-change positive">
                          +3% من الشهر الماضي
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Today's Overview */}
                  <div className="today-overview">
                    <h3>نظرة على اليوم</h3>
                    <div className="today-stats">
                      <div className="today-item">
                        <span className="today-number">
                          {todayAppointments.length}
                        </span>
                        <span className="today-label">مواعيد اليوم</span>
                      </div>
                      <div className="today-item">
                        <span className="today-number">
                          {upcomingAppointments.length}
                        </span>
                        <span className="today-label">مواعيد قادمة</span>
                      </div>
                      <div className="today-item">
                        <span className="today-number">
                          {staff.filter((s) => s.active).length}
                        </span>
                        <span className="today-label">موظفين متاحين</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="quick-actions">
                    <h3>إجراءات سريعة</h3>
                    <div className="actions-grid">
                      <button className="action-card">
                        <i className="action-icon fas fa-edit"></i>
                        <span className="action-text">حجز موعد جديد</span>
                      </button>
                      <button className="action-card">
                        <i className="action-icon fas fa-user"></i>
                        <span className="action-text">إضافة عميل جديد</span>
                      </button>
                      <button className="action-card">
                        <i className="action-icon fas fa-briefcase"></i>
                        <span className="action-text">إضافة موظف</span>
                      </button>
                      <button className="action-card">
                        <i className="action-icon fas fa-chart-bar"></i>
                        <span className="action-text">إنشاء تقرير</span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="recent-activity">
                    <h3>النشاط الأخير</h3>
                    <div className="activity-list">
                      {recentAppointments.slice(0, 5).map((appointment) => (
                        <div key={appointment.id} className="activity-item">
                          <div className="activity-info">
                            <h4>{appointment.customerName}</h4>
                            <p>حجز {appointment.serviceName}</p>
                            <span className="activity-time">
                              {new Date(
                                appointment.createdAt
                              ).toLocaleDateString("en-US")}
                            </span>
                          </div>
                          <span
                            className={`activity-status ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === "appointments" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>إدارة المواعيد</h2>
                    <button className="btn-primary">حجز موعد جديد</button>
                  </div>

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
                      placeholder="بحث بالاسم..."
                      className="filter-search"
                    />
                  </div>

                  <div className="appointments-table">
                    <table>
                      <thead>
                        <tr>
                          <th>العميل</th>
                          <th>الخدمة</th>
                          <th>الأخصائية</th>
                          <th>التاريخ</th>
                          <th>الوقت</th>
                          <th>الحالة</th>
                          <th>الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentAppointments.map((appointment) => (
                          <tr key={appointment.id}>
                            <td>
                              <div className="customer-info">
                                <strong>{appointment.customerName}</strong>
                                <span>{appointment.customerPhone}</span>
                              </div>
                            </td>
                            <td>{appointment.serviceName}</td>
                            <td>{appointment.staffName}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.time}</td>
                            <td>
                              <span
                                className={`status ${getStatusColor(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button className="action-btn edit">
                                  تعديل
                                </button>
                                <button className="action-btn delete">
                                  حذف
                                </button>
                                <button className="action-btn view">عرض</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Customers Tab */}
              {activeTab === "customers" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>إدارة العملاء</h2>
                    <button className="btn-primary">إضافة عميل جديد</button>
                  </div>

                  <div className="customers-grid">
                    {customers.map((customer) => (
                      <div key={customer.id} className="customer-card">
                        <div className="customer-header">
                          <img src={customer.avatar} alt={customer.name} />
                          <div className="customer-info">
                            <h4>{customer.name}</h4>
                            <p>{customer.email}</p>
                            <p>{customer.phone}</p>
                          </div>
                        </div>
                        <div className="customer-stats">
                          <div className="customer-stat">
                            <span className="stat-label">المواعيد:</span>
                            <span className="stat-value">
                              {customer.appointmentsCount || 0}
                            </span>
                          </div>
                          <div className="customer-stat">
                            <span className="stat-label">المصروفات:</span>
                            <span className="stat-value">
                              {customer.totalSpent || 0} شيكل
                            </span>
                          </div>
                          <div className="customer-stat">
                            <span className="stat-label">النقاط:</span>
                            <span className="stat-value">
                              {customer.loyaltyPoints || 0}
                            </span>
                          </div>
                        </div>
                        <div className="customer-actions">
                          <button className="action-btn view">عرض الملف</button>
                          <button className="action-btn edit">تعديل</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff Tab */}
              {activeTab === "staff" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>إدارة الموظفين</h2>
                    <button className="btn-primary">إضافة موظف جديد</button>
                  </div>

                  <div className="staff-grid">
                    {staffStats.map((staffMember) => (
                      <div key={staffMember.id} className="staff-card">
                        <div className="staff-header">
                          <img
                            src={staffMember.avatar}
                            alt={staffMember.name}
                          />
                          <div className="staff-info">
                            <h4>{staffMember.name}</h4>
                            <p>{staffMember.specialization}</p>
                            <span
                              className={`staff-status ${
                                staffMember.active ? "active" : "inactive"
                              }`}
                            >
                              {staffMember.active ? "نشط" : "غير نشط"}
                            </span>
                          </div>
                        </div>
                        <div className="staff-performance">
                          <div className="performance-item">
                            <span className="perf-label">المواعيد:</span>
                            <span className="perf-value">
                              {staffMember.appointmentCount}
                            </span>
                          </div>
                          <div className="performance-item">
                            <span className="perf-label">المكتملة:</span>
                            <span className="perf-value">
                              {staffMember.completedCount}
                            </span>
                          </div>
                          <div className="performance-item">
                            <span className="perf-label">الإيرادات:</span>
                            <span className="perf-value">
                              {staffMember.revenue} شيكل
                            </span>
                          </div>
                        </div>
                        <div className="staff-actions">
                          <button className="action-btn schedule">
                            الجدول
                          </button>
                          <button className="action-btn edit">تعديل</button>
                          <button className="action-btn performance">
                            الأداء
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {activeTab === "services" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>إدارة الخدمات</h2>
                    <button className="btn-primary">إضافة خدمة جديدة</button>
                  </div>

                  <div className="services-table">
                    <table>
                      <thead>
                        <tr>
                          <th>اسم الخدمة</th>
                          <th>الفئة</th>
                          <th>السعر</th>
                          <th>المدة</th>
                          <th>عدد الحجوزات</th>
                          <th>الإيرادات</th>
                          <th>الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceStats.map((service) => (
                          <tr key={service.id}>
                            <td>{service.name}</td>
                            <td>{service.categoryName}</td>
                            <td>{service.price}</td>
                            <td>{service.duration}</td>
                            <td>{service.appointmentCount}</td>
                            <td>{service.revenue} شيكل</td>
                            <td>
                              <div className="table-actions">
                                <button className="action-btn edit">
                                  تعديل
                                </button>
                                <button className="action-btn delete">
                                  حذف
                                </button>
                                <button className="action-btn stats">
                                  إحصائيات
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === "reports" && (
                <div className="tab-content">
                  <h2>التقارير والإحصائيات</h2>

                  <div className="reports-grid">
                    <div className="report-card">
                      <h3>تقرير الإيرادات</h3>
                      <div className="report-chart">
                        <div className="chart-placeholder">
                          <i className="fas fa-chart-area"></i> مخطط الإيرادات
                          الشهرية
                        </div>
                      </div>
                      <button className="btn-secondary">تحميل التقرير</button>
                    </div>

                    <div className="report-card">
                      <h3>أداء الخدمات</h3>
                      <div className="services-performance">
                        {serviceStats.slice(0, 5).map((service, index) => (
                          <div key={service.id} className="service-perf-item">
                            <span className="service-rank">#{index + 1}</span>
                            <span className="service-name">{service.name}</span>
                            <span className="service-bookings">
                              {service.appointmentCount} حجز
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="report-card">
                      <h3>أداء الموظفين</h3>
                      <div className="staff-performance-report">
                        {staffStats.map((staff, index) => (
                          <div key={staff.id} className="staff-perf-item">
                            <span className="staff-rank">#{index + 1}</span>
                            <span className="staff-name">{staff.name}</span>
                            <span className="staff-revenue">
                              {staff.revenue} شيكل
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="tab-content">
                  <h2>إعدادات النظام</h2>

                  <div className="settings-sections">
                    <div className="settings-section">
                      <h3>إعدادات عامة</h3>
                      <div className="settings-form">
                        <div className="form-group">
                          <label>اسم المركز</label>
                          <input
                            type="text"
                            value="مركز ميرا بيوتي"
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>العنوان</label>
                          <input
                            type="text"
                            value="رام الله , فلسطين"
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>رقم الهاتف</label>
                          <input
                            type="tel"
                            value="+970 11 234 5678"
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h3>إعدادات الحجز</h3>
                      <div className="settings-form">
                        <div className="form-group">
                          <label>حد أدنى للحجز المسبق</label>
                          <select className="form-select">
                            <option>24 ساعة</option>
                            <option>48 ساعة</option>
                            <option>72 ساعة</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>فترة الإلغاء المجاني</label>
                          <select className="form-select">
                            <option>24 ساعة</option>
                            <option>48 ساعة</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="btn-primary">حفظ الإعدادات</button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
