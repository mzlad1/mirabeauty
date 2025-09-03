import React, { useState } from "react";
import LuxuryCard from "../../components/LuxuryCard";
import Button from "../../components/Button";
import { userData } from "../../data/arabicData";
import "./History.css";

const History = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSession, setSelectedSession] = useState(null);

  // Combine all sessions for demo
  const allSessions = [
    ...userData.upcomingSessions.map((s) => ({ ...s, type: "upcoming" })),
    ...userData.recentSessions.map((s) => ({ ...s, type: "recent" })),
    // Add more demo sessions
    {
      id: 4,
      service: "إزالة الشعر بالليزر - الإبطين",
      date: "2024-11-20",
      status: "مكتملة",
      rating: 5,
      type: "recent",
      section: "ليزر",
      time: "3:00 م",
      note: "نتائج ممتازة، لا توجد آثار جانبية",
    },
    {
      id: 5,
      service: "التقشير الكيميائي",
      date: "2024-11-15",
      status: "مكتملة",
      rating: 4,
      type: "recent",
      section: "عناية بالبشرة",
      time: "2:30 م",
      note: "بشرة ناعمة ومشرقة",
    },
  ];

  const filters = [
    { id: "all", label: "جميع الجلسات" },
    { id: "ليزر", label: "الليزر" },
    { id: "عناية بالبشرة", label: "العناية بالبشرة" },
    { id: "VIP", label: "VIP" },
    { id: "مكتملة", label: "مكتملة" },
    { id: "ملغية", label: "ملغية" },
  ];

  const filteredSessions =
    selectedFilter === "all"
      ? allSessions
      : allSessions.filter(
          (session) =>
            session.section === selectedFilter ||
            session.status === selectedFilter
        );

  const openSessionModal = (session) => {
    setSelectedSession(session);
  };

  const closeSessionModal = () => {
    setSelectedSession(null);
  };

  return (
    <div className="history-page">
      {/* Filters */}
      <div className="history-filters">
        <h2>سجل الجلسات</h2>
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-tab ${
                selectedFilter === filter.id ? "active" : ""
              }`}
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      <div className="sessions-list">
        {filteredSessions.map((session) => (
          <LuxuryCard key={session.id} className="session-item">
            <div className="session-main">
              <div className="session-info">
                <h3>{session.service}</h3>
                <div className="session-details">
                  <span className="session-date">📅 {session.date}</span>
                  {session.time && (
                    <span className="session-time">🕐 {session.time}</span>
                  )}
                  {session.section && (
                    <span className="session-section">
                      🏷️ {session.section}
                    </span>
                  )}
                </div>
                {session.note && <p className="session-note">{session.note}</p>}
              </div>
              <div className="session-status">
                <span
                  className={`status-badge ${
                    session.status === "مكتملة"
                      ? "completed"
                      : session.status === "مؤكدة"
                      ? "confirmed"
                      : "cancelled"
                  }`}
                >
                  {session.status}
                </span>
                {session.rating && (
                  <div className="session-rating">
                    {"⭐".repeat(session.rating)}
                  </div>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openSessionModal(session)}
                >
                  عرض التفاصيل
                </Button>
              </div>
            </div>
          </LuxuryCard>
        ))}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="modal-overlay" onClick={closeSessionModal}>
          <LuxuryCard
            className="session-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>تفاصيل الجلسة</h3>
              <button className="close-btn" onClick={closeSessionModal}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="modal-section">
                <h4>معلومات الجلسة</h4>
                <div className="modal-details">
                  <div className="detail-item">
                    <span className="label">الخدمة:</span>
                    <span className="value">{selectedSession.service}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">التاريخ:</span>
                    <span className="value">{selectedSession.date}</span>
                  </div>
                  {selectedSession.time && (
                    <div className="detail-item">
                      <span className="label">الوقت:</span>
                      <span className="value">{selectedSession.time}</span>
                    </div>
                  )}
                  {selectedSession.section && (
                    <div className="detail-item">
                      <span className="label">القسم:</span>
                      <span className="value">{selectedSession.section}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="label">الحالة:</span>
                    <span
                      className={`value status-badge ${
                        selectedSession.status === "مكتملة"
                          ? "completed"
                          : selectedSession.status === "مؤكدة"
                          ? "confirmed"
                          : "cancelled"
                      }`}
                    >
                      {selectedSession.status}
                    </span>
                  </div>
                  {selectedSession.rating && (
                    <div className="detail-item">
                      <span className="label">التقييم:</span>
                      <span className="value">
                        <div className="session-rating">
                          {"⭐".repeat(selectedSession.rating)}
                        </div>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {selectedSession.note && (
                <div className="modal-section">
                  <h4>ملاحظات</h4>
                  <p className="modal-note">{selectedSession.note}</p>
                </div>
              )}

              <div className="modal-actions">
                <Button variant="secondary" onClick={closeSessionModal}>
                  إغلاق
                </Button>
                {selectedSession.status === "مكتملة" && (
                  <Button variant="primary">إضافة تقييم</Button>
                )}
              </div>
            </div>
          </LuxuryCard>
        </div>
      )}

      {/* Empty State */}
      {filteredSessions.length === 0 && (
        <div className="empty-state">
          <LuxuryCard className="empty-card">
            <div className="empty-icon">📋</div>
            <h3>لا توجد جلسات</h3>
            <p>لم يتم العثور على جلسات تطابق الفلتر المحدد</p>
            <Button variant="primary" onClick={() => setSelectedFilter("all")}>
              عرض جميع الجلسات
            </Button>
          </LuxuryCard>
        </div>
      )}
    </div>
  );
};

export default History;
