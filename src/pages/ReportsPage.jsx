import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ReportsPage.css";
import { getAllAppointments } from "../services/appointmentsService";
import { getAllConsultations } from "../services/consultationsService";
import { getCustomers, getStaff } from "../services/usersService";
import { getAllServices } from "../services/servicesService";
import { getAllProducts } from "../services/productsService";
import { getAllOrders } from "../services/ordersService";

const ReportsPage = ({ currentUser, userData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState("overview");
  const [dateRange, setDateRange] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Data states
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Check if user is admin
  useEffect(() => {
    if (!currentUser || !userData || userData.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, userData, navigate]);

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [
          appointmentsData,
          consultationsData,
          customersData,
          staffData,
          servicesData,
          productsData,
          ordersResponse,
        ] = await Promise.all([
          getAllAppointments(),
          getAllConsultations(),
          getCustomers(),
          getStaff(),
          getAllServices(),
          getAllProducts(),
          getAllOrders({}, 1000), // Get up to 1000 orders for reports
        ]);

        setAppointments(appointmentsData);
        setConsultations(consultationsData);
        setCustomers(customersData);
        setStaff(staffData);
        setServices(servicesData);
        setProducts(productsData);
        // Extract orders array from the response object
        setOrders(ordersResponse?.orders || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to parse prices
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const priceStr = String(priceString);
    const numericValue = priceStr.replace(/[^\d.]/g, "");
    return parseFloat(numericValue) || 0;
  };

  // Filter data by date range
  const filterByDateRange = (data, dateField = "createdAt") => {
    // Ensure data is an array
    if (!Array.isArray(data)) return [];
    if (dateRange === "all") return data;

    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          const endDate = new Date(customEndDate);
          return data.filter((item) => {
            const itemDate = item[dateField]?.seconds
              ? new Date(item[dateField].seconds * 1000)
              : new Date(item[dateField]);
            return itemDate >= startDate && itemDate <= endDate;
          });
        }
        return data;
      default:
        return data;
    }

    return data.filter((item) => {
      const itemDate = item[dateField]?.seconds
        ? new Date(item[dateField].seconds * 1000)
        : new Date(item[dateField]);
      return itemDate >= startDate;
    });
  };

  // Calculate statistics
  const filteredAppointments = filterByDateRange(appointments);
  const filteredOrders = filterByDateRange(orders);
  const filteredConsultations = filterByDateRange(consultations);

  const totalAppointments = filteredAppointments.length;
  const completedAppointments = filteredAppointments.filter(
    (apt) => apt.status === "مكتمل"
  ).length;
  const cancelledAppointments = filteredAppointments.filter(
    (apt) => apt.status === "ملغي"
  ).length;
  const pendingAppointments = filteredAppointments.filter(
    (apt) => apt.status === "في الانتظار"
  ).length;
  const confirmedAppointments = filteredAppointments.filter(
    (apt) => apt.status === "مؤكد"
  ).length;

  const appointmentRevenue = filteredAppointments
    .filter((apt) => apt.status === "مكتمل")
    .reduce((sum, apt) => {
      const price = parsePrice(apt.servicePrice || apt.price);
      return sum + price;
    }, 0);

  // Count only delivered orders
  const deliveredOrders = filteredOrders.filter(
    (order) => order.status === "delivered"
  );
  const totalOrders = deliveredOrders.length;
  const confirmedOrders = filteredOrders.filter(
    (order) => order.status === "confirmed"
  ).length;
  const pendingOrders = filteredOrders.filter(
    (order) => order.status === "pending"
  ).length;
  const rejectedOrders = filteredOrders.filter(
    (order) => order.status === "rejected"
  ).length;

  // Calculate revenue only from delivered orders
  const ordersRevenue = deliveredOrders.reduce(
    (sum, order) => sum + parsePrice(order.total),
    0
  );

  const totalRevenue = appointmentRevenue + ordersRevenue;
  const totalConsultations = filteredConsultations.length;

  // Service statistics - count only completed appointments
  const serviceStats = services
    .map((service) => {
      const completedAppts = filteredAppointments.filter(
        (apt) => apt.serviceId === service.id && apt.status === "مكتمل"
      );
      const revenue = completedAppts.reduce((sum, apt) => {
        const price = parsePrice(apt.servicePrice || apt.price);
        return sum + price;
      }, 0);
      return {
        ...service,
        appointmentCount: completedAppts.length,
        completedCount: completedAppts.length,
        revenue: revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  // Product statistics - count only delivered orders
  const productStats = products
    .map((product) => {
      const deliveredProductOrders = deliveredOrders.filter((order) =>
        order.items?.some((item) => item.productId === product.id)
      );
      const totalSold = deliveredProductOrders.reduce((sum, order) => {
        const item = order.items.find((i) => i.productId === product.id);
        return sum + (item?.quantity || 0);
      }, 0);
      const revenue = deliveredProductOrders.reduce((sum, order) => {
        const item = order.items.find((i) => i.productId === product.id);
        return sum + parsePrice(item?.price || 0) * (item?.quantity || 0);
      }, 0);
      return {
        ...product,
        totalSold: totalSold,
        revenue: revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  // Staff statistics
  const staffStats = staff
    .map((staffMember) => {
      const staffAppointments = filteredAppointments.filter(
        (apt) => apt.staffId === staffMember.id
      );
      const completedAppts = staffAppointments.filter(
        (apt) => apt.status === "مكتمل"
      );
      const revenue = completedAppts.reduce((sum, apt) => {
        const price = parsePrice(apt.servicePrice || apt.price);
        return sum + price;
      }, 0);
      return {
        ...staffMember,
        appointmentCount: staffAppointments.length,
        completedCount: completedAppts.length,
        revenue: revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  // Customer statistics
  const customerStats = customers
    .map((customer) => {
      const customerAppointments = filteredAppointments.filter(
        (apt) => apt.customerId === customer.id
      );
      const customerOrders = filteredOrders.filter(
        (order) => order.userId === customer.id
      );
      const totalSpent =
        customerAppointments
          .filter((apt) => apt.status === "مكتمل")
          .reduce((sum, apt) => {
            const price = parsePrice(apt.servicePrice || apt.price);
            return sum + price;
          }, 0) +
        customerOrders
          .filter((order) => order.status === "confirmed")
          .reduce((sum, order) => sum + parsePrice(order.total), 0);

      return {
        ...customer,
        appointmentCount: customerAppointments.length,
        orderCount: customerOrders.length,
        totalSpent: totalSpent,
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);

  // Monthly revenue data (last 12 months)
  const getMonthlyRevenue = () => {
    const months = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      const monthStart = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      const monthAppointments = appointments.filter((apt) => {
        if (apt.status !== "مكتمل") return false;
        const aptDate = apt.createdAt?.seconds
          ? new Date(apt.createdAt.seconds * 1000)
          : new Date(apt.createdAt);
        return aptDate >= monthStart && aptDate <= monthEnd;
      });

      const monthOrders = orders.filter((order) => {
        if (order.status !== "confirmed") return false;
        const orderDate = order.createdAt?.seconds
          ? new Date(order.createdAt.seconds * 1000)
          : new Date(order.createdAt);
        return orderDate >= monthStart && orderDate <= monthEnd;
      });

      const revenue =
        monthAppointments.reduce(
          (sum, apt) => sum + parsePrice(apt.servicePrice || apt.price),
          0
        ) +
        monthOrders.reduce((sum, order) => sum + parsePrice(order.total), 0);

      months.push({
        month: monthName,
        revenue: revenue,
        appointmentCount: monthAppointments.length,
        orderCount: monthOrders.length,
      });
    }

    return months;
  };

  const monthlyRevenue = getMonthlyRevenue();

  if (loading) {
    return (
      <div className="reports-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>جاري تحميل التقارير...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* Page Header */}
      <section className="reports-header">
        <div className="container">
          <div className="header-content">
            <button className="btn-primary" onClick={() => window.print()}>
              <i className="fas fa-print"></i>
              طباعة التقرير
            </button>
          </div>
        </div>
      </section>

      {/* Date Range Filter */}
      <section className="date-filter-section">
        <div className="container">
          <div className="date-filter-card">
            <h3>
              <i className="fas fa-calendar-alt"></i>
              فترة التقرير
            </h3>
            <div className="filter-options">
              <button
                className={`filter-btn ${dateRange === "all" ? "active" : ""}`}
                onClick={() => setDateRange("all")}
              >
                الكل
              </button>
              <button
                className={`filter-btn ${
                  dateRange === "today" ? "active" : ""
                }`}
                onClick={() => setDateRange("today")}
              >
                اليوم
              </button>
              <button
                className={`filter-btn ${dateRange === "week" ? "active" : ""}`}
                onClick={() => setDateRange("week")}
              >
                آخر 7 أيام
              </button>
              <button
                className={`filter-btn ${
                  dateRange === "month" ? "active" : ""
                }`}
                onClick={() => setDateRange("month")}
              >
                آخر شهر
              </button>
              <button
                className={`filter-btn ${dateRange === "year" ? "active" : ""}`}
                onClick={() => setDateRange("year")}
              >
                آخر سنة
              </button>
              <button
                className={`filter-btn ${
                  dateRange === "custom" ? "active" : ""
                }`}
                onClick={() => setDateRange("custom")}
              >
                فترة مخصصة
              </button>
            </div>

            {dateRange === "custom" && (
              <div className="custom-date-inputs">
                <div className="date-input-group">
                  <label>من تاريخ:</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div className="date-input-group">
                  <label>إلى تاريخ:</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Report Navigation */}
      <section className="report-navigation">
        <div className="container">
          <div className="report-tabs">
            <button
              className={`report-tab ${
                activeReport === "overview" ? "active" : ""
              }`}
              onClick={() => setActiveReport("overview")}
            >
              <i className="fas fa-chart-line"></i>
              نظرة عامة
            </button>
            <button
              className={`report-tab ${
                activeReport === "revenue" ? "active" : ""
              }`}
              onClick={() => setActiveReport("revenue")}
            >
              <i className="fas fa-dollar-sign"></i>
              الإيرادات
            </button>
            <button
              className={`report-tab ${
                activeReport === "services" ? "active" : ""
              }`}
              onClick={() => setActiveReport("services")}
            >
              <i className="fas fa-spa"></i>
              الخدمات
            </button>
            <button
              className={`report-tab ${
                activeReport === "products" ? "active" : ""
              }`}
              onClick={() => setActiveReport("products")}
            >
              <i className="fas fa-box"></i>
              المنتجات
            </button>
            <button
              className={`report-tab ${
                activeReport === "staff" ? "active" : ""
              }`}
              onClick={() => setActiveReport("staff")}
            >
              <i className="fas fa-users"></i>
              الموظفين
            </button>
            <button
              className={`report-tab ${
                activeReport === "customers" ? "active" : ""
              }`}
              onClick={() => setActiveReport("customers")}
            >
              <i className="fas fa-user-friends"></i>
              العملاء
            </button>
          </div>
        </div>
      </section>

      {/* Overview Report */}
      {activeReport === "overview" && (
        <section className="report-content">
          <div className="container">
            <h2>نظرة عامة</h2>

            {/* Summary Cards */}
            <div className="summary-grid">
              <div className="summary-card revenue">
                <div className="card-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="card-info">
                  <h3>إجمالي الإيرادات</h3>
                  <p className="amount">{totalRevenue.toFixed(2)} شيكل</p>
                  <span className="sub-text">
                    مواعيد: {appointmentRevenue.toFixed(2)} | طلبات:{" "}
                    {ordersRevenue.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="summary-card appointments">
                <div className="card-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="card-info">
                  <h3>المواعيد</h3>
                  <p className="amount">{totalAppointments}</p>
                  <span className="sub-text">
                    مكتمل: {completedAppointments} | ملغي:{" "}
                    {cancelledAppointments}
                  </span>
                </div>
              </div>

              <div className="summary-card orders">
                <div className="card-icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="card-info">
                  <h3>الطلبات</h3>
                  <p className="amount">{totalOrders}</p>
                  <span className="sub-text">
                    مؤكد: {confirmedOrders} | قيد الانتظار: {pendingOrders}
                  </span>
                </div>
              </div>

              <div className="summary-card consultations">
                <div className="card-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <div className="card-info">
                  <h3>الاستشارات</h3>
                  <p className="amount">{totalConsultations}</p>
                  <span className="sub-text">استشارات مجانية</span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3>حالة المواعيد</h3>
                <div className="status-chart">
                  <div className="status-item">
                    <div className="status-bar-wrapper">
                      <div className="status-label">
                        <span>مكتمل</span>
                        <span className="status-value">
                          {completedAppointments}
                        </span>
                      </div>
                      <div className="status-bar">
                        <div
                          className="status-fill completed"
                          style={{
                            width: `${
                              (completedAppointments / totalAppointments) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-bar-wrapper">
                      <div className="status-label">
                        <span>مؤكد</span>
                        <span className="status-value">
                          {confirmedAppointments}
                        </span>
                      </div>
                      <div className="status-bar">
                        <div
                          className="status-fill confirmed"
                          style={{
                            width: `${
                              (confirmedAppointments / totalAppointments) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-bar-wrapper">
                      <div className="status-label">
                        <span>قيد الانتظار</span>
                        <span className="status-value">
                          {pendingAppointments}
                        </span>
                      </div>
                      <div className="status-bar">
                        <div
                          className="status-fill pending"
                          style={{
                            width: `${
                              (pendingAppointments / totalAppointments) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="status-item">
                    <div className="status-bar-wrapper">
                      <div className="status-label">
                        <span>ملغي</span>
                        <span className="status-value">
                          {cancelledAppointments}
                        </span>
                      </div>
                      <div className="status-bar">
                        <div
                          className="status-fill cancelled"
                          style={{
                            width: `${
                              (cancelledAppointments / totalAppointments) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <h3>أهم الخدمات (حسب الحجوزات)</h3>
                <div className="top-items-list">
                  {serviceStats.slice(0, 5).map((service, index) => (
                    <div key={service.id} className="top-item">
                      <span className="item-rank">#{index + 1}</span>
                      <span className="item-name">{service.name}</span>
                      <span className="item-value">
                        {service.appointmentCount} حجز
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Revenue Report */}
      {activeReport === "revenue" && (
        <section className="report-content">
          <div className="container">
            <h2>تقرير الإيرادات</h2>

            <div className="revenue-summary">
              <div className="revenue-card total">
                <h3>إجمالي الإيرادات</h3>
                <p className="revenue-amount">{totalRevenue.toFixed(2)} شيكل</p>
              </div>
              <div className="revenue-card appointments">
                <h3>إيرادات المواعيد</h3>
                <p className="revenue-amount">
                  {appointmentRevenue.toFixed(2)} شيكل
                </p>
                <span className="percentage">
                  {((appointmentRevenue / totalRevenue) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="revenue-card orders">
                <h3>إيرادات الطلبات</h3>
                <p className="revenue-amount">
                  {ordersRevenue.toFixed(2)} شيكل
                </p>
                <span className="percentage">
                  {((ordersRevenue / totalRevenue) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="chart-card full-width">
              <h3>الإيرادات الشهرية (آخر 12 شهر)</h3>
              <div className="monthly-revenue-chart">
                {monthlyRevenue.map((month, index) => {
                  const maxRevenue = Math.max(
                    ...monthlyRevenue.map((m) => m.revenue)
                  );
                  const height =
                    maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;

                  return (
                    <div key={index} className="month-bar">
                      <div className="bar-wrapper">
                        <div
                          className="bar-fill"
                          style={{ height: `${height}%` }}
                          title={`${month.revenue.toFixed(2)} شيكل`}
                        >
                          <span className="bar-value">
                            {month.revenue.toFixed(0)}
                          </span>
                        </div>
                      </div>
                      <div className="month-label">{month.month}</div>
                      <div className="month-details">
                        <small>
                          {month.appointmentCount + month.orderCount} عملية
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Report */}
      {activeReport === "services" && (
        <section className="report-content">
          <div className="container">
            <h2>تقرير الخدمات</h2>

            <div className="report-table-card">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>اسم الخدمة</th>
                    <th>عدد الحجوزات</th>
                    <th>الحجوزات المكتملة</th>
                    <th>الإيرادات</th>
                    <th>متوسط السعر</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceStats.map((service, index) => (
                    <tr key={service.id}>
                      <td>{index + 1}</td>
                      <td>{service.name}</td>
                      <td>{service.appointmentCount}</td>
                      <td>{service.completedCount}</td>
                      <td className="revenue-cell">
                        {service.revenue.toFixed(2)} شيكل
                      </td>
                      <td>
                        {service.completedCount > 0
                          ? (service.revenue / service.completedCount).toFixed(
                              2
                            )
                          : 0}{" "}
                        شيكل
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Products Report */}
      {activeReport === "products" && (
        <section className="report-content">
          <div className="container">
            <h2>تقرير المنتجات</h2>

            <div className="report-table-card">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>اسم المنتج</th>
                    <th>الكمية المباعة</th>
                    <th>الإيرادات</th>
                    <th>السعر</th>
                    <th>المخزون</th>
                  </tr>
                </thead>
                <tbody>
                  {productStats.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.totalSold}</td>
                      <td className="revenue-cell">
                        {product.revenue.toFixed(2)} شيكل
                      </td>
                      <td>{product.price}</td>
                      <td>
                        <span
                          className={`stock-status ${
                            product.inStock ? "in-stock" : "out-stock"
                          }`}
                        >
                          {product.inStock ? "متوفر" : "نفذ"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Staff Report */}
      {activeReport === "staff" && (
        <section className="report-content">
          <div className="container">
            <h2>تقرير أداء الموظفين</h2>

            <div className="report-table-card">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>اسم الموظف</th>
                    <th>عدد المواعيد</th>
                    <th>المواعيد المكتملة</th>
                    <th>نسبة الإنجاز</th>
                    <th>الإيرادات المحققة</th>
                  </tr>
                </thead>
                <tbody>
                  {staffStats.map((staffMember, index) => (
                    <tr key={staffMember.id}>
                      <td>{index + 1}</td>
                      <td>{staffMember.name}</td>
                      <td>{staffMember.appointmentCount}</td>
                      <td>{staffMember.completedCount}</td>
                      <td>
                        {staffMember.appointmentCount > 0
                          ? (
                              (staffMember.completedCount /
                                staffMember.appointmentCount) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </td>
                      <td className="revenue-cell">
                        {staffMember.revenue.toFixed(2)} شيكل
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Customers Report */}
      {activeReport === "customers" && (
        <section className="report-content">
          <div className="container">
            <h2>تقرير العملاء</h2>

            <div className="customers-summary">
              <div className="summary-stat">
                <h3>إجمالي العملاء</h3>
                <p>{customers.length}</p>
              </div>
              <div className="summary-stat">
                <h3>عملاء نشطين</h3>
                <p>
                  {
                    customerStats.filter(
                      (c) => c.appointmentCount > 0 || c.orderCount > 0
                    ).length
                  }
                </p>
              </div>
              <div className="summary-stat">
                <h3>متوسط الإنفاق</h3>
                <p>
                  {customerStats.length > 0
                    ? (
                        customerStats.reduce(
                          (sum, c) => sum + c.totalSpent,
                          0
                        ) / customerStats.filter((c) => c.totalSpent > 0).length
                      ).toFixed(2)
                    : 0}{" "}
                  شيكل
                </p>
              </div>
            </div>

            <div className="report-table-card">
              <h3>أفضل العملاء (حسب الإنفاق)</h3>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>اسم العميل</th>
                    <th>عدد المواعيد</th>
                    <th>عدد الطلبات</th>
                    <th>إجمالي الإنفاق</th>
                  </tr>
                </thead>
                <tbody>
                  {customerStats.slice(0, 20).map((customer, index) => (
                    <tr key={customer.id}>
                      <td>{index + 1}</td>
                      <td>{customer.name}</td>
                      <td>{customer.appointmentCount}</td>
                      <td>{customer.orderCount}</td>
                      <td className="revenue-cell">
                        {customer.totalSpent.toFixed(2)} شيكل
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ReportsPage;
