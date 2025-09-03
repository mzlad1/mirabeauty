import React from "react";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { adminData } from "../../data/arabicData";
import "./Dashboard.css";

const Dashboard = () => {
  const stats = adminData.stats;

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>لوحة التحكم</h1>
          <p>نظرة عامة على أداء المركز والإحصائيات</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <LuxuryCard className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>الحجوزات هذا الأسبوع</h3>
              <div className="stat-number">{stats.weeklyBookings}</div>
              <div className="stat-change positive">+12% من الأسبوع الماضي</div>
            </div>
          </LuxuryCard>

          <LuxuryCard className="stat-card">
            <div className="stat-icon">🏠</div>
            <div className="stat-content">
              <h3>معدل إشغال الغرف</h3>
              <div className="stat-number">{stats.roomOccupancy}%</div>
              <div className="stat-change positive">+5% من الشهر الماضي</div>
            </div>
          </LuxuryCard>

          <LuxuryCard className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>متوسط التقييم</h3>
              <div className="stat-number">{stats.averageRating}</div>
              <div className="stat-change positive">ممتاز</div>
            </div>
          </LuxuryCard>

          <LuxuryCard className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h3>الخدمة الأكثر طلباً</h3>
              <div className="stat-service">{stats.topService}</div>
              <div className="stat-change neutral">خدمة شائعة</div>
            </div>
          </LuxuryCard>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="charts-grid">
            <LuxuryCard className="chart-card">
              <h3>إحصائيات الحجوزات</h3>
              <div className="chart-placeholder">
                <div className="chart-bars">
                  <div className="bar" style={{ height: "60%" }}></div>
                  <div className="bar" style={{ height: "80%" }}></div>
                  <div className="bar" style={{ height: "45%" }}></div>
                  <div className="bar" style={{ height: "90%" }}></div>
                  <div className="bar" style={{ height: "70%" }}></div>
                  <div className="bar" style={{ height: "85%" }}></div>
                  <div className="bar" style={{ height: "75%" }}></div>
                </div>
                <div className="chart-labels">
                  <span>السبت</span>
                  <span>الأحد</span>
                  <span>الاثنين</span>
                  <span>الثلاثاء</span>
                  <span>الأربعاء</span>
                  <span>الخميس</span>
                  <span>الجمعة</span>
                </div>
              </div>
            </LuxuryCard>

            <LuxuryCard className="chart-card">
              <h3>توزيع الخدمات</h3>
              <div className="chart-placeholder">
                <div className="pie-chart">
                  <div
                    className="pie-slice laser"
                    style={{ "--percentage": "45%" }}
                  ></div>
                  <div
                    className="pie-slice skincare"
                    style={{ "--percentage": "35%" }}
                  ></div>
                  <div
                    className="pie-slice vip"
                    style={{ "--percentage": "20%" }}
                  ></div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color laser"></span>
                    <span>الليزر (45%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color skincare"></span>
                    <span>العناية بالبشرة (35%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color vip"></span>
                    <span>VIP (20%)</span>
                  </div>
                </div>
              </div>
            </LuxuryCard>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <LuxuryCard className="activity-card">
            <h3>النشاط الأخير</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">✅</div>
                <div className="activity-content">
                  <p>تم إكمال جلسة "إزالة الشعر بالليزر" للعميلة فاطمة أحمد</p>
                  <span className="activity-time">منذ 10 دقائق</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📅</div>
                <div className="activity-content">
                  <p>حجز جديد: "التقشير الكيميائي" للعميلة نورا السعد</p>
                  <span className="activity-time">منذ 30 دقيقة</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">⭐</div>
                <div className="activity-content">
                  <p>تقييم جديد 5 نجوم من العميلة ريم محمد</p>
                  <span className="activity-time">منذ ساعة</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">💬</div>
                <div className="activity-content">
                  <p>رسالة جديدة عبر واتساب من عميلة محتملة</p>
                  <span className="activity-time">منذ ساعتين</span>
                </div>
              </div>
            </div>
          </LuxuryCard>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>إجراءات سريعة</h2>
          <div className="actions-grid">
            <LuxuryCard className="action-card">
              <div className="action-icon">📅</div>
              <h3>إدارة الحجوزات</h3>
              <p>عرض وإدارة جميع الحجوزات</p>
              <Button variant="primary" size="sm">
                عرض الحجوزات
              </Button>
            </LuxuryCard>

            <LuxuryCard className="action-card">
              <div className="action-icon">👥</div>
              <h3>إدارة الموظفين</h3>
              <p>عرض وإدارة جدول الموظفين</p>
              <Button variant="primary" size="sm">
                عرض الموظفين
              </Button>
            </LuxuryCard>

            <LuxuryCard className="action-card">
              <div className="action-icon">🏠</div>
              <h3>إدارة الغرف</h3>
              <p>عرض حالة الغرف والمواعيد</p>
              <Button variant="primary" size="sm">
                عرض الغرف
              </Button>
            </LuxuryCard>

            <LuxuryCard className="action-card">
              <div className="action-icon">⭐</div>
              <h3>التقييمات</h3>
              <p>مراجعة وتدقيق التقييمات</p>
              <Button variant="primary" size="sm">
                عرض التقييمات
              </Button>
            </LuxuryCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
