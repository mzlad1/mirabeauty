import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminUsersPage.css";
import { getAllUsers } from "../services/usersService";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AdminUsersPage = ({ currentUser, userData }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // all, customer, staff, admin

  // Check if user is admin
  useEffect(() => {
    if (!currentUser || !userData || userData.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, userData, navigate]);

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "غير متوفر";
    const date = timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <span className="role-badge admin">مدير</span>;
      case "staff":
        return <span className="role-badge staff">موظف</span>;
      case "customer":
        return <span className="role-badge customer">عميل</span>;
      default:
        return <span className="role-badge customer">عميل</span>;
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    // Role filter
    if (roleFilter !== "all" && user.role !== roleFilter) return false;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.phone?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  if (loading) {
    return (
      <div className="admin-users-page">
        <div className="admin-users-loading">
          <LoadingSpinner />
          <p>جاري تحميل المستخدمين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div className="admin-users-container">
        {/* Header */}
        {/* <div className="admin-users-header">
          <div className="header-content">
            <h1>
              <i className="fas fa-users"></i>
              إدارة المستخدمين
            </h1>
            <p>عرض وإدارة جميع مستخدمي النظام</p>
          </div>
        </div> */}

        {/* Statistics */}
        <div className="users-stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <i className="fas fa-users" style={{ color: "var(--white)" }}></i>
            </div>
            <div className="stat-info">
              <h3>إجمالي المستخدمين</h3>
              <p className="stat-number">{users.length}</p>
            </div>
          </div>

          <div className="stat-card customers">
            <div className="stat-icon">
              <i className="fas fa-user" style={{ color: "var(--white)" }}></i>
            </div>
            <div className="stat-info">
              <h3>العملاء</h3>
              <p className="stat-number">
                {users.filter((u) => u.role === "customer" || !u.role).length}
              </p>
            </div>
          </div>

          <div className="stat-card staff">
            <div className="stat-icon">
              <i className="fas fa-user-tie" style={{ color: "var(--white)" }}></i>
            </div>
            <div className="stat-info">
              <h3>الموظفين</h3>
              <p className="stat-number">
                {users.filter((u) => u.role === "staff").length}
              </p>
            </div>
          </div>

          <div className="stat-card admins">
            <div className="stat-icon">
              <i className="fas fa-user-shield" style={{ color: "var(--white)" }}></i>
            </div>
            <div className="stat-info">
              <h3>المدراء</h3>
              <p className="stat-number">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="users-filters">
          <div className="filter-group">
            <label>نوع المستخدم:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${roleFilter === "all" ? "active" : ""}`}
                onClick={() => setRoleFilter("all")}
              >
                الكل ({users.length})
              </button>
              <button
                className={`filter-btn ${
                  roleFilter === "customer" ? "active" : ""
                }`}
                onClick={() => setRoleFilter("customer")}
              >
                عملاء (
                {users.filter((u) => u.role === "customer" || !u.role).length})
              </button>
              <button
                className={`filter-btn ${
                  roleFilter === "staff" ? "active" : ""
                }`}
                onClick={() => setRoleFilter("staff")}
              >
                موظفين ({users.filter((u) => u.role === "staff").length})
              </button>
              <button
                className={`filter-btn ${
                  roleFilter === "admin" ? "active" : ""
                }`}
                onClick={() => setRoleFilter("admin")}
              >
                مدراء ({users.filter((u) => u.role === "admin").length})
              </button>
            </div>
          </div>

          <div className="user-search-group">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="بحث عن مستخدم (الاسم، البريد، الهاتف)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users List */}
        <div className="users-list">
          {filteredUsers.length === 0 ? (
            <div className="no-users">
              <i className="fas fa-user-slash"></i>
              <p>لا يوجد مستخدمين</p>
            </div>
          ) : (
            <div className="users-table-card">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الصورة</th>
                    <th>الاسم</th>
                    <th>البريد الإلكتروني</th>
                    <th>الهاتف</th>
                    <th>الدور</th>
                    <th>تاريخ التسجيل</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="user-avatar">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {user.name?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong>{user.name || "غير متوفر"}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone || "غير متوفر"}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <button
                          className="users-action-btn view"
                          onClick={() => handleViewUser(user.id)}
                          title="عرض التفاصيل"
                        >
                          <i className="fas fa-eye"></i>
                          عرض التفاصيل
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
