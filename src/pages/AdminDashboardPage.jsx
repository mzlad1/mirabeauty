import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboardPage.css";
import {
  getCustomers,
  getStaff,
  adminAddCustomer,
  adminAddStaff,
  adminUpdateCustomer,
  adminUpdateStaff,
  adminDeleteCustomer,
  adminDeleteStaff,
  updateUser,
  getUserById,
} from "../services/usersService";
import {
  adminRegisterCustomer,
  adminRegisterStaff,
} from "../services/authService";
import {
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
} from "../services/appointmentsService";
import {
  getAllServices,
  addService,
  updateService,
  deleteService,
} from "../services/servicesService";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productsService";
import {
  getAllProductCategories,
  getAllServiceCategories,
  addProductCategory,
  addServiceCategory,
  updateProductCategory,
  updateServiceCategory,
  deleteProductCategory,
  deleteServiceCategory,
} from "../services/categoriesService";
import UserModal from "../components/dashboard/UserModal";
import ServiceEditModal from "../components/dashboard/ServiceEditModal";
import ProductEditModal from "../components/dashboard/ProductEditModal";
import AdminAppointmentEditModal from "../components/dashboard/AdminAppointmentEditModal";
import CategoryModal from "../components/dashboard/CategoryModal";
import { uploadSingleImage, deleteImage } from "../utils/imageUpload";

