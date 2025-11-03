import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboardPage.css";
import CustomModal from "../components/common/CustomModal";
import { useModal } from "../hooks/useModal";
import { formatFirestoreDate } from "../utils/dateHelpers";
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
  getAllConsultations,
  updateConsultation,
  deleteConsultation,
  confirmConsultation,
  completeConsultation,
  assignStaffToConsultation,
} from "../services/consultationsService";
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
import AppointmentDetailsModal from "../components/dashboard/AppointmentDetailsModal";
import ConsultationDetailsModal from "../components/dashboard/ConsultationDetailsModal";
import CategoryModal from "../components/dashboard/CategoryModal";
import { uploadSingleImage, deleteImage } from "../utils/imageUpload";

const AdminDashboardPage = ({ currentUser }) => {
  const navigate = useNavigate();
  const {
    modalState,
    closeModal,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  } = useModal();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("thisMonth");

  // Firebase data states
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Appointment editing states
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Details modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [appointmentToView, setAppointmentToView] = useState(null);
  const [isConsultationDetailsModalOpen, setIsConsultationDetailsModalOpen] =
    useState(false);
  const [consultationToView, setConsultationToView] = useState(null);

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

  // Filter states for appointments
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState("");
  const [appointmentDateFilter, setAppointmentDateFilter] = useState("");
  const [appointmentSearchFilter, setAppointmentSearchFilter] = useState("");

  // Filter states for products
  const [productCategoryFilter, setProductCategoryFilter] = useState("");
  const [productStatusFilter, setProductStatusFilter] = useState("");
  const [productSearchFilter, setProductSearchFilter] = useState("");
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const productsPerPage = 10;

  // Filter states for services
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("");
  const [serviceSearchFilter, setServiceSearchFilter] = useState("");
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const servicesPerPage = 10;

  // Filter states for customers
  const [customerSearchFilter, setCustomerSearchFilter] = useState("");
  const [currentCustomerPage, setCurrentCustomerPage] = useState(1);
  const customersPerPage = 12;

  // Filter states for staff
  const [staffSearchFilter, setStaffSearchFilter] = useState("");
  const [staffStatusFilter, setStaffStatusFilter] = useState("");
  const [currentStaffPage, setCurrentStaffPage] = useState(1);
  const staffPerPage = 12;

  // Appointment pagination
  const [currentAppointmentPage, setCurrentAppointmentPage] = useState(1);
  const appointmentsPerPage = 10;

  // Filter states for consultations
  const [consultationStatusFilter, setConsultationStatusFilter] = useState("");
  const [consultationDateFilter, setConsultationDateFilter] = useState("");
  const [consultationSearchFilter, setConsultationSearchFilter] = useState("");
  const [currentConsultationPage, setCurrentConsultationPage] = useState(1);
  const consultationsPerPage = 10;

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

  // Filter function for appointments
  const getFilteredAppointments = () => {
    return appointments.filter((appointment) => {
      // Status filter
      if (
        appointmentStatusFilter &&
        appointment.status !== appointmentStatusFilter
      ) {
        return false;
      }

      // Date filter
      if (appointmentDateFilter && appointment.date !== appointmentDateFilter) {
        return false;
      }

      // Search filter (customer name, phone, or service name)
      if (appointmentSearchFilter) {
        const searchLower = appointmentSearchFilter.toLowerCase();
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

  const recentAppointments = [...getFilteredAppointments()].sort((a, b) => {
    const dateA = a.createdAt?.seconds
      ? new Date(a.createdAt.seconds * 1000)
      : new Date(a.createdAt);
    const dateB = b.createdAt?.seconds
      ? new Date(b.createdAt.seconds * 1000)
      : new Date(b.createdAt);
    return dateB - dateA;
  });

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

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const consultationsData = await getAllConsultations();
      setConsultations(consultationsData);
    } catch (err) {
      console.error("Error loading consultations:", err);
      setError("فشل في تحميل بيانات الاستشارات");
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

  const handleViewAppointmentDetails = (appointment) => {
    setAppointmentToView(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteAppointment = async (appointmentId, customerName) => {
    showConfirm(
      `هل أنت متأكد من حذف موعد العميل "${customerName}"؟\n\nتحذير: سيتم حذف الموعد بشكل نهائي.`,
      async () => {
        try {
          await deleteAppointment(appointmentId);
          await loadAppointments();
          showSuccess("تم حذف الموعد بنجاح");
        } catch (error) {
          console.error("Error deleting appointment:", error);
          showError("حدث خطأ أثناء حذف الموعد");
        }
      },
      "تأكيد حذف الموعد",
      "حذف",
      "إلغاء"
    );
  };

  const handleAppointmentSubmit = async (appointmentData) => {
    try {
      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, appointmentData);
        showSuccess("تم تحديث الموعد بنجاح");
      }
      await loadAppointments();
      setIsAppointmentModalOpen(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
      showError("حدث خطأ أثناء تحديث الموعد");
      throw error;
    }
  };

  // Consultation management functions
  const handleDeleteConsultation = async (consultationId, customerName) => {
    showConfirm(
      `هل أنت متأكد من حذف استشارة العميلة "${customerName}"؟\n\nتحذير: سيتم حذف الاستشارة بشكل نهائي.`,
      async () => {
        try {
          await deleteConsultation(consultationId);
          await loadConsultations();
          showSuccess("تم حذف الاستشارة بنجاح");
        } catch (error) {
          console.error("Error deleting consultation:", error);
          showError("حدث خطأ أثناء حذف الاستشارة");
        }
      },
      "تأكيد حذف الاستشارة",
      "حذف",
      "إلغاء"
    );
  };

  const handleConfirmConsultation = async (consultationId) => {
    try {
      await confirmConsultation(consultationId);
      await loadConsultations();
      showSuccess("تم تأكيد الاستشارة بنجاح");
    } catch (error) {
      console.error("Error confirming consultation:", error);
      showError("حدث خطأ أثناء تأكيد الاستشارة");
    }
  };

  const handleAssignStaffToConsultation = async (consultationId) => {
    // This will be handled through a modal later
    // For now, just reload
    await loadConsultations();
  };

  // Filter function for appointments
  // Filter function for products
  const getFilteredProducts = () => {
    return products.filter((product) => {
      // Category filter
      if (
        productCategoryFilter &&
        product.categoryName !== productCategoryFilter
      ) {
        return false;
      }

      // Status filter
      if (productStatusFilter) {
        if (productStatusFilter === "available" && !product.inStock) {
          return false;
        }
        if (productStatusFilter === "out_of_stock" && product.inStock) {
          return false;
        }
      }

      // Search filter (name)
      if (productSearchFilter) {
        const searchLower = productSearchFilter.toLowerCase();
        const productName = product.name?.toLowerCase() || "";

        if (!productName.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  };

  // Get paginated products
  const getPaginatedProducts = () => {
    const filtered = getFilteredProducts();
    const startIndex = (currentProductPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Get total pages for products
  const getTotalProductPages = () => {
    const filtered = getFilteredProducts();
    return Math.ceil(filtered.length / productsPerPage);
  };

  // Filter function for services
  const getFilteredServices = () => {
    return serviceStats.filter((service) => {
      // Category filter
      if (
        serviceCategoryFilter &&
        service.categoryName !== serviceCategoryFilter
      ) {
        return false;
      }

      // Search filter (name)
      if (serviceSearchFilter) {
        const searchLower = serviceSearchFilter.toLowerCase();
        const serviceName = service.name?.toLowerCase() || "";

        if (!serviceName.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  };

  // Get paginated services
  const getPaginatedServices = () => {
    const filtered = getFilteredServices();
    const startIndex = (currentServicePage - 1) * servicesPerPage;
    const endIndex = startIndex + servicesPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Get total pages for services
  const getTotalServicePages = () => {
    const filtered = getFilteredServices();
    return Math.ceil(filtered.length / servicesPerPage);
  };

  // Get filtered customers
  const getFilteredCustomers = () => {
    return customers.filter((customer) => {
      // Search filter (name, email, or phone)
      if (customerSearchFilter) {
        const searchLower = customerSearchFilter.toLowerCase();
        const customerName = customer.name?.toLowerCase() || "";
        const customerEmail = customer.email?.toLowerCase() || "";
        const customerPhone = customer.phone?.toLowerCase() || "";

        if (
          !customerName.includes(searchLower) &&
          !customerEmail.includes(searchLower) &&
          !customerPhone.includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });
  };

  // Get paginated customers
  const getPaginatedCustomers = () => {
    const filtered = getFilteredCustomers();
    const startIndex = (currentCustomerPage - 1) * customersPerPage;
    const endIndex = startIndex + customersPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Get total pages for customers
  const getTotalCustomerPages = () => {
    const filtered = getFilteredCustomers();
    return Math.ceil(filtered.length / customersPerPage);
  };

  // Get filtered staff
  const getFilteredStaff = () => {
    return staff.filter((staffMember) => {
      // Search filter (name or specialization)
      if (staffSearchFilter) {
        const searchLower = staffSearchFilter.toLowerCase();
        const staffName = staffMember.name?.toLowerCase() || "";
        const staffSpecialization =
          staffMember.specialization?.toLowerCase() || "";

        if (
          !staffName.includes(searchLower) &&
          !staffSpecialization.includes(searchLower)
        ) {
          return false;
        }
      }

      // Status filter
      if (staffStatusFilter) {
        if (staffStatusFilter === "active" && !staffMember.active) {
          return false;
        }
        if (staffStatusFilter === "inactive" && staffMember.active) {
          return false;
        }
      }

      return true;
    });
  };

  // Get paginated staff
  const getPaginatedStaff = () => {
    const filtered = getFilteredStaff();
    const startIndex = (currentStaffPage - 1) * staffPerPage;
    const endIndex = startIndex + staffPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Get total pages for staff
  const getTotalStaffPages = () => {
    const filtered = getFilteredStaff();
    return Math.ceil(filtered.length / staffPerPage);
  };

  // Get paginated appointments
  const getPaginatedAppointments = () => {
    const filtered = getFilteredAppointments();
    const startIndex = (currentAppointmentPage - 1) * appointmentsPerPage;
    const endIndex = startIndex + appointmentsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Get total pages for appointments
  const getTotalAppointmentPages = () => {
    const filtered = getFilteredAppointments();
    return Math.ceil(filtered.length / appointmentsPerPage);
  };

  // Filter function for consultations
  const getFilteredConsultations = () => {
    return consultations.filter((consultation) => {
      // Status filter
      if (
        consultationStatusFilter &&
        consultation.status !== consultationStatusFilter
      ) {
        return false;
      }

      // Date filter
      if (
        consultationDateFilter &&
        consultation.date !== consultationDateFilter
      ) {
        return false;
      }

      // Search filter
      if (consultationSearchFilter) {
        const searchLower = consultationSearchFilter.toLowerCase();
        const customerName = consultation.customerName?.toLowerCase() || "";
        const customerPhone = consultation.customerPhone?.toLowerCase() || "";
        const staffName = consultation.staffName?.toLowerCase() || "";

        if (
          !customerName.includes(searchLower) &&
          !customerPhone.includes(searchLower) &&
          !staffName.includes(searchLower)
        ) {
          return false;
        }
      }

      return true;
    });
  };

  // Get paginated consultations
  const getPaginatedConsultations = () => {
    const filtered = getFilteredConsultations();
    const startIndex = (currentConsultationPage - 1) * consultationsPerPage;
    const endIndex = startIndex + consultationsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  // Get total pages for consultations
  const getTotalConsultationPages = () => {
    const filtered = getFilteredConsultations();
    return Math.ceil(filtered.length / consultationsPerPage);
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
    } else if (activeTab === "consultations") {
      loadConsultations();
      loadStaff(); // Load staff data for consultation assignment
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
        showSuccess("تم تحديث الخدمة بنجاح");
      } else {
        await addService(serviceData);
        showSuccess("تم إضافة الخدمة بنجاح");
      }
      await loadServices();
    } catch (error) {
      console.error("Error submitting service:", error);
      throw error;
    }
  };

  const handleDeleteService = async (serviceId, serviceName) => {
    showConfirm(
      `هل أنت متأكد من حذف الخدمة "${serviceName}"؟\n\nتحذير: سيتم حذف الخدمة بشكل نهائي.`,
      async () => {
        try {
          await deleteService(serviceId);
          await loadServices();
          showSuccess("تم حذف الخدمة بنجاح");
        } catch (error) {
          console.error("Error deleting service:", error);
          showError("حدث خطأ أثناء حذف الخدمة");
        }
      },
      "تأكيد حذف الخدمة",
      "حذف",
      "إلغاء"
    );
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
        showSuccess("تم تحديث المنتج بنجاح");
      } else {
        await addProduct(productData);
        showSuccess("تم إضافة المنتج بنجاح");
      }
      await loadProducts();
    } catch (error) {
      console.error("Error submitting product:", error);
      throw error;
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    showConfirm(
      `هل أنت متأكد من حذف المنتج "${productName}"؟\n\nتحذير: سيتم حذف المنتج بشكل نهائي.`,
      async () => {
        try {
          await deleteProduct(productId);
          await loadProducts();
          showSuccess("تم حذف المنتج بنجاح");
        } catch (error) {
          console.error("Error deleting product:", error);
          showError("حدث خطأ أثناء حذف المنتج");
        }
      },
      "تأكيد حذف المنتج",
      "حذف",
      "إلغاء"
    );
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
          showSuccess("تم تحديث تصنيف المنتج بنجاح");
          await loadProductCategories();
        } else {
          await updateServiceCategory(editingCategory.id, categoryData);
          showSuccess("تم تحديث تصنيف الخدمة بنجاح");
          await loadServiceCategories();
        }
      } else {
        // Add new category
        if (categoryModalType === "product") {
          await addProductCategory(categoryData);
          showSuccess("تم إضافة تصنيف المنتج بنجاح");
          await loadProductCategories();
        } else {
          await addServiceCategory(categoryData);
          showSuccess("تم إضافة تصنيف الخدمة بنجاح");
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
    showConfirm(
      `هل أنت متأكد من حذف التصنيف "${categoryName}"؟\n\nتحذير: سيتم حذف التصنيف بشكل نهائي.`,
      async () => {
        try {
          if (type === "product") {
            await deleteProductCategory(categoryId);
            await loadProductCategories();
            showSuccess("تم حذف تصنيف المنتج بنجاح");
          } else {
            await deleteServiceCategory(categoryId);
            await loadServiceCategories();
            showSuccess("تم حذف تصنيف الخدمة بنجاح");
          }
        } catch (error) {
          console.error("Error deleting category:", error);
          if (error.message.includes("in use")) {
            showError(
              "لا يمكن حذف هذا التصنيف لأنه مستخدم في منتجات أو خدمات موجودة"
            );
          } else {
            showError("حدث خطأ أثناء حذف التصنيف");
          }
        }
      },
      "تأكيد حذف التصنيف",
      "حذف",
      "إلغاء"
    );
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
    showConfirm(
      `هل أنت متأكد من حذف هذا ${
        userType === "customer" ? "العميل" : "الموظف"
      }؟\n\nتحذير: سيتم حذف ${
        userType === "customer" ? "العميل" : "الموظف"
      } بشكل نهائي.`,
      async () => {
        try {
          if (userType === "customer") {
            await adminDeleteCustomer(userId);
            await loadCustomers();
          } else {
            await adminDeleteStaff(userId);
            await loadStaff();
          }
          showSuccess("تم الحذف بنجاح");
        } catch (error) {
          console.error("Error deleting user:", error);
          showError("حدث خطأ أثناء الحذف");
        }
      },
      `تأكيد حذف ${userType === "customer" ? "العميل" : "الموظف"}`,
      "حذف",
      "إلغاء"
    );
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
        showSuccess("تم التحديث بنجاح");
      } else {
        // Add new user - use authentication functions to create both auth and Firestore records
        let result;
        if (userModalType === "customer") {
          result = await adminRegisterCustomer(userData);
          await loadCustomers();
        } else {
          result = await adminRegisterStaff(userData);
          await loadStaff();
        }
        const tempPassword =
          result.tempPassword || userData.password || "TempPassword123!";
        showSuccess(
          `تم إنشاء الحساب بنجاح!\nكلمة المرور المؤقتة: ${tempPassword}\nيُرجى إعلام المستخدم بضرورة تغيير كلمة المرور عند أول تسجيل دخول.`
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

      showError(errorMessage);
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
      showSuccess("تم حفظ التغييرات بنجاح");
    } catch (error) {
      console.error("Error updating profile:", error);
      showError("حدث خطأ أثناء حفظ التغييرات");
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
      showError("يرجى اختيار ملف صورة صحيح");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError("حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت");
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

      showSuccess("تم تحديث صورة الملف الشخصي بنجاح");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      showError("حدث خطأ أثناء رفع الصورة");
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
                    activeTab === "consultations" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("consultations")}
                >
                  <i className="nav-icon fas fa-comments"></i>
                  الاستشارات
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
                              {formatFirestoreDate(
                                appointment.updatedAt,
                                "en-US"
                              )}
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
                    <select
                      className="filter-select"
                      value={appointmentStatusFilter}
                      onChange={(e) => {
                        setAppointmentStatusFilter(e.target.value);
                        setCurrentAppointmentPage(1);
                      }}
                    >
                      <option value="">جميع الحالات</option>
                      <option value="مؤكد">مؤكد</option>
                      <option value="في الانتظار">في الانتظار</option>
                      <option value="مكتمل">مكتمل</option>
                      <option value="ملغي">ملغي</option>
                    </select>
                    <input
                      type="date"
                      className="filter-date"
                      value={appointmentDateFilter}
                      onChange={(e) => {
                        setAppointmentDateFilter(e.target.value);
                        setCurrentAppointmentPage(1);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="بحث بالاسم..."
                      className="filter-search"
                      value={appointmentSearchFilter}
                      onChange={(e) => {
                        setAppointmentSearchFilter(e.target.value);
                        setCurrentAppointmentPage(1);
                      }}
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
                          <th>ملاحظات العميل</th>
                          <th>ملاحظات الموظف</th>
                          <th>الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedAppointments().length === 0 ? (
                          <tr>
                            <td colSpan="9" className="empty-state-cell">
                              <div className="empty-state">
                                <i className="fas fa-calendar-alt"></i>
                                <p>لا يوجد مواعيد مطابقة لمعايير البحث</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          getPaginatedAppointments().map((appointment) => (
                            <tr key={appointment.id}>
                              <td>
                                <div className="admin-customer-info">
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
                                <div className="notes-cell">
                                  {appointment.customerNote ? (
                                    <span title={appointment.customerNote}>
                                      {appointment.customerNote.length > 30
                                        ? `${appointment.customerNote.substring(
                                            0,
                                            30
                                          )}...`
                                        : appointment.customerNote}
                                    </span>
                                  ) : (
                                    <span className="no-notes">-</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="notes-cell">
                                  {appointment.staffNote ? (
                                    <span title={appointment.staffNote}>
                                      {appointment.staffNote.length > 30
                                        ? `${appointment.staffNote.substring(
                                            0,
                                            30
                                          )}...`
                                        : appointment.staffNote}
                                    </span>
                                  ) : (
                                    <span className="no-notes">-</span>
                                  )}
                                </div>
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
                                  <button
                                    className="action-btn view"
                                    onClick={() =>
                                      handleViewAppointmentDetails(appointment)
                                    }
                                  >
                                    عرض
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
                  {getTotalAppointmentPages() > 1 && (
                    <div className="pagination">
                      <button
                        className="pagination-btn"
                        onClick={() =>
                          setCurrentAppointmentPage(currentAppointmentPage - 1)
                        }
                        disabled={currentAppointmentPage === 1}
                      >
                        السابق
                      </button>
                      <div className="pagination-info">
                        <span>
                          صفحة {currentAppointmentPage} من{" "}
                          {getTotalAppointmentPages()}
                        </span>
                        <span className="results-count">
                          ({getFilteredAppointments().length} موعد)
                        </span>
                      </div>
                      <button
                        className="pagination-btn"
                        onClick={() =>
                          setCurrentAppointmentPage(currentAppointmentPage + 1)
                        }
                        disabled={
                          currentAppointmentPage === getTotalAppointmentPages()
                        }
                      >
                        التالي
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Consultations Tab */}
              {activeTab === "consultations" && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>إدارة الاستشارات</h2>
                  </div>

                  {/* Consultation Filters */}
                  <div className="appointments-filters">
                    <select
                      className="filter-select"
                      value={consultationStatusFilter}
                      onChange={(e) => {
                        setConsultationStatusFilter(e.target.value);
                        setCurrentConsultationPage(1);
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
                      className="filter-date"
                      value={consultationDateFilter}
                      onChange={(e) => {
                        setConsultationDateFilter(e.target.value);
                        setCurrentConsultationPage(1);
                      }}
                    />

                    <input
                      type="text"
                      placeholder="البحث بالاسم أو رقم الهاتف..."
                      className="filter-search"
                      value={consultationSearchFilter}
                      onChange={(e) => {
                        setConsultationSearchFilter(e.target.value);
                        setCurrentConsultationPage(1);
                      }}
                    />
                  </div>

                  {loading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>جاري تحميل بيانات الاستشارات...</p>
                    </div>
                  ) : error ? (
                    <div className="error-state">
                      <i className="fas fa-exclamation-triangle"></i>
                      <p>{error}</p>
                      <button
                        onClick={loadConsultations}
                        className="btn-primary"
                      >
                        إعادة المحاولة
                      </button>
                    </div>
                  ) : getFilteredConsultations().length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-comments"></i>
                      <p>لا توجد استشارات حالياً</p>
                    </div>
                  ) : (
                    <>
                      <div className="appointments-table">
                        <table>
                          <thead>
                            <tr>
                              <th>اسم العميلة</th>
                              <th>رقم الهاتف</th>
                              <th>التاريخ</th>
                              <th>الحالة</th>
                              <th>الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getPaginatedConsultations().map((consultation) => (
                              <tr key={consultation.id}>
                                <td>{consultation.customerName}</td>
                                <td>{consultation.customerPhone}</td>
                                <td>{consultation.date}</td>
                                <td>
                                  <span
                                    className={`status-badge ${getStatusColor(
                                      consultation.status
                                    )}`}
                                  >
                                    {consultation.status}
                                  </span>
                                </td>
                                <td>
                                  <div className="action-buttons">
                                    <button
                                      className="action-btn view"
                                      onClick={() => {
                                        setConsultationToView(consultation);
                                        setIsConsultationDetailsModalOpen(true);
                                      }}
                                      title="عرض التفاصيل"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    {consultation.status === "في الانتظار" && (
                                      <button
                                        className="action-btn confirm"
                                        onClick={() =>
                                          handleConfirmConsultation(
                                            consultation.id
                                          )
                                        }
                                        title="تأكيد"
                                      >
                                        <i className="fas fa-check"></i>
                                      </button>
                                    )}
                                    <button
                                      className="action-btn delete"
                                      onClick={() =>
                                        handleDeleteConsultation(
                                          consultation.id,
                                          consultation.customerName
                                        )
                                      }
                                      title="حذف"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {getTotalConsultationPages() > 1 && (
                        <div className="pagination">
                          <button
                            onClick={() =>
                              setCurrentConsultationPage((prev) =>
                                Math.max(prev - 1, 1)
                              )
                            }
                            disabled={currentConsultationPage === 1}
                            className="pagination-btn"
                          >
                            السابق
                          </button>
                          <span className="pagination-info">
                            صفحة {currentConsultationPage} من{" "}
                            {getTotalConsultationPages()}
                          </span>
                          <button
                            onClick={() =>
                              setCurrentConsultationPage((prev) =>
                                Math.min(prev + 1, getTotalConsultationPages())
                              )
                            }
                            disabled={
                              currentConsultationPage ===
                              getTotalConsultationPages()
                            }
                            className="pagination-btn"
                          >
                            التالي
                          </button>
                        </div>
                      )}
                    </>
                  )}
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

                  {/* Customer Filters */}
                  <div className="customers-filters">
                    <input
                      type="text"
                      placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
                      className="filter-search"
                      value={customerSearchFilter}
                      onChange={(e) => {
                        setCustomerSearchFilter(e.target.value);
                        setCurrentCustomerPage(1);
                      }}
                    />
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
                  ) : getFilteredCustomers().length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-users"></i>
                      <p>لا يوجد عملاء مطابقين لمعايير البحث</p>
                    </div>
                  ) : (
                    <>
                      <div className="customers-grid">
                        {getPaginatedCustomers().map((customer) => (
                          <div key={customer.id} className="customer-card">
                            <div className="customer-header">
                              <img
                                src={
                                  customer.avatar ||
                                  "/assets/default-avatar.jpg"
                                }
                                alt={customer.name}
                                onError={(e) => {
                                  e.target.src = "/assets/default-avatar.jpg";
                                }}
                              />
                              <div className="admin-customer-info">
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

                      {/* Pagination Controls */}
                      {getTotalCustomerPages() > 1 && (
                        <div className="pagination">
                          <button
                            className="pagination-btn"
                            onClick={() =>
                              setCurrentCustomerPage(currentCustomerPage - 1)
                            }
                            disabled={currentCustomerPage === 1}
                          >
                            السابق
                          </button>
                          <div className="pagination-info">
                            <span>
                              صفحة {currentCustomerPage} من{" "}
                              {getTotalCustomerPages()}
                            </span>
                            <span className="results-count">
                              ({getFilteredCustomers().length} عميل)
                            </span>
                          </div>
                          <button
                            className="pagination-btn"
                            onClick={() =>
                              setCurrentCustomerPage(currentCustomerPage + 1)
                            }
                            disabled={
                              currentCustomerPage === getTotalCustomerPages()
                            }
                          >
                            التالي
                          </button>
                        </div>
                      )}
                    </>
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

                  {/* Staff Filters */}
                  <div className="staff-filters">
                    <input
                      type="text"
                      placeholder="البحث بالاسم أو التخصص..."
                      className="filter-search"
                      value={staffSearchFilter}
                      onChange={(e) => {
                        setStaffSearchFilter(e.target.value);
                        setCurrentStaffPage(1);
                      }}
                    />
                    <select
                      className="filter-select"
                      value={staffStatusFilter}
                      onChange={(e) => {
                        setStaffStatusFilter(e.target.value);
                        setCurrentStaffPage(1);
                      }}
                    >
                      <option value="">جميع الحالات</option>
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                    </select>
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
                  ) : getFilteredStaff().length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-user-tie"></i>
                      <p>لا يوجد موظفين مطابقين لمعايير البحث</p>
                    </div>
                  ) : (
                    <>
                      <div className="staff-grid">
                        {getPaginatedStaff().map((staffMember) => {
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

                      {/* Pagination Controls */}
                      {getTotalStaffPages() > 1 && (
                        <div className="pagination">
                          <button
                            className="pagination-btn"
                            onClick={() =>
                              setCurrentStaffPage(currentStaffPage - 1)
                            }
                            disabled={currentStaffPage === 1}
                          >
                            السابق
                          </button>
                          <div className="pagination-info">
                            <span>
                              صفحة {currentStaffPage} من {getTotalStaffPages()}
                            </span>
                            <span className="results-count">
                              ({getFilteredStaff().length} موظف)
                            </span>
                          </div>
                          <button
                            className="pagination-btn"
                            onClick={() =>
                              setCurrentStaffPage(currentStaffPage + 1)
                            }
                            disabled={currentStaffPage === getTotalStaffPages()}
                          >
                            التالي
                          </button>
                        </div>
                      )}
                    </>
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

                  {/* Services Filters */}
                  <div className="services-filters">
                    <select
                      className="filter-select"
                      value={serviceCategoryFilter}
                      onChange={(e) => {
                        setServiceCategoryFilter(e.target.value);
                        setCurrentServicePage(1);
                      }}
                    >
                      <option value="">جميع الفئات</option>
                      {serviceCategories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="filter-search"
                      placeholder="البحث بالاسم..."
                      value={serviceSearchFilter}
                      onChange={(e) => {
                        setServiceSearchFilter(e.target.value);
                        setCurrentServicePage(1);
                      }}
                    />
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
                        {getPaginatedServices().map((service) => (
                          <tr key={service.id}>
                            <td>{service.name}</td>
                            <td>{service.categoryName}</td>
                            <td>{formatPrice(service.price)}</td>
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

                    {/* Services Pagination */}
                    {getTotalServicePages() > 1 && (
                      <div className="pagination">
                        <button
                          className="pagination-btn"
                          onClick={() =>
                            setCurrentServicePage(currentServicePage - 1)
                          }
                          disabled={currentServicePage === 1}
                        >
                          السابق
                        </button>

                        <div className="pagination-info">
                          <span>
                            صفحة {currentServicePage} من{" "}
                            {getTotalServicePages()}
                          </span>
                          <span className="results-count">
                            ({getFilteredServices().length} خدمة)
                          </span>
                        </div>

                        <button
                          className="pagination-btn"
                          onClick={() =>
                            setCurrentServicePage(currentServicePage + 1)
                          }
                          disabled={
                            currentServicePage === getTotalServicePages()
                          }
                        >
                          التالي
                        </button>
                      </div>
                    )}
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

                  {/* Products Filters */}
                  <div className="products-filters">
                    <select
                      className="filter-select"
                      value={productCategoryFilter}
                      onChange={(e) => {
                        setProductCategoryFilter(e.target.value);
                        setCurrentProductPage(1);
                      }}
                    >
                      <option value="">جميع الفئات</option>
                      {productCategories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="filter-select"
                      value={productStatusFilter}
                      onChange={(e) => {
                        setProductStatusFilter(e.target.value);
                        setCurrentProductPage(1);
                      }}
                    >
                      <option value="">جميع الحالات</option>
                      <option value="available">متوفر</option>
                      <option value="out_of_stock">نفذ</option>
                    </select>
                    <input
                      type="text"
                      className="filter-search"
                      placeholder="البحث بالاسم..."
                      value={productSearchFilter}
                      onChange={(e) => {
                        setProductSearchFilter(e.target.value);
                        setCurrentProductPage(1);
                      }}
                    />
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
                          {getPaginatedProducts().map((product) => (
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

                      {/* Products Pagination */}
                      {getTotalProductPages() > 1 && (
                        <div className="pagination">
                          <button
                            className="pagination-btn"
                            onClick={() =>
                              setCurrentProductPage(currentProductPage - 1)
                            }
                            disabled={currentProductPage === 1}
                          >
                            السابق
                          </button>

                          <div className="pagination-info">
                            <span>
                              صفحة {currentProductPage} من{" "}
                              {getTotalProductPages()}
                            </span>
                            <span className="results-count">
                              ({getFilteredProducts().length} منتج)
                            </span>
                          </div>

                          <button
                            className="pagination-btn"
                            onClick={() =>
                              setCurrentProductPage(currentProductPage + 1)
                            }
                            disabled={
                              currentProductPage === getTotalProductPages()
                            }
                          >
                            التالي
                          </button>
                        </div>
                      )}
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
                                  {formatFirestoreDate(
                                    category.createdAt,
                                    "ar-EG"
                                  )}
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
                                  {formatFirestoreDate(
                                    category.createdAt,
                                    "ar-EG"
                                  )}
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

                    {/* <div className="settings-section">
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
                    </div> */}

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

      {/* Appointment Details Modal */}
      {isDetailsModalOpen && appointmentToView && (
        <AppointmentDetailsModal
          isOpen={isDetailsModalOpen}
          appointment={appointmentToView}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setAppointmentToView(null);
          }}
        />
      )}

      {/* Consultation Details Modal */}
      {isConsultationDetailsModalOpen && consultationToView && (
        <ConsultationDetailsModal
          consultation={consultationToView}
          onClose={() => {
            setIsConsultationDetailsModalOpen(false);
            setConsultationToView(null);
          }}
        />
      )}

      {/* Custom Modal */}
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

export default AdminDashboardPage;
