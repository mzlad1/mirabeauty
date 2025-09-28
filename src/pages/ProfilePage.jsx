import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { sampleAppointments } from "../data/sampleAppointments";

const ProfilePage = ({ currentUser, setCurrentUser }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);
  const [editData, setEditData] = useState({
    name: currentUser.name,
    phone: currentUser.phone,
    address: currentUser.address || "",
    skinType: currentUser.skinType || "",
    allergies: currentUser.allergies ? currentUser.allergies.join(", ") : "",
  });

  useEffect(() => {
    // Filter appointments for current user
    const appointments = sampleAppointments.filter(
      (appointment) => appointment.customerId === currentUser.id
    );
    setUserAppointments(appointments);
  }, [currentUser.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...currentUser,
      name: editData.name,
      phone: editData.phone,
      address: editData.address,
      skinType: editData.skinType,
      allergies: editData.allergies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    setCurrentUser(updatedUser);
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      name: currentUser.name,
      phone: currentUser.phone,
      address: currentUser.address || "",
      skinType: currentUser.skinType || "",
      allergies: currentUser.allergies ? currentUser.allergies.join(", ") : "",
    });
    setEditMode(false);
  };

  const getAppointmentStatusColor = (status) => {
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

  const upcomingAppointments = userAppointments.filter(
    (apt) => apt.status === "مؤكد" || apt.status === "في الانتظار"
  );

  const pastAppointments = userAppointments.filter(
    (apt) => apt.status === "مكتمل"
  );

  const totalSpent = pastAppointments.reduce((sum, apt) => sum + apt.price, 0);
  const loyaltyPoints = Math.floor(totalSpent / 10);

  return (
    <div className="profile-page">

      {/* Profile Content */}
      <section className="profile-content section">
        <div className="container">
          <div className="profile-layout">
            {/* Profile Sidebar */}
            <aside className="profile-sidebar">
              <div className="profile-card">
                <div className="profile-avatar">
                  <img src={currentUser.avatar} alt={currentUser.name} />
                </div>
                <h3>{currentUser.name}</h3>
                <p>{currentUser.email}</p>
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-number">
                      {userAppointments.length}
                    </span>
                    <span className="stat-label">جلسة</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{totalSpent}</span>
                    <span className="stat-label">شيكل</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{loyaltyPoints}</span>
                    <span className="stat-label">نقطة</span>
                  </div>
                </div>
              </div>

              <nav className="profile-nav">
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
                    activeTab === "appointments" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("appointments")}
                >
                  <span className="nav-icon">📅</span>
                  المواعيد
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "history" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  <span className="nav-icon">📋</span>
                  تاريخ العلاجات
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "settings" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  <span className="nav-icon">⚙️</span>
                  إعدادات الحساب
                </button>
              </nav>
            </aside>

            {/* Profile Main Content */}
            <main className="profile-main">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="tab-content">
                  <h2>نظرة عامة</h2>

                  {/* Quick Stats */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">📅</div>
                      <div className="stat-info">
                        <h3>{upcomingAppointments.length}</h3>
                        <p>مواعيد قادمة</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">✅</div>
                      <div className="stat-info">
                        <h3>{pastAppointments.length}</h3>
                        <p>جلسات مكتملة</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">⭐</div>
                      <div className="stat-info">
                        <h3>{loyaltyPoints}</h3>
                        <p>نقاط الولاء</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">💰</div>
                      <div className="stat-info">
                        <h3>{totalSpent} شيكل</h3>
                        <p>إجمالي المصروفات</p>
                      </div>
                    </div>
                  </div>

                  {/* Next Appointment */}
                  {upcomingAppointments.length > 0 && (
                    <div className="next-appointment">
                      <h3>الموعد القادم</h3>
                      <div className="appointment-card">
                        <div className="appointment-info">
                          <h4>{upcomingAppointments[0].serviceName}</h4>
                          <p>الأخصائية: {upcomingAppointments[0].staffName}</p>
                          <div className="appointment-meta">
                            <span className="date">
                              📅 {upcomingAppointments[0].date}
                            </span>
                            <span className="time">
                              🕐 {upcomingAppointments[0].time}
                            </span>
                          </div>
                        </div>
                        <div className="appointment-actions">
                          <button className="btn-secondary">تعديل</button>
                          <button className="btn-primary">تفاصيل</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loyalty Program */}
                  <div className="loyalty-section">
                    <h3>برنامج الولاء</h3>
                    <div className="loyalty-card">
                      <div className="loyalty-header">
                        <h4>نقاط الولاء</h4>
                        <span className="points">{loyaltyPoints} نقطة</span>
                      </div>
                      <div className="loyalty-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${loyaltyPoints % 100}%` }}
                          ></div>
                        </div>
                        <p>
                          {100 - (loyaltyPoints % 100)} نقطة للحصول على مكافأة
                        </p>
                      </div>
                      <div className="loyalty-benefits">
                        <div className="benefit">
                          <span className="benefit-points">50 نقطة</span>
                          <span className="benefit-reward">خصم 10%</span>
                        </div>
                        <div className="benefit">
                          <span className="benefit-points">100 نقطة</span>
                          <span className="benefit-reward">جلسة مجانية</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === "appointments" && (
                <div className="tab-content">
                  <h2>المواعيد القادمة</h2>

                  {upcomingAppointments.length > 0 ? (
                    <div className="appointments-list">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="appointment-item">
                          <div className="appointment-header">
                            <h4>{appointment.serviceName}</h4>
                            <span
                              className={`status ${getAppointmentStatusColor(
                                appointment.status
                              )}`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                          <div className="appointment-details">
                            <div className="detail-row">
                              <span className="label">الأخصائية:</span>
                              <span className="value">
                                {appointment.staffName}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="label">التاريخ:</span>
                              <span className="value">{appointment.date}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">الوقت:</span>
                              <span className="value">{appointment.time}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">المدة:</span>
                              <span className="value">
                                {appointment.duration} دقيقة
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="label">السعر:</span>
                              <span className="value">
                                {appointment.price} شيكل
                              </span>
                            </div>
                            {appointment.notes && (
                              <div className="detail-row">
                                <span className="label">ملاحظات:</span>
                                <span className="value">
                                  {appointment.notes}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="appointment-actions">
                            <button className="action-btn cancel">إلغاء</button>
                            <button className="action-btn edit">تعديل</button>
                            <button className="action-btn details">
                              تفاصيل
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <h3>لا توجد مواعيد قادمة</h3>
                      <p>احجزي موعدك القادم الآن</p>
                      <button className="btn-primary">احجزي موعد</button>
                    </div>
                  )}
                </div>
              )}

              {/* History Tab */}
              {activeTab === "history" && (
                <div className="tab-content">
                  <h2>تاريخ العلاجات</h2>

                  {pastAppointments.length > 0 ? (
                    <div className="history-list">
                      {pastAppointments.map((appointment) => (
                        <div key={appointment.id} className="history-item">
                          <div className="history-header">
                            <h4>{appointment.serviceName}</h4>
                            <span className="date">{appointment.date}</span>
                          </div>
                          <div className="history-details">
                            <p>الأخصائية: {appointment.staffName}</p>
                            <p>السعر: {appointment.price} شيكل</p>
                            {appointment.rating && (
                              <div className="rating">
                                <span>التقييم: </span>
                                {"⭐".repeat(appointment.rating)}
                              </div>
                            )}
                            {appointment.feedback && (
                              <p className="feedback">
                                "{appointment.feedback}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <h3>لا يوجد تاريخ علاجات بعد</h3>
                      <p>احجزي أول جلسة لك لبناء تاريخ علاجاتك</p>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="tab-content">
                  <h2>إعدادات الحساب</h2>

                  <div className="settings-section">
                    <div className="section-header">
                      <h3>المعلومات الشخصية</h3>
                      {!editMode ? (
                        <button
                          className="btn-secondary"
                          onClick={() => setEditMode(true)}
                        >
                          تعديل
                        </button>
                      ) : (
                        <div className="edit-actions">
                          <button
                            className="btn-secondary"
                            onClick={handleCancelEdit}
                          >
                            إلغاء
                          </button>
                          <button
                            className="btn-primary"
                            onClick={handleSaveProfile}
                          >
                            حفظ
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="settings-form">
                      <div className="form-group">
                        <label className="form-label">الاسم</label>
                        {editMode ? (
                          <input
                            type="text"
                            name="name"
                            value={editData.name}
                            onChange={handleInputChange}
                            className="form-input"
                          />
                        ) : (
                          <p className="form-value">{currentUser.name}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">البريد الإلكتروني</label>
                        <p className="form-value">{currentUser.email}</p>
                        <small>لا يمكن تغيير البريد الإلكتروني</small>
                      </div>

                      <div className="form-group">
                        <label className="form-label">رقم الهاتف</label>
                        {editMode ? (
                          <input
                            type="tel"
                            name="phone"
                            value={editData.phone}
                            onChange={handleInputChange}
                            className="form-input"
                          />
                        ) : (
                          <p className="form-value">{currentUser.phone}</p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">العنوان</label>
                        {editMode ? (
                          <input
                            type="text"
                            name="address"
                            value={editData.address}
                            onChange={handleInputChange}
                            className="form-input"
                          />
                        ) : (
                          <p className="form-value">
                            {currentUser.address || "غير محدد"}
                          </p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">نوع البشرة</label>
                        {editMode ? (
                          <select
                            name="skinType"
                            value={editData.skinType}
                            onChange={handleInputChange}
                            className="form-select"
                          >
                            <option value="">اختاري نوع البشرة</option>
                            <option value="normal">عادية</option>
                            <option value="dry">جافة</option>
                            <option value="oily">دهنية</option>
                            <option value="combination">مختلطة</option>
                            <option value="sensitive">حساسة</option>
                          </select>
                        ) : (
                          <p className="form-value">
                            {currentUser.skinType || "غير محدد"}
                          </p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">الحساسية</label>
                        {editMode ? (
                          <textarea
                            name="allergies"
                            value={editData.allergies}
                            onChange={handleInputChange}
                            className="form-textarea"
                            rows="3"
                          />
                        ) : (
                          <p className="form-value">
                            {currentUser.allergies
                              ? currentUser.allergies.join(", ")
                              : "لا توجد"}
                          </p>
                        )}
                      </div>
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

export default ProfilePage;
