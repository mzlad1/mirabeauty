import React from "react";
import { Link } from "react-router-dom";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { userData } from "../../data/arabicData";
import "./Overview.css";

const Overview = () => {
  return (
    <div className="overview-page">
      {/* Welcome Section */}
      <div className="welcome-section">
        <LuxuryCard className="welcome-card" gradient>
          <div className="welcome-content">
            <div className="welcome-text">
              <h2>مرحباً بكِ، {userData.name} 👋</h2>
              <p>
                عضو منذ {userData.memberSince} • {userData.totalSessions} جلسة
                مكتملة
              </p>
            </div>
            <div className="welcome-avatar">
              <div className="avatar-circle">{userData.name.charAt(0)}</div>
            </div>
          </div>
        </LuxuryCard>
      </div>

      {/* Upcoming Sessions */}
      <div className="upcoming-sessions">
        <h2>الجلسات القادمة</h2>
        <div className="sessions-grid">
          {userData.upcomingSessions.map((session) => (
            <LuxuryCard key={session.id} className="session-card">
              <div className="session-header">
                <h3>{session.service}</h3>
                <span
                  className={`status-badge ${
                    session.status === "مؤكدة" ? "confirmed" : "pending"
                  }`}
                >
                  {session.status}
                </span>
              </div>
              <div className="session-details">
                <div className="session-info">
                  <span className="info-icon">📅</span>
                  <span>{session.date}</span>
                </div>
                <div className="session-info">
                  <span className="info-icon">🕐</span>
                  <span>{session.time}</span>
                </div>
                <div className="session-info">
                  <span className="info-icon">🚪</span>
                  <span>{session.room}</span>
                </div>
              </div>
              <div className="session-actions">
                <Button variant="secondary" size="sm">
                  تعديل
                </Button>
                <Button variant="danger" size="sm">
                  إلغاء
                </Button>
              </div>
            </LuxuryCard>
          ))}
        </div>
        <div className="sessions-footer">
          <Link to="/booking">
            <Button variant="primary" size="lg">
              احجزي جلسة جديدة
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="recent-sessions">
        <h2>الجلسات الأخيرة</h2>
        <div className="sessions-list">
          {userData.recentSessions.map((session) => (
            <LuxuryCard key={session.id} className="recent-session-card">
              <div className="session-main">
                <div className="session-info">
                  <h4>{session.service}</h4>
                  <p>{session.date}</p>
                </div>
                <div className="session-status">
                  <span className={`status-badge completed`}>
                    {session.status}
                  </span>
                  <div className="session-rating">
                    {"⭐".repeat(session.rating)}
                  </div>
                </div>
              </div>
            </LuxuryCard>
          ))}
        </div>
        <div className="sessions-footer">
          <Link to="/account/history">
            <Button variant="secondary" size="lg">
              عرض السجل الكامل
            </Button>
          </Link>
        </div>
      </div>

      {/* Bundles/Offers */}
      {userData.bundles.length > 0 && (
        <div className="bundles-section">
          <h2>الباقات والعروض</h2>
          <div className="bundles-grid">
            {userData.bundles.map((bundle, index) => (
              <LuxuryCard
                key={index}
                className="bundle-card"
                badge={{ text: "نشطة", type: "success" }}
              >
                <div className="bundle-header">
                  <h3>{bundle.name}</h3>
                  <div className="bundle-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            ((bundle.totalSessions - bundle.remainingSessions) /
                              bundle.totalSessions) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {bundle.remainingSessions} من {bundle.totalSessions} جلسة
                      متبقية
                    </span>
                  </div>
                </div>
                <div className="bundle-details">
                  <p>تنتهي في: {bundle.expiresAt}</p>
                </div>
                <Button variant="primary" size="sm">
                  احجزي جلسة
                </Button>
              </LuxuryCard>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>إجراءات سريعة</h2>
        <div className="actions-grid">
          <Link to="/booking">
            <LuxuryCard className="action-card">
              <div className="action-icon">📅</div>
              <h3>احجزي جلسة</h3>
              <p>احجزي جلسة جديدة بسهولة</p>
            </LuxuryCard>
          </Link>

          <Link to="/account/feedback">
            <LuxuryCard className="action-card">
              <div className="action-icon">⭐</div>
              <h3>قيمي خدمتنا</h3>
              <p>شاركي تجربتك معنا</p>
            </LuxuryCard>
          </Link>

          <Link to="/account/settings">
            <LuxuryCard className="action-card">
              <div className="action-icon">⚙️</div>
              <h3>إعدادات الحساب</h3>
              <p>إدارة معلوماتك وتفضيلاتك</p>
            </LuxuryCard>
          </Link>

          <a href="https://wa.me/966501234567">
            <LuxuryCard className="action-card">
              <div className="action-icon">💬</div>
              <h3>تواصلي معنا</h3>
              <p>احصلي على مساعدة فورية</p>
            </LuxuryCard>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Overview;