const AdminDashboardPage = ({ currentUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("thisMonth");

  // Firebase data states
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Appointment editing states
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userModalType, setUserModalType] = useState("customer");
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Categories states
  const [productCategories, setProductCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [activeCategoryTab, setActiveCategoryTab] = useState("products");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryModalType, setCategoryModalType] = useState("product");

  // Profile editing states
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completeUserData, setCompleteUserData] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    address: "",
  });
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

  // Calculate statistics
  const totalCustomers = customers.length;
  const totalStaff = staff.length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "مكتمل"
  ).length;
  const totalRevenue = appointments
    .filter((apt) => apt.status === "مكتمل")
    .reduce((sum, apt) => {
      const price = parsePrice(apt.servicePrice || apt.price);
      return sum + price;
    }, 0);

  const todayAppointments = appointments.filter((apt) => {
    const today = new Date().toISOString().split("T")[0];
    return apt.date === today;
  });

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "مؤكد" || apt.status === "في الانتظار"
  );

  const recentAppointments = [...appointments]
    .sort((a, b) => {
      const dateA = a.createdAt?.seconds
        ? new Date(a.createdAt.seconds * 1000)
        : new Date(a.createdAt);
      const dateB = b.createdAt?.seconds
        ? new Date(b.createdAt.seconds * 1000)
        : new Date(b.createdAt);
      return dateB - dateA;
    })
    .slice(0, 10);

  // Firebase data loading functions
  const loadCustomers = async () => {
    try {
      setLoading(true);
      const customersData = await getCustomers();
      setCustomers(customersData);
    } catch (err) {
      console.error("Error loading customers:", err);
      setError("فشل في تحميل بيانات العملاء");
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async () => {
    try {
      setLoading(true);
      const staffData = await getStaff();
      setStaff(staffData);
    } catch (err) {
      console.error("Error loading staff:", err);
      setError("فشل في تحميل بيانات الموظفين");
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

  const loadServices = async () => {
    try {
      setLoading(true);
      const servicesData = await getAllServices();
      setServices(servicesData);
    } catch (err) {
      console.error("Error loading services:", err);
      setError("فشل في تحميل بيانات الخدمات");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("فشل في تحميل بيانات المنتجات");
    } finally {
      setLoading(false);
    }
  };

  const loadProductCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getAllProductCategories();
      setProductCategories(categoriesData);
    } catch (err) {
      console.error("Error loading product categories:", err);
      setError("فشل في تحميل تصنيفات المنتجات");
    } finally {
      setLoading(false);
    }
  };

  const loadServiceCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getAllServiceCategories();
      setServiceCategories(categoriesData);
    } catch (err) {
      console.error("Error loading service categories:", err);
      setError("فشل في تحميل تصنيفات الخدمات");
    } finally {
      setLoading(false);
    }
  };

  // Appointment management functions
  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };

  const handleDeleteAppointment = async (appointmentId, customerName) => {
    if (
      !window.confirm(
        `هل أنت متأكد من حذف موعد العميل "${customerName}"؟\n\nتحذير: سيتم حذف الموعد بشكل نهائي.`
      )
    ) {
      return;
    }

    try {
      await deleteAppointment(appointmentId);
      await loadAppointments();
      alert("تم حذف الموعد بنجاح");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("حدث خطأ أثناء حذف الموعد");
    }
  };

  const handleAppointmentSubmit = async (appointmentData) => {
    try {
      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, appointmentData);
        alert("تم تحديث الموعد بنجاح");
      }
      await loadAppointments();
      setIsAppointmentModalOpen(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("حدث خطأ أثناء تحديث الموعد");
      throw error;
    }
  };

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [appointmentsData, servicesData] = await Promise.all([
          getAllAppointments(),
          getAllServices(),
        ]);
        setAppointments(appointmentsData);
        setServices(servicesData);
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("فشل في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load current user profile data
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser?.uid) {
        try {
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
          });
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    };

    loadUserData();
  }, [currentUser?.uid]);

  // Load data on tab change
  useEffect(() => {
    if (activeTab === "customers") {
      loadCustomers();
    } else if (activeTab === "staff") {
      loadStaff();
    } else if (activeTab === "appointments") {
      loadAppointments();
      loadStaff(); // Load staff data for appointment editing
    } else if (activeTab === "services") {
      loadServices();
    } else if (activeTab === "products") {
      loadProducts();
    } else if (activeTab === "categories") {
      loadProductCategories();
      loadServiceCategories();
    }
  }, [activeTab]);

  // Service popularity
  const serviceStats = services
    .map((service) => {
      const serviceAppointments = appointments.filter(
        (apt) => apt.serviceId === service.id
      );
      const revenue = serviceAppointments.reduce((sum, apt) => {
        const price = parsePrice(apt.servicePrice || apt.price);
        return sum + price;
      }, 0);
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
      const staffAppointments = appointments.filter(
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

  // Service management functions
  const handleAddService = () => {
    setEditingService(null);
    setIsServiceModalOpen(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (serviceData) => {
    try {
      if (editingService) {
        await updateService(editingService.id, serviceData);
        alert("تم تحديث الخدمة بنجاح");
      } else {
        await addService(serviceData);
        alert("تم إضافة الخدمة بنجاح");
      }
      await loadServices();
    } catch (error) {
      console.error("Error submitting service:", error);
      throw error;
    }
  };

  const handleDeleteService = async (serviceId, serviceName) => {
    if (
      !window.confirm(
        `هل أنت متأكد من حذف الخدمة "${serviceName}"؟\n\nتحذير: سيتم حذف الخدمة بشكل نهائي.`
      )
    ) {
      return;
    }

    try {
      await deleteService(serviceId);
      await loadServices();
      alert("تم حذف الخدمة بنجاح");
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("حدث خطأ أثناء حذف الخدمة");
    }
  };

  // Product management functions
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        alert("تم تحديث المنتج بنجاح");
      } else {
        await addProduct(productData);
        alert("تم إضافة المنتج بنجاح");
      }
      await loadProducts();
    } catch (error) {
      console.error("Error submitting product:", error);
      throw error;
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (
      !window.confirm(
        `هل أنت متأكد من حذف المنتج "${productName}"؟\n\nتحذير: سيتم حذف المنتج بشكل نهائي.`
      )
    ) {
      return;
    }

    try {
      await deleteProduct(productId);
      await loadProducts();
      alert("تم حذف المنتج بنجاح");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("حدث خطأ أثناء حذف المنتج");
    }
  };

  // Categories management functions
  const handleAddCategory = (type) => {
    setCategoryModalType(type);
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category, type) => {
    setCategoryModalType(type);
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (categoryData) => {
    try {
      if (editingCategory) {
        // Update existing category
        if (categoryModalType === "product") {
          await updateProductCategory(editingCategory.id, categoryData);
          alert("تم تحديث تصنيف المنتج بنجاح");
          await loadProductCategories();
        } else {
          await updateServiceCategory(editingCategory.id, categoryData);
          alert("تم تحديث تصنيف الخدمة بنجاح");
          await loadServiceCategories();
        }
      } else {
        // Add new category
        if (categoryModalType === "product") {
          await addProductCategory(categoryData);
          alert("تم إضافة تصنيف المنتج بنجاح");
          await loadProductCategories();
        } else {
          await addServiceCategory(categoryData);
          alert("تم إضافة تصنيف الخدمة بنجاح");
          await loadServiceCategories();
        }
      }
      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error("Error submitting category:", error);
      throw error;
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName, type) => {
    if (
      !window.confirm(
        `هل أنت متأكد من حذف التصنيف "${categoryName}"؟\n\nتحذير: سيتم حذف التصنيف بشكل نهائي.`
      )
    ) {
      return;
    }

    try {
      if (type === "product") {
        await deleteProductCategory(categoryId);
        await loadProductCategories();
        alert("تم حذف تصنيف المنتج بنجاح");
      } else {
        await deleteServiceCategory(categoryId);
        await loadServiceCategories();
        alert("تم حذف تصنيف الخدمة بنجاح");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      if (error.message.includes("in use")) {
        alert("لا يمكن حذف هذا التصنيف لأنه مستخدم في منتجات أو خدمات موجودة");
      } else {
        alert("حدث خطأ أثناء حذف التصنيف");
      }
    }
  };

  // User management functions
  const handleAddUser = (userType) => {
    setUserModalType(userType);
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user, userType) => {
    setUserModalType(userType);
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (userId, userType) => {
    if (
      !window.confirm(
        `هل أنت متأكد من حذف هذا ${
          userType === "customer" ? "العميل" : "الموظف"
        }؟`
      )
    ) {
      return;
    }

    try {
      if (userType === "customer") {
        await adminDeleteCustomer(userId);
        await loadCustomers();
      } else {
        await adminDeleteStaff(userId);
        await loadStaff();
      }
      alert("تم الحذف بنجاح");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const handleUserSubmit = async (userData) => {
    try {
      if (editingUser) {
        // Update existing user - use Firestore only (no auth changes)
        const updateData = { ...userData };
        delete updateData.password; // Don't update password for existing users

        if (userModalType === "customer") {
          await adminUpdateCustomer(editingUser.id, updateData);
          await loadCustomers();
        } else {
          await adminUpdateStaff(editingUser.id, updateData);
          await loadStaff();
        }
        alert("تم التحديث بنجاح");
      } else {
        // Add new user - use authentication functions to create both auth and Firestore records
        if (userModalType === "customer") {
          await adminRegisterCustomer(userData);
          await loadCustomers();
        } else {
          await adminRegisterStaff(userData);
          await loadStaff();
        }
        const tempPassword = userData.password || "LaserBooking2024!";
        alert(
          `تم إنشاء الحساب بنجاح!\nكلمة المرور المؤقتة: ${tempPassword}\nيُرجى إعلام المستخدم بتغيير كلمة المرور عند أول تسجيل دخول.`
        );
      }

      // Close modal and reset editing state
      setIsUserModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error submitting user:", error);
      let errorMessage = "حدث خطأ أثناء العملية";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "البريد الإلكتروني مستخدم من قبل";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "البريد الإلكتروني غير صحيح";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "كلمة المرور ضعيفة جداً";
      }

      alert(errorMessage);
      throw error;
    }
  };

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

  // Profile editing functions
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
      };

      await updateUser(currentUser.uid, updatedUserData);

      // Update local state
      const updatedCompleteData = {
        ...completeUserData,
        ...updatedUserData,
      };
      setCompleteUserData(updatedCompleteData);

      setEditMode(false);
      alert("تم حفظ التغييرات بنجاح");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("حدث خطأ أثناء حفظ التغييرات");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset form data to original values
    setEditData({
      name: completeUserData?.name || currentUser?.displayName || "",
      phone: completeUserData?.phone || "",
      address: completeUserData?.address || "",
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("يرجى اختيار ملف صورة صحيح");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت");
      return;
    }

    try {
      setAvatarUploading(true);

      // Delete old avatar if exists and is not the default avatar
      if (
        completeUserData?.avatar &&
        typeof completeUserData.avatar === "string" &&
        !completeUserData.avatar.includes("/default-avatar") &&
        !completeUserData.avatar.includes("default-avatar.png")
      ) {
        try {
          await deleteImage(completeUserData.avatar);
        } catch (deleteError) {
          console.warn("Could not delete old avatar:", deleteError);
        }
      }

      // Upload new avatar
      const avatarData = await uploadSingleImage(
        file,
        "avatars",
        currentUser.uid
      );

      // Update user data with new avatar
      await updateUser(currentUser.uid, { avatar: avatarData.url });

      // Update local state
      const updatedCompleteData = {
        ...completeUserData,
        avatar: avatarData.url,
      };
      setCompleteUserData(updatedCompleteData);

      alert("تم تحديث صورة الملف الشخصي بنجاح");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("حدث خطأ أثناء رفع الصورة");
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Breadcrumb Navigation */}
      <section className="admin-breadcrumb-section">
        <div className="container">
          <nav className="admin-breadcrumb">
            <button
              className="admin-breadcrumb-item"
              onClick={() => navigate("/")}
            >
              الرئيسية
            </button>
            <span className="admin-breadcrumb-separator">/</span>
            <span className="admin-breadcrumb-item active">لوحة التحكم</span>
          </nav>
        </div>
      </section>

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
                    activeTab === "products" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("products")}
                >
                  <i className="nav-icon fas fa-box"></i>
                  المنتجات
                </button>
                <button
                  className={`nav-item ${
                    activeTab === "categories" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("categories")}
                >
                  <i className="nav-icon fas fa-tags"></i>
                  التصنيفات
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
                  {/* <div className="quick-actions">
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
                  </div> */}

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
                                appointment.updatedAt
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
                                <button
                                  className="action-btn edit"
                                  onClick={() =>
                                    handleEditAppointment(appointment)
                                  }
                                  title="تعديل الموعد وتعيين أخصائية"
                                >
                                  تعديل
                                </button>
                                <button
                                  className="action-btn delete"
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
                    <button
                      className="btn-primary"
                      onClick={() => handleAddUser("customer")}
                    >
                      إضافة عميل جديد
                    </button>
                  </div>

                  {loading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>جاري تحميل بيانات العملاء...</p>
                    </div>
                  ) : error ? (
                    <div className="error-state">
                      <i className="fas fa-exclamation-triangle"></i>
                      <p>{error}</p>
                      <button onClick={loadCustomers} className="btn-primary">
                        إعادة المحاولة
                      </button>
                    </div>
                  ) : customers.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-users"></i>
                      <p>لا يوجد عملاء حتى الآن</p>
                      <button
                        className="btn-primary"
                        onClick={() => handleAddUser("customer")}
                      >
                        إضافة أول عميل
                      </button>
                    </div>
                  ) : (
                    <div className="customers-grid">
                      {customers.map((customer) => (
                        <div key={customer.id} className="customer-card">
                          <div className="customer-header">
                            <img
                              src={
                                customer.avatar || "/assets/default-avatar.jpg"
                              }
                              alt={customer.name}
                              onError={(e) => {
                                e.target.src = "/assets/default-avatar.jpg";
                              }}
                            />
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
                            <button
                              className="action-btn edit"
                              onClick={() =>
                                handleEditUser(customer, "customer")
                              }
                            >
                              تعديل
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() =>
                                handleDeleteUser(customer.id, "customer")
                              }
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Staff Tab */}
              {activeTab === "staff" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>إدارة الموظفين</h2>
                    <button
                      className="btn-primary"
                      onClick={() => handleAddUser("staff")}
                    >
                      إضافة موظف جديد
                    </button>
                  </div>

                  {loading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>جاري تحميل بيانات الموظفين...</p>
                    </div>
                  ) : error ? (
                    <div className="error-state">
                      <i className="fas fa-exclamation-triangle"></i>
                      <p>{error}</p>
                      <button onClick={loadStaff} className="btn-primary">
                        إعادة المحاولة
                      </button>
                    </div>
                  ) : staff.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-user-tie"></i>
                      <p>لا يوجد موظفين حتى الآن</p>
                      <button
                        className="btn-primary"
                        onClick={() => handleAddUser("staff")}
                      >
                        إضافة أول موظف
                      </button>
                    </div>
                  ) : (
                    <div className="staff-grid">
                      {staff.map((staffMember) => {
                        // Calculate staff performance from appointments
                        const staffAppointments = appointments.filter(
                          (apt) => apt.staffId === staffMember.id
                        );
                        const completedAppts = staffAppointments.filter(
                          (apt) => apt.status === "مكتمل"
                        );
                        const revenue = completedAppts.reduce((sum, apt) => {
                          const price = parsePrice(
                            apt.servicePrice || apt.price
                          );
                          return sum + price;
                        }, 0);

                        return (
                          <div key={staffMember.id} className="staff-card">
                            <div className="staff-header">
                              <img
                                src={
                                  staffMember.avatar ||
                                  "/assets/default-avatar.jpg"
                                }
                                alt={staffMember.name}
                                onError={(e) => {
                                  e.target.src = "/assets/default-avatar.jpg";
                                }}
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
                                  {staffAppointments.length}
                                </span>
                              </div>
                              <div className="performance-item">
                                <span className="perf-label">المكتملة:</span>
                                <span className="perf-value">
                                  {completedAppts.length}
                                </span>
                              </div>
                              <div className="performance-item">
                                <span className="perf-label">الإيرادات:</span>
                                <span className="perf-value">
                                  {revenue} شيكل
                                </span>
                              </div>
                            </div>
                            <div className="staff-actions">
                              <button
                                className="action-btn edit"
                                onClick={() =>
                                  handleEditUser(staffMember, "staff")
                                }
                              >
                                تعديل
                              </button>
                              <button
                                className="action-btn delete"
                                onClick={() =>
                                  handleDeleteUser(staffMember.id, "staff")
                                }
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Services Tab */}
              {activeTab === "services" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>إدارة الخدمات</h2>
                    <button className="btn-primary" onClick={handleAddService}>
                      إضافة خدمة جديدة
                    </button>
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
                                <button
                                  className="action-btn edit"
                                  onClick={() => handleEditService(service)}
                                >
                                  تعديل
                                </button>
                                <button
                                  className="action-btn delete"
                                  onClick={() =>
                                    handleDeleteService(
                                      service.id,
                                      service.name
                                    )
                                  }
                                >
                                  حذف
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

              {/* Products Tab */}
              {activeTab === "products" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>إدارة المنتجات</h2>
                    <button className="btn-primary" onClick={handleAddProduct}>
                      إضافة منتج جديد
                    </button>
                  </div>

                  {loading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>جاري تحميل بيانات المنتجات...</p>
                    </div>
                  ) : error ? (
                    <div className="error-state">
                      <i className="fas fa-exclamation-triangle"></i>
                      <p>{error}</p>
                      <button onClick={loadProducts} className="btn-primary">
                        إعادة المحاولة
                      </button>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-box"></i>
                      <p>لا توجد منتجات حتى الآن</p>
                      <button
                        className="btn-primary"
                        onClick={handleAddProduct}
                      >
                        إضافة أول منتج
                      </button>
                    </div>
                  ) : (
                    <div className="services-table">
                      <table>
                        <thead>
                          <tr>
                            <th>اسم المنتج</th>
                            <th>الفئة</th>
                            <th>السعر</th>
                            <th>السعر الأصلي</th>
                            <th>الحالة</th>
                            <th>التقييم</th>
                            <th>الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id}>
                              <td>{product.name}</td>
                              <td>{product.categoryName}</td>
                              <td>{product.price}</td>
                              <td>{product.originalPrice || "-"}</td>
                              <td>
                                <span
                                  className={`status ${
                                    product.inStock ? "confirmed" : "cancelled"
                                  }`}
                                >
                                  {product.inStock ? "متوفر" : "نفذ"}
                                </span>
                              </td>
                              <td>
                                {/* use fa-star insted of ⭐ just one star */}
                                {
                                  product.rating
                                } <i className="fas fa-star"></i> (
                                {product.reviewsCount})
                              </td>
                              <td>
                                <div className="table-actions">
                                  <button
                                    className="action-btn edit"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    تعديل
                                  </button>
                                  <button
                                    className="action-btn delete"
                                    onClick={() =>
                                      handleDeleteProduct(
                                        product.id,
                                        product.name
                                      )
                                    }
                                  >
                                    حذف
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Categories Tab */}
              {activeTab === "categories" && (
                <div className="tab-content">
                  <h2>إدارة التصنيفات</h2>

                  {/* Categories Sub-tabs */}
                  <div className="sub-tabs">
                    <button
                      className={`sub-tab ${
                        activeCategoryTab === "products" ? "active" : ""
                      }`}
                      onClick={() => setActiveCategoryTab("products")}
                    >
                      <i className="fas fa-box"></i>
                      تصنيفات المنتجات
                    </button>
                    <button
                      className={`sub-tab ${
                        activeCategoryTab === "services" ? "active" : ""
                      }`}
                      onClick={() => setActiveCategoryTab("services")}
                    >
                      <i className="fas fa-concierge-bell"></i>
                      تصنيفات الخدمات
                    </button>
                  </div>

                  {/* Product Categories */}
                  {activeCategoryTab === "products" && (
                    <div className="categories-section">
                      <div className="section-header">
                        <h3>تصنيفات المنتجات</h3>
                        <button
                          className="btn-primary"
                          onClick={() => handleAddCategory("product")}
                        >
                          <i className="fas fa-plus"></i>
                          إضافة تصنيف جديد
                        </button>
                      </div>

                      {loading ? (
                        <div className="loading">جاري التحميل...</div>
                      ) : productCategories.length === 0 ? (
                        <div className="empty-state">
                          <i className="fas fa-tags"></i>
                          <p>لا توجد تصنيفات منتجات حتى الآن</p>
                          <button
                            className="btn-primary"
                            onClick={() => handleAddCategory("product")}
                          >
                            إضافة أول تصنيف
                          </button>
                        </div>
                      ) : (
                        <div className="categories-grid">
                          {productCategories.map((category) => (
                            <div key={category.id} className="category-card">
                              <div className="category-header">
                                <h4>{category.name}</h4>
                                <div className="category-actions">
                                  <button
                                    className="action-btn edit"
                                    onClick={() =>
                                      handleEditCategory(category, "product")
                                    }
                                    title="تعديل"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    className="action-btn delete"
                                    onClick={() =>
                                      handleDeleteCategory(
                                        category.id,
                                        category.name,
                                        "product"
                                      )
                                    }
                                    title="حذف"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                              {category.description && (
                                <p className="category-description">
                                  {category.description}
                                </p>
                              )}
                              <div className="category-meta">
                                <span className="category-date">
                                  تم الإنشاء:{" "}
                                  {new Date(
                                    category.createdAt?.toDate()
                                  ).toLocaleDateString("ar-EG")}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Service Categories */}
                  {activeCategoryTab === "services" && (
                    <div className="categories-section">
                      <div className="section-header">
                        <h3>تصنيفات الخدمات</h3>
                        <button
                          className="btn-primary"
                          onClick={() => handleAddCategory("service")}
                        >
                          <i className="fas fa-plus"></i>
                          إضافة تصنيف جديد
                        </button>
                      </div>

                      {loading ? (
                        <div className="loading">جاري التحميل...</div>
                      ) : serviceCategories.length === 0 ? (
                        <div className="empty-state">
                          <i className="fas fa-tags"></i>
                          <p>لا توجد تصنيفات خدمات حتى الآن</p>
                          <button
                            className="btn-primary"
                            onClick={() => handleAddCategory("service")}
                          >
                            إضافة أول تصنيف
                          </button>
                        </div>
                      ) : (
                        <div className="categories-grid">
                          {serviceCategories.map((category) => (
                            <div key={category.id} className="category-card">
                              <div className="category-header">
                                <h4>{category.name}</h4>
                                <div className="category-actions">
                                  <button
                                    className="action-btn edit"
                                    onClick={() =>
                                      handleEditCategory(category, "service")
                                    }
                                    title="تعديل"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    className="action-btn delete"
                                    onClick={() =>
                                      handleDeleteCategory(
                                        category.id,
                                        category.name,
                                        "service"
                                      )
                                    }
                                    title="حذف"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                              {category.description && (
                                <p className="category-description">
                                  {category.description}
                                </p>
                              )}
                              <div className="category-meta">
                                <span className="category-date">
                                  تم الإنشاء:{" "}
                                  {new Date(
                                    category.createdAt?.toDate()
                                  ).toLocaleDateString("ar-EG")}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
                    {/* Profile Section */}
                    <div className="settings-section">
                      <h3>الملف الشخصي</h3>
                      <div className="profile-section">
                        <div className="profile-avatar">
                          <div className="avatar-container">
                            <img
                              src={
                                completeUserData?.avatar ||
                                "/default-avatar.png"
                              }
                              alt="Profile"
                              className="avatar-image"
                            />
                            <div className="avatar-overlay">
                              <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                style={{ display: "none" }}
                                disabled={avatarUploading}
                              />
                              <label
                                htmlFor="avatar-upload"
                                className="avatar-upload-btn"
                              >
                                {avatarUploading ? (
                                  <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                  <i className="fas fa-camera"></i>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="profile-form">
                          {!editMode ? (
                            <div className="profile-info">
                              <div className="info-item">
                                <label>الاسم</label>
                                <span>
                                  {completeUserData?.name || "غير محدد"}
                                </span>
                              </div>
                              <div className="info-item">
                                <label>البريد الإلكتروني</label>
                                <span>
                                  {completeUserData?.email || "غير محدد"}
                                </span>
                              </div>
                              <div className="info-item">
                                <label>رقم الهاتف</label>
                                <span>
                                  {completeUserData?.phone || "غير محدد"}
                                </span>
                              </div>
                              <div className="info-item">
                                <label>العنوان</label>
                                <span>
                                  {completeUserData?.address || "غير محدد"}
                                </span>
                              </div>
                              <button
                                className="btn-secondary"
                                onClick={() => setEditMode(true)}
                              >
                                تعديل المعلومات
                              </button>
                            </div>
                          ) : (
                            <div className="profile-edit-form">
                              <div className="form-group">
                                <label>الاسم</label>
                                <input
                                  type="text"
                                  name="name"
                                  value={editData.name}
                                  onChange={handleInputChange}
                                  className="form-input"
                                />
                              </div>
                              <div className="form-group">
                                <label>البريد الإلكتروني</label>
                                <input
                                  type="email"
                                  value={completeUserData?.email || ""}
                                  className="form-input"
                                  disabled
                                  style={{
                                    backgroundColor: "#f5f5f5",
                                    cursor: "not-allowed",
                                  }}
                                />
                                <small className="form-note">
                                  البريد الإلكتروني غير قابل للتعديل
                                </small>
                              </div>
                              <div className="form-group">
                                <label>رقم الهاتف</label>
                                <input
                                  type="tel"
                                  name="phone"
                                  value={editData.phone}
                                  onChange={handleInputChange}
                                  className="form-input"
                                />
                              </div>
                              <div className="form-group">
                                <label>العنوان</label>
                                <input
                                  type="text"
                                  name="address"
                                  value={editData.address}
                                  onChange={handleInputChange}
                                  className="form-input"
                                />
                              </div>
                              <div className="form-actions">
                                <button
                                  className="btn-primary"
                                  onClick={handleSaveProfile}
                                  disabled={submitting}
                                >
                                  {submitting
                                    ? "جاري الحفظ..."
                                    : "حفظ التغييرات"}
                                </button>
                                <button
                                  className="btn-secondary"
                                  onClick={handleCancelEdit}
                                  disabled={submitting}
                                >
                                  إلغاء
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

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

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleUserSubmit}
        user={editingUser}
        userType={userModalType}
      />

      {/* Service Edit Modal */}
      <ServiceEditModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleServiceSubmit}
        service={editingService}
        serviceCategories={serviceCategories}
      />

      {/* Product Edit Modal */}
      <ProductEditModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleProductSubmit}
        product={editingProduct}
        productCategories={productCategories}
      />

      {/* Appointment Edit Modal */}
      <AdminAppointmentEditModal
        isOpen={isAppointmentModalOpen}
        onClose={() => {
          setIsAppointmentModalOpen(false);
          setEditingAppointment(null);
        }}
        onSubmit={handleAppointmentSubmit}
        appointment={editingAppointment}
        staff={staff}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCategorySubmit}
        editingCategory={editingCategory}
        categoryType={categoryModalType}
      />
    </div>
  );
};

export default AdminDashboardPage;
