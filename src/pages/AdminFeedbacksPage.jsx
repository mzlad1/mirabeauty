import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminFeedbacksPage.css";
import {
  getAllFeedbacks,
  approveFeedback,
  rejectFeedback,
  toggleFeedbackVisibility,
  deleteFeedback,
  getFeedbackStats,
  FEEDBACK_TYPES,
  FEEDBACK_STATUS,
} from "../services/feedbackService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CustomAlert from "../components/common/CustomAlert";

const AdminFeedbacksPage = ({ currentUser, userData }) => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
    onConfirm: () => {},
  });
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [typeFilter, setTypeFilter] = useState("all"); // all, general, product
  const [searchTerm, setSearchTerm] = useState("");

  // Check if user is admin
  useEffect(() => {
    if (!currentUser || !userData || userData.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, userData, navigate]);

  // Load feedbacks
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [feedbacksData, statsData] = await Promise.all([
        getAllFeedbacks(),
        getFeedbackStats(),
      ]);
      setFeedbacks(feedbacksData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (feedbackId, isVisible = true) => {
    try {
      await approveFeedback(feedbackId, isVisible);
      await loadData();
    } catch (error) {
      console.error("Error approving feedback:", error);
      setAlert({
        isOpen: true,
        title: "خطأ",
        message: "حدث خطأ أثناء الموافقة على التقييم",
        type: "danger",
        onConfirm: () => {},
      });
    }
  };

  const handleReject = async (feedbackId) => {
    setAlert({
      isOpen: true,
      title: "تأكيد الرفض",
      message: "هل أنت متأكد من رفض هذا التقييم؟",
      type: "warning",
      onConfirm: async () => {
        try {
          await rejectFeedback(feedbackId);
          await loadData();
        } catch (error) {
          console.error("Error rejecting feedback:", error);
          setAlert({
            isOpen: true,
            title: "خطأ",
            message: "حدث خطأ أثناء رفض التقييم",
            type: "danger",
            onConfirm: () => {},
          });
        }
      },
    });
  };

  const handleToggleVisibility = async (feedbackId, currentVisibility) => {
    try {
      await toggleFeedbackVisibility(feedbackId, !currentVisibility);
      await loadData();
    } catch (error) {
      console.error("Error toggling visibility:", error);
      setAlert({
        isOpen: true,
        title: "خطأ",
        message: "حدث خطأ أثناء تغيير حالة الظهور",
        type: "danger",
        onConfirm: () => {},
      });
    }
  };

  const handleDelete = async (feedbackId) => {
    setAlert({
      isOpen: true,
      title: "تأكيد الحذف",
      message:
        "هل أنت متأكد من حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء.",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteFeedback(feedbackId);
          await loadData();
        } catch (error) {
          console.error("Error deleting feedback:", error);
          setAlert({
            isOpen: true,
            title: "خطأ",
            message: "حدث خطأ أثناء حذف التقييم",
            type: "danger",
            onConfirm: () => {},
          });
        }
      },
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case FEEDBACK_STATUS.PENDING:
        return <span className="status-badge pending">قيد المراجعة</span>;
      case FEEDBACK_STATUS.APPROVED:
        return <span className="status-badge approved">موافق عليه</span>;
      case FEEDBACK_STATUS.REJECTED:
        return <span className="status-badge rejected">مرفوض</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type) => {
    return type === FEEDBACK_TYPES.GENERAL ? (
      <span className="type-badge general">عام</span>
    ) : (
      <span className="type-badge product">منتج</span>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    // Status filter
    if (filter !== "all" && feedback.status !== filter) return false;

    // Type filter
    if (typeFilter !== "all" && feedback.type !== typeFilter) return false;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        feedback.name?.toLowerCase().includes(search) ||
        feedback.text?.toLowerCase().includes(search) ||
        feedback.service?.toLowerCase().includes(search) ||
        feedback.productName?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="admin-feedbacks-page">
        <div className="admin-feedbacks-loading">
          <LoadingSpinner />
          <p>جاري تحميل التقييمات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-feedbacks-page">
      <div className="admin-feedbacks-container">
        {/* Header */}
        {/* <div className="admin-feedbacks-header">
          <div className="header-content">
            <h1>
              <i className="fas fa-comments"></i>
              إدارة التقييمات
            </h1>
            <p>إدارة آراء العملاء والتقييمات</p>
          </div>
        </div> */}

        {/* Statistics */}
        {stats && (
          <div className="feedbacks-stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">
                <i className="fas fa-comments" style={{ color: "white" }}></i>
              </div>
              <div className="stat-info">
                <h3>إجمالي التقييمات</h3>
                <p className="stat-number">{stats.total}</p>
              </div>
            </div>

            <div className="stat-card pending">
              <div className="stat-icon">
                <i className="fas fa-clock" style={{ color: "white" }}></i>
              </div>
              <div className="stat-info">
                <h3>قيد المراجعة</h3>
                <p className="stat-number">{stats.pending}</p>
              </div>
            </div>

            <div className="stat-card approved">
              <div className="stat-icon">
                <i
                  className="fas fa-check-circle"
                  style={{ color: "white" }}
                ></i>
              </div>
              <div className="stat-info">
                <h3>موافق عليها</h3>
                <p className="stat-number">{stats.approved}</p>
              </div>
            </div>

            <div className="stat-card visible">
              <div className="stat-icon">
                <i className="fas fa-eye" style={{ color: "white" }}></i>
              </div>
              <div className="stat-info">
                <h3>ظاهرة</h3>
                <p className="stat-number">{stats.visible}</p>
              </div>
            </div>

            <div className="stat-card hidden">
              <div className="stat-icon">
                <i className="fas fa-eye-slash" style={{ color: "white" }}></i>
              </div>
              <div className="stat-info">
                <h3>مخفية</h3>
                <p className="stat-number">{stats.hidden}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="feedbacks-filters">
          <div className="filter-group">
            <label>الحالة:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                الكل ({feedbacks.length})
              </button>
              <button
                className={`filter-btn ${
                  filter === FEEDBACK_STATUS.PENDING ? "active" : ""
                }`}
                onClick={() => setFilter(FEEDBACK_STATUS.PENDING)}
              >
                قيد المراجعة ({stats?.pending || 0})
              </button>
              <button
                className={`filter-btn ${
                  filter === FEEDBACK_STATUS.APPROVED ? "active" : ""
                }`}
                onClick={() => setFilter(FEEDBACK_STATUS.APPROVED)}
              >
                موافق عليها ({stats?.approved || 0})
              </button>
              <button
                className={`filter-btn ${
                  filter === FEEDBACK_STATUS.REJECTED ? "active" : ""
                }`}
                onClick={() => setFilter(FEEDBACK_STATUS.REJECTED)}
              >
                مرفوضة ({stats?.rejected || 0})
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label>النوع:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${typeFilter === "all" ? "active" : ""}`}
                onClick={() => setTypeFilter("all")}
              >
                الكل
              </button>
              <button
                className={`filter-btn ${
                  typeFilter === FEEDBACK_TYPES.GENERAL ? "active" : ""
                }`}
                onClick={() => setTypeFilter(FEEDBACK_TYPES.GENERAL)}
              >
                عام ({stats?.general || 0})
              </button>
              <button
                className={`filter-btn ${
                  typeFilter === FEEDBACK_TYPES.PRODUCT ? "active" : ""
                }`}
                onClick={() => setTypeFilter(FEEDBACK_TYPES.PRODUCT)}
              >
                منتجات ({stats?.product || 0})
              </button>
            </div>
          </div>

          <div className="search-group">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="بحث في التقييمات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Feedbacks List */}
        <div className="feedbacks-list">
          {filteredFeedbacks.length === 0 ? (
            <div className="no-feedbacks">
              <i className="fas fa-inbox"></i>
              <p>لا توجد تقييمات</p>
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className="feedback-card">
                <div className="feedback-card-header">
                  <div className="feedback-user-info">
                    <div className="user-avatar">
                      {userData?.avatar ? (
                        <img
                          src={userData.avatar}
                          alt={`${feedback.name}'s avatar`}
                        />
                      ) : (
                        <span>{feedback.name?.charAt(0) || "؟"}</span>
                      )}
                    </div>
                    <div className="user-details">
                      <h4>{feedback.name}</h4>
                      {feedback.phone && (
                        <p className="feedback-phone">
                          <i className="fas fa-phone"></i>
                          {feedback.phone}
                        </p>
                      )}
                      <div className="feedback-meta">
                        {getTypeBadge(feedback.type)}
                        {getStatusBadge(feedback.status)}
                        {feedback.isVisible && (
                          <span className="visibility-badge visible">
                            <i className="fas fa-eye"></i> ظاهر
                          </span>
                        )}
                        {!feedback.isVisible && (
                          <span className="visibility-badge hidden">
                            <i className="fas fa-eye-slash"></i> مخفي
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="feedback-rating">
                    {Array.from({ length: feedback.rating }).map((_, i) => (
                      <i key={i} className="fa-solid fa-star" />
                    ))}
                  </div>
                </div>

                <div className="feedback-card-body">
                  {feedback.type === FEEDBACK_TYPES.GENERAL && (
                    <p className="feedback-service">
                      <i className="fas fa-tag"></i>
                      الخدمة: {feedback.service}
                    </p>
                  )}
                  {feedback.type === FEEDBACK_TYPES.PRODUCT && (
                    <p className="feedback-service">
                      <i className="fas fa-box"></i>
                      المنتج:{" "}
                      <Link
                        to={`/products/${feedback.productId}`}
                        className="product-link"
                      >
                        {feedback.productName}
                      </Link>
                    </p>
                  )}
                  <p className="feedback-text">"{feedback.text}"</p>
                  <p className="feedback-date">
                    <i className="far fa-clock"></i>
                    {formatDate(feedback.createdAt)}
                  </p>
                </div>

                <div className="feedback-card-actions">
                  {feedback.status === FEEDBACK_STATUS.PENDING && (
                    <>
                      <button
                        className="feedback-action-btn approve"
                        onClick={() => handleApprove(feedback.id, true)}
                        title="موافقة وإظهار"
                      >
                        <i className="fas fa-check"></i>
                        موافقة وإظهار
                      </button>
                      <button
                        className="feedback-action-btn approve-hidden"
                        onClick={() => handleApprove(feedback.id, false)}
                        title="موافقة وإخفاء"
                      >
                        <i className="fas fa-check"></i>
                        موافقة وإخفاء
                      </button>
                      <button
                        className="feedback-action-btn reject"
                        onClick={() => handleReject(feedback.id)}
                        title="رفض"
                      >
                        <i className="fas fa-times"></i>
                        رفض
                      </button>
                    </>
                  )}

                  {feedback.status === FEEDBACK_STATUS.APPROVED && (
                    <button
                      className="feedback-action-btn toggle-visibility"
                      onClick={() =>
                        handleToggleVisibility(feedback.id, feedback.isVisible)
                      }
                      title={feedback.isVisible ? "إخفاء" : "إظهار"}
                    >
                      <i
                        className={`fas fa-eye${
                          feedback.isVisible ? "-slash" : ""
                        }`}
                      ></i>
                      {feedback.isVisible ? "إخفاء" : "إظهار"}
                    </button>
                  )}

                  <button
                    className="feedback-action-btn delete"
                    onClick={() => handleDelete(feedback.id)}
                    title="حذف"
                  >
                    <i className="fas fa-trash"></i>
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        onConfirm={alert.onConfirm}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
};

export default AdminFeedbacksPage;
