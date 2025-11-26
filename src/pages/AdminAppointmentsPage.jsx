import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAppointmentsPage.css";
import {
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  confirmAppointment,
  completeAppointment,
  checkStaffAvailability,
  getAppointmentsByDate,
} from "../services/appointmentsService";
import { getStaff } from "../services/usersService";
import { getAllSpecializations } from "../services/specializationsService";
import { getAllServiceCategories } from "../services/categoriesService";
import AdminAppointmentEditModal from "../components/dashboard/AdminAppointmentEditModal";
import AppointmentDetailsModal from "../components/dashboard/AppointmentDetailsModal";
import AppointmentCompletionModal from "../components/dashboard/AppointmentCompletionModal";
import CustomModal from "../components/common/CustomModal";
import { useModal } from "../hooks/useModal";

const AdminAppointmentsPage = ({ currentUser, userData }) => {
  const navigate = useNavigate();

  // Handle navigate to customer profile
  const handleNavigateToCustomer = (customerId) => {
    if (customerId) {
      navigate(`/admin/users/${customerId}`);
    }
  };
  const {
    modalState,
    closeModal,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  } = useModal();

  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [appointmentToView, setAppointmentToView] = useState(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [appointmentToComplete, setAppointmentToComplete] = useState(null);

  // Load appointments, staff, and specializations
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, staffData, specializationsData, categoriesData] =
        await Promise.all([
          getAllAppointments(),
          getStaff(),
          getAllSpecializations(),
          getAllServiceCategories(),
        ]);
      setAppointments(appointmentsData);
      setStaff(staffData);
      setSpecializations(specializationsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const appointmentsData = await getAllAppointments();
      setAppointments(appointmentsData);
    } catch (err) {
      console.error("Error loading appointments:", err);
      setError("فشل في تحميل بيانات المواعيد");
    } finally {
      setLoading(false);
    }
  };

  const reloadAppointments = async () => {
    await loadAppointments();
  };

  // Get status color class
  const getStatusColor = (status) => {
    switch (status) {
      case "مؤكد":
        return "status-confirmed";
      case "في الانتظار":
        return "status-pending";
      case "مكتمل":
        return "status-completed";
      case "ملغي":
        return "status-cancelled";
      default:
        return "";
    }
  };

  // Filter appointments
  const getFilteredAppointments = () => {
    return appointments.filter((appointment) => {
      // Status filter
      if (statusFilter && appointment.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter && appointment.date !== dateFilter) {
        return false;
      }

      // Search filter (customer name, phone, service name, or staff name)
      if (searchFilter) {
        const searchLower = searchFilter.toLowerCase();
        const customerName = appointment.customerName?.toLowerCase() || "";
        const customerPhone = appointment.customerPhone?.toLowerCase() || "";
        const serviceName = appointment.serviceName?.toLowerCase() || "";
        const staffName = appointment.staffName?.toLowerCase() || "";

        if (
          !customerName.includes(searchLower) &&
          !customerPhone.includes(searchLower) &&
          !serviceName.includes(searchLower) &&
          !staffName.includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });
  };

  // Pagination
  const getTotalPages = () => {
    return Math.ceil(getFilteredAppointments().length / appointmentsPerPage);
  };

  const getPaginatedAppointments = () => {
    const filtered = getFilteredAppointments();
    const startIndex = (currentPage - 1) * appointmentsPerPage;
    const endIndex = startIndex + appointmentsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Handle confirm appointment
  const handleConfirmAppointment = async (appointmentId) => {
    try {
      // Find the appointment
      const appointment = appointments.find((apt) => apt.id === appointmentId);
      if (!appointment) return;

      // Check booking limit
      const category = categories.find(
        (cat) =>
          cat.id === appointment.serviceCategory ||
          cat.id === appointment.categoryId
      );
      const bookingLimit = category?.bookingLimit || 999;

      // Get appointments at this time slot for the same category
      const dateAppointments = await getAppointmentsByDate(appointment.date);
      const categoryAppointmentsAtTime = dateAppointments.filter(
        (apt) =>
          apt.id !== appointmentId && // Exclude current appointment
          apt.time === appointment.time &&
          (apt.status === "مؤكد" || apt.status === "في الانتظار") &&
          (apt.serviceCategory === appointment.serviceCategory ||
            apt.categoryId === appointment.categoryId)
      ).length;

      // Show warning if limit reached
      let confirmMessage = "هل أنت متأكد من تأكيد هذا الموعد؟";
      if (categoryAppointmentsAtTime >= bookingLimit) {
        confirmMessage = `تحذير: تم الوصول إلى الحد الأقصى (${bookingLimit}) لحجوزات هذه الفئة في هذا الوقت.\n\nهل تريد المتابعة بالتأكيد؟`;
      }

      const confirmed = await showConfirm(
        confirmMessage,
        "تأكيد الموعد",
        "تأكيد",
        "إلغاء"
      );

      if (confirmed) {
        await confirmAppointment(appointmentId);
        await reloadAppointments();
        showSuccess("تم تأكيد الموعد بنجاح");
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
      showError("فشل في تأكيد الموعد");
    }
  };

  // Handle complete appointment - open completion modal
  const handleCompleteAppointment = (appointment) => {
    setAppointmentToComplete(appointment);
    setIsCompletionModalOpen(true);
  };

  // Handle appointment completion with notes
  const handleAppointmentCompletion = async (
    appointmentId,
    staffNoteToCustomer,
    staffInternalNote,
    actualPaidAmount
  ) => {
    try {
      await completeAppointment(
        appointmentId,
        staffNoteToCustomer,
        staffInternalNote,
        actualPaidAmount
      );
      await reloadAppointments();
      showSuccess("تم إتمام الموعد بنجاح");
    } catch (error) {
      console.error("Error completing appointment:", error);
      throw error; // Re-throw to be handled by the modal
    }
  };

  // Handle edit appointment
  const handleEditAppointment = (appointment) => {
    setAppointmentToEdit(appointment);
    setIsEditModalOpen(true);
  };

  // Handle delete appointment
  const handleDeleteAppointment = async (appointmentId, customerName) => {
    const confirmed = await showConfirm(
      `هل أنت متأكد من حذف موعد ${customerName}؟ لا يمكن التراجع عن هذا الإجراء.`,
      "حذف الموعد",
      "حذف",
      "إلغاء"
    );

    if (confirmed) {
      try {
        await deleteAppointment(appointmentId);
        await reloadAppointments();
        showSuccess("تم حذف الموعد بنجاح");
      } catch (error) {
        console.error("Error deleting appointment:", error);
        showError("فشل في حذف الموعد");
      }
    }
  };

  // Handle view appointment details
  const handleViewAppointmentDetails = (appointment) => {
    setAppointmentToView(appointment);
    setIsDetailsModalOpen(true);
  };

  // Save internal staff note (from AppointmentDetailsModal)
  const handleSaveInternalNote = async (appointmentId, note) => {
    try {
      await updateAppointment(appointmentId, { staffInternalNote: note });
      await reloadAppointments();
      showSuccess("تم حفظ الملاحظة الداخلية");
    } catch (error) {
      console.error("Error saving internal note:", error);
      showError("فشل في حفظ الملاحظة الداخلية");
    }
  };

  // Handle appointment update from edit modal
  const handleAppointmentUpdate = async (updatedData) => {
    try {
      // Check if staff, date, or time changed
      const staffChanged = updatedData.staffId !== appointmentToEdit.staffId;
      const dateChanged = updatedData.date !== appointmentToEdit.date;
      const timeChanged = updatedData.time !== appointmentToEdit.time;

      // If staff is assigned and date/time changed, check for conflicts
      if (updatedData.staffId && (staffChanged || dateChanged || timeChanged)) {
        const isAvailable = await checkStaffAvailability(
          updatedData.staffId,
          updatedData.date,
          updatedData.time
        );

        if (!isAvailable) {
          showError(
            `الأخصائية ${updatedData.staffName} لديها موعد آخر في نفس التاريخ والوقت`
          );
          throw new Error("Staff conflict detected");
        }
      }

      // Check booking limit if date or time changed
      if (dateChanged || timeChanged) {
        const category = categories.find(
          (cat) =>
            cat.id === appointmentToEdit.serviceCategory ||
            cat.id === appointmentToEdit.categoryId
        );
        const bookingLimit = category?.bookingLimit || 999;

        // Get appointments at the new time slot for the same category
        const dateAppointments = await getAppointmentsByDate(updatedData.date);
        const categoryAppointmentsAtTime = dateAppointments.filter(
          (apt) =>
            apt.id !== appointmentToEdit.id && // Exclude current appointment
            apt.time === updatedData.time &&
            (apt.status === "مؤكد" || apt.status === "في الانتظار") &&
            (apt.serviceCategory === appointmentToEdit.serviceCategory ||
              apt.categoryId === appointmentToEdit.categoryId)
        ).length;

        // Show warning if limit reached
        if (categoryAppointmentsAtTime >= bookingLimit) {
          const confirmed = await showConfirm(
            `تحذير: تم الوصول إلى الحد الأقصى (${bookingLimit}) لحجوزات هذه الفئة في هذا الوقت.\n\nهل تريد المتابعة بالتحديث؟`,
            "تحذير تجاوز الحد الأقصى",
            "متابعة",
            "إلغاء"
          );

          if (!confirmed) {
            throw new Error("Booking limit exceeded");
          }
        }
      }

      await updateAppointment(appointmentToEdit.id, updatedData);
      await reloadAppointments();
      setIsEditModalOpen(false);
      showSuccess("تم تحديث الموعد بنجاح");
    } catch (error) {
      console.error("Error updating appointment:", error);
      if (
        error.message !== "Staff conflict detected" &&
        error.message !== "Booking limit exceeded"
      ) {
        showError("فشل في تحديث الموعد");
      }
      throw error; // Re-throw to let modal handle it
    }
  };

  // Handle book new appointment
  const handleBookNewAppointment = () => {
    navigate("/book");
  };

  if (loading) {
    return (
      <div className="admin-appointments-page-unique">
        <div className="aap-loading-state">
          <div className="aap-loading-spinner"></div>
          <p>جاري تحميل المواعيد...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-appointments-page-unique">
        <div className="aap-error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={loadAppointments} className="aap-btn-primary">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-appointments-page-unique">
      {/* <div className="aap-page-header">
        <div className="aap-header-content">
          <h1>
            <i className="fas fa-calendar-check"></i>
            إدارة المواعيد
          </h1>
          <p>إدارة ومتابعة جميع مواعيد العيادة</p>
        </div>
        <button className="aap-btn-primary" onClick={handleBookNewAppointment}>
          <i className="fas fa-plus"></i>
          حجز موعد جديد
        </button>
      </div> */}

      {/* Filters */}
      <div className="aap-appointments-filters">
        <select
          className="aap-filter-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">جميع الحالات</option>
          <option value="في الانتظار">في الانتظار</option>
          <option value="مؤكد">مؤكد</option>
          <option value="مكتمل">مكتمل</option>
          <option value="ملغي">ملغي</option>
        </select>
        <input
          type="date"
          className="aap-filter-date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setCurrentPage(1);
          }}
        />
        <input
          type="text"
          placeholder="بحث بالاسم، رقم الهاتف، الخدمة، أو الأخصائية..."
          className="aap-filter-search"
          value={searchFilter}
          onChange={(e) => {
            setSearchFilter(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Statistics */}
      <div className="aap-appointments-stats">
        <div className="aap-stat-card">
          <div className="aap-stat-icon">
            <i
              className="fas fa-calendar-alt"
              style={{ color: "var(--white)" }}
            ></i>
          </div>
          <div className="aap-stat-content">
            <h3>{appointments.length}</h3>
            <p>إجمالي المواعيد</p>
          </div>
        </div>
        <div className="aap-stat-card">
          <div className="aap-stat-icon">
            <i className="fas fa-clock" style={{ color: "var(--white)" }}></i>
          </div>
          <div className="aap-stat-content">
            <h3>
              {
                appointments.filter((apt) => apt.status === "في الانتظار")
                  .length
              }
            </h3>
            <p>في الانتظار</p>
          </div>
        </div>
        <div className="aap-stat-card">
          <div className="aap-stat-icon">
            <i
              className="fas fa-check-circle"
              style={{ color: "var(--white)" }}
            ></i>
          </div>
          <div className="aap-stat-content">
            <h3>
              {appointments.filter((apt) => apt.status === "مؤكد").length}
            </h3>
            <p>مؤكد</p>
          </div>
        </div>
        <div className="aap-stat-card">
          <div className="aap-stat-icon">
            <i
              className="fas fa-check-double"
              style={{ color: "var(--white)" }}
            ></i>
          </div>
          <div className="aap-stat-content">
            <h3>
              {appointments.filter((apt) => apt.status === "مكتمل").length}
            </h3>
            <p>مكتمل</p>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="aap-appointments-table-container">
        <table className="aap-appointments-table">
          <thead>
            <tr>
              <th>العميل</th>
              <th>الخدمة</th>
              <th>الأخصائية</th>
              <th>التاريخ</th>
              <th>الوقت</th>
              <th>الحالة</th>
              <th>ملاحظات العميل</th>
              <th>ملاحظات داخلية</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedAppointments().length === 0 ? (
              <tr>
                <td colSpan="9" className="aap-empty-state-cell">
                  <div className="aap-empty-state">
                    <i className="fas fa-calendar-alt"></i>
                    <p>لا يوجد مواعيد مطابقة لمعايير البحث</p>
                  </div>
                </td>
              </tr>
            ) : (
              getPaginatedAppointments().map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    <div
                      className="aap-customer-info"
                      onClick={() =>
                        handleNavigateToCustomer(appointment.customerId)
                      }
                      style={{ cursor: "pointer" }}
                      title="عرض ملف العميل"
                    >
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
                      className={`aap-status ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <div className="aap-notes-cell">
                      {appointment.notes ? (
                        <span title={appointment.notes}>
                          {appointment.notes.length > 30
                            ? `${appointment.notes.substring(0, 30)}...`
                            : appointment.notes}
                        </span>
                      ) : (
                        <span className="aap-no-notes">-</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="aap-notes-cell">
                      {appointment.staffInternalNote ? (
                        <span title={appointment.staffInternalNote}>
                          {appointment.staffInternalNote.length > 30
                            ? `${appointment.staffInternalNote.substring(
                                0,
                                30
                              )}...`
                            : appointment.staffInternalNote}
                        </span>
                      ) : (
                        <span className="aap-no-notes">-</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="aap-table-actions">
                      {appointment.status === "في الانتظار" && (
                        <button
                          className="aap-action-btn aap-confirm"
                          onClick={() =>
                            handleConfirmAppointment(appointment.id)
                          }
                          title="تأكيد الموعد"
                        >
                          تأكيد
                        </button>
                      )}
                      {appointment.status === "مؤكد" && (
                        <button
                          className="aap-action-btn aap-complete"
                          onClick={() => handleCompleteAppointment(appointment)}
                          title="إتمام الموعد"
                        >
                          إتمام
                        </button>
                      )}
                      <button
                        className="aap-action-btn aap-edit"
                        onClick={() => handleEditAppointment(appointment)}
                        title="تعديل الموعد"
                      >
                        تعديل
                      </button>
                      <button
                        className="aap-action-btn aap-view"
                        onClick={() =>
                          handleViewAppointmentDetails(appointment)
                        }
                        title="عرض التفاصيل"
                      >
                        عرض
                      </button>
                      <button
                        className="aap-action-btn aap-delete"
                        onClick={() =>
                          handleDeleteAppointment(
                            appointment.id,
                            appointment.customerName
                          )
                        }
                        title="حذف الموعد"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {getTotalPages() > 1 && (
        <div className="aap-pagination">
          <button
            className="aap-pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            السابق
          </button>
          <div className="aap-pagination-info">
            <span>
              صفحة {currentPage} من {getTotalPages()}
            </span>
            <span className="aap-results-count">
              ({getFilteredAppointments().length} موعد)
            </span>
          </div>
          <button
            className="aap-pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === getTotalPages()}
          >
            التالي
          </button>
        </div>
      )}

      {/* Modals */}
      <CustomModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancel={modalState.showCancel}
      />

      {isEditModalOpen && appointmentToEdit && (
        <AdminAppointmentEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setAppointmentToEdit(null);
          }}
          appointment={appointmentToEdit}
          onSubmit={handleAppointmentUpdate}
          staff={staff}
          specializations={specializations}
        />
      )}

      {isDetailsModalOpen && appointmentToView && (
        <AppointmentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setAppointmentToView(null);
          }}
          appointment={appointmentToView}
          onSaveInternalNote={handleSaveInternalNote}
        />
      )}

      {isCompletionModalOpen && appointmentToComplete && (
        <AppointmentCompletionModal
          isOpen={isCompletionModalOpen}
          onClose={() => {
            setIsCompletionModalOpen(false);
            setAppointmentToComplete(null);
          }}
          appointment={appointmentToComplete}
          onComplete={handleAppointmentCompletion}
        />
      )}
    </div>
  );
};

export default AdminAppointmentsPage;
