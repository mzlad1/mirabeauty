import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import {
  getAppointmentsByCustomer,
  cancelAppointment,
  updateAppointment,
  checkStaffAvailability,
} from "../services/appointmentsService";
import { updateUser, getUserById } from "../services/usersService";
import AppointmentEditModal from "../components/profile/AppointmentEditModal";
import { uploadSingleImage, deleteImage } from "../utils/imageUpload";
import CustomModal from "../components/common/CustomModal";
import { useModal } from "../hooks/useModal";

const ProfilePage = ({ currentUser, userData, setCurrentUser = () => {} }) => {
  const navigate = useNavigate();
  const { modalState, closeModal, showSuccess, showError, showWarning, showConfirm } = useModal();
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [completeUserData, setCompleteUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    address: "",
    skinType: "",
    allergies: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  // Helper function to parse price string to number
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    if (typeof priceString === "number") return priceString;
    // Extract numeric value from strings like "200 شيكل" or "200"
    const match = priceString.toString().match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // Helper function to format price display (avoid duplicate currency)
  const formatPrice = (priceString) => {
    if (!priceString) return "0 شيكل";
    const priceStr = priceString.toString();
    // If price already contains "شيكل", return as is
    if (priceStr.includes("شيكل")) {
      return priceStr;
    }
    // If it's just a number, add "شيكل"
    return `${priceStr} شيكل`;
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser?.uid) {
        setLoading(true);
        try {
          // Load complete user data from Firestore
          const userData = await getUserById(currentUser.uid);
          const mergedUserData = {
            ...currentUser,
            ...userData,
          };
          setCompleteUserData(mergedUserData);

          // Initialize edit form with complete data
          setEditData({
            name: userData?.name || currentUser?.displayName || "",
            phone: userData?.phone || "",
            address: userData?.address || "",
            skinType: userData?.skinType || "",
            allergies: userData?.allergies
              ? Array.isArray(userData.allergies)
                ? userData.allergies.join(", ")
                : userData.allergies
              : "",
          });

          // Load appointments
          const appointments = await getAppointmentsByCustomer(currentUser.uid);
          setUserAppointments(appointments);
        } catch (error) {
          console.error("Error loading user data:", error);
          setUserAppointments([]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser?.uid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSaveProfile = async () => {
    setSubmitting(true);
    try {
      const updatedUserData = {
        name: editData.name,
        phone: editData.phone,
        address: editData.address,
        skinType: editData.skinType,
        allergies: editData.allergies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await updateUser(currentUser.uid, updatedUserData);

      const updatedUser = {
        ...currentUser,
        ...updatedUserData,
      };

      const updatedCompleteData = {
        ...completeUserData,
        ...updatedUserData,
      };

      if (typeof setCurrentUser === "function") {
        setCurrentUser(updatedUser);
      }
      setCompleteUserData(updatedCompleteData);
      setEditMode(false);
      showSuccess("تم تحديث بياناتك بنجاح");
    } catch (error) {
      console.error("Error updating profile:", error);
      showError("حدث خطأ أثناء تحديث البيانات");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      name: completeUserData?.name || currentUser?.displayName || "",
      phone: completeUserData?.phone || "",
      address: completeUserData?.address || "",
      skinType: completeUserData?.skinType || "",
      allergies: completeUserData?.allergies
        ? Array.isArray(completeUserData.allergies)
          ? completeUserData.allergies.join(", ")
          : completeUserData.allergies
        : "",
    });
    setEditMode(false);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('يرجى اختيار ملف صورة صالح');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت');
      return;
    }

    setAvatarUploading(true);
    try {
      // Delete old avatar if exists (skip deletion for now to avoid complexity)
      // The old avatar will be overwritten by the new upload

      // Upload new avatar
      const avatarImageObject = await uploadSingleImage(file, 'avatars', currentUser.uid);
      const avatarUrl = avatarImageObject.url;
      
      // Update user data with new avatar
      await updateUser(currentUser.uid, { avatar: avatarUrl });

      // Update local state
      const updatedCompleteData = {
        ...completeUserData,
        avatar: avatarUrl,
      };
      setCompleteUserData(updatedCompleteData);

      // Update current user if setCurrentUser is available
      if (typeof setCurrentUser === "function") {
        setCurrentUser({
          ...currentUser,
          avatar: avatarUrl,
        });
      }

      showSuccess('تم تحديث صورة الملف الشخصي بنجاح');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showError('حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى');
    } finally {
      setAvatarUploading(false);
      // Reset file input
      event.target.value = '';
    }
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

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    showConfirm(
      "تأكيد الإلغاء",
      "هل أنت متأكدة من إلغاء هذا الموعد؟",
      async () => {
        try {
          await cancelAppointment(appointmentId, "إلغاء من قبل العميل");
          // Reload appointments
          const appointments = await getAppointmentsByCustomer(currentUser.uid);
          setUserAppointments(appointments);
          showSuccess("تم إلغاء الموعد بنجاح");
        } catch (error) {
          console.error("Error cancelling appointment:", error);
          showError("حدث خطأ أثناء إلغاء الموعد");
        }
      }
    );
  };

  // Handle appointment edit - open edit modal
  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setIsEditModalOpen(true);
  };

  // Handle appointment edit submission
  const handleAppointmentEditSubmit = async (updatedData) => {
    try {
      // Check if the new date/time is available for the staff member
      const isAvailable = await checkStaffAvailability(
        editingAppointment.staffId,
        updatedData.date,
        updatedData.time
      );

      if (!isAvailable) {
        showError("عذراً، الموعد المختار محجوز بالفعل. يرجى اختيار موعد آخر.");
        return;
      }

      // Update the appointment
      await updateAppointment(editingAppointment.id, {
        date: updatedData.date,
        time: updatedData.time,
        notes: updatedData.notes,
        status: "في الانتظار", // Reset to pending after edit
      });

      // Reload appointments
      const appointments = await getAppointmentsByCustomer(currentUser.uid);
      setUserAppointments(appointments);

      setIsEditModalOpen(false);
      setEditingAppointment(null);
      showSuccess("تم تعديل الموعد بنجاح. سيتم مراجعته والتواصل معك للتأكيد.");
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  };

  const upcomingAppointments = userAppointments.filter(
    (apt) => apt.status === "مؤكد" || apt.status === "في الانتظار"
  );

  const pastAppointments = userAppointments.filter(
    (apt) => apt.status === "مكتمل"
  );

  const totalSpent = pastAppointments.reduce((sum, apt) => {
    const price = parsePrice(apt.servicePrice || apt.price);
    return sum + price;
  }, 0);
  const loyaltyPoints = Math.floor(totalSpent / 10);

  if (loading || !completeUserData) {
    return (
      <div className="profile-page">
        <section className="loading-section section">
          <div className="container">
            <div className="loading-card">
              <div className="loading-spinner"></div>
              <p>جاري تحميل البيانات...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

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
                  <img
                    src={
                      completeUserData.avatar || "/assets/default-avatar.jpg"
                    }
                    alt={completeUserData.name}
                    onError={(e) => {
                      e.target.src = "/assets/default-avatar.jpg";
                    }}
                  />
                  <div className="avatar-upload-overlay">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      style={{ display: 'none' }}
                      disabled={avatarUploading}
                    />
                    <label 
                      htmlFor="avatar-upload" 
                      className={`avatar-upload-btn ${avatarUploading ? 'uploading' : ''}`}
                      title="تغيير صورة الملف الشخصي"
                    >
                      {avatarUploading ? (
                        <span className="upload-spinner"><i className="fas fa-spinner fa-spin"></i></span>
                      ) : (
                        <span className="upload-icon"><i className="fas fa-camera"></i></span>
                      )}
                    </label>
                  </div>
                </div>
                <h3>{completeUserData.name}</h3>
                <p>{completeUserData.email}</p>
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
                  مواعيدي
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "history" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  <i className="nav-icon fas fa-history"></i>
                  سجل الجلسات
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "settings" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  <i className="nav-icon fas fa-cog"></i>
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
                      <i className="stat-icon fas fa-calendar-check"></i>
                      <div className="stat-info">
                        <h3>{upcomingAppointments.length}</h3>
                        <p>مواعيد قادمة</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <i className="stat-icon fas fa-check-circle"></i>
                      <div className="stat-info">
                        <h3>{pastAppointments.length}</h3>
                        <p>جلسات مكتملة</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <i className="stat-icon fas fa-award"></i>
                      <div className="stat-info">
                        <h3>{loyaltyPoints}</h3>
                        <p>نقاط الولاء</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <i className="stat-icon fas fa-wallet"></i>
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
                              <i className="fas fa-calendar"></i>{" "}
                              {upcomingAppointments[0].date}
                            </span>
                            <span className="time">
                              <i className="fas fa-clock"></i>{" "}
                              {upcomingAppointments[0].time}
                            </span>
                          </div>
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
                                {appointment.serviceDuration ||
                                  appointment.duration}{" "}
                                دقيقة
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="label">السعر:</span>
                              <span className="value">
                                {formatPrice(appointment.servicePrice || appointment.price)}
                              </span>
                            </div>
                            {appointment.customerNote && (
                              <div className="detail-row">
                                <span className="label">ملاحظات:</span>
                                <span className="value">
                                  {appointment.customerNote}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="appointment-actions">
                            <button
                              className="action-btn cancel"
                              onClick={() =>
                                handleCancelAppointment(appointment.id)
                              }
                            >
                              إلغاء
                            </button>
                            <button
                              className="action-btn edit"
                              onClick={() => handleEditAppointment(appointment)}
                            >
                              تعديل
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <h3>لا توجد مواعيد قادمة</h3>
                      <p>احجزي موعدك القادم الآن</p>
                      <button
                        className="btn-primary"
                        onClick={() => navigate("/book")}
                      >
                        احجزي موعد
                      </button>
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
                            <p>
                              السعر:{" "}
                              {appointment.servicePrice || appointment.price}{" "}
                              شيكل
                            </p>
                            {appointment.rating && (
                              <div className="rating">
                                <span>التقييم: </span>
                                {Array.from(
                                  { length: appointment.rating },
                                  (_, i) => (
                                    <i
                                      key={i}
                                      className="fas fa-star"
                                      style={{ color: "var(--gold)" }}
                                    ></i>
                                  )
                                )}
                              </div>
                            )}
                            {appointment.feedback && (
                              <p className="feedback">
                                "{appointment.feedback}"
                              </p>
                            )}
                            {appointment.customerNote && (
                              <div className="customer-notes">
                                <strong>ملاحظات الجلسة:</strong>
                                <p>{appointment.customerNote}</p>
                              </div>
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
                    <div className="profile-section-header">
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
                            disabled={submitting}
                          >
                            {submitting ? "جاري الحفظ..." : "حفظ"}
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
                          <p className="form-value">
                            {completeUserData?.name || "غير محدد"}
                          </p>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">البريد الإلكتروني</label>
                        <p className="form-value">{completeUserData.email}</p>
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
                          <p className="form-value">
                            {completeUserData?.phone || "غير محدد"}
                          </p>
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
                            {completeUserData?.address || "غير محدد"}
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
                            {completeUserData?.skinType || "غير محدد"}
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
                            {completeUserData?.allergies
                              ? Array.isArray(completeUserData.allergies)
                                ? completeUserData.allergies.join(", ")
                                : completeUserData.allergies
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

      {/* Appointment Edit Modal */}
      <AppointmentEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAppointment(null);
        }}
        onSubmit={handleAppointmentEditSubmit}
        appointment={editingAppointment}
      />
      
      <CustomModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
        onClose={closeModal}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancel={modalState.showCancel}
      />
    </div>
  );
};

export default ProfilePage;
