import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Import Pages
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import BookingPage from "./pages/BookingPage";
import FAQPage from "./pages/FAQPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import CartPage from "./pages/CartPage";

// Import Components
import Navigation from "./components/common/Navigation";
import Footer from "./components/common/Footer";

// Import Auth Hook and Provider
import { useAuth, AuthProvider } from "./hooks/useAuth.jsx";

// Main App Content Component
const AppContent = () => {
  const { currentUser, userData, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="App" dir="rtl">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "18px",
          }}
        >
          جاري التحميل...
        </div>
      </div>
    );
  }

  // Protected route component for dashboard
  const ProtectedDashboard = () => {
    if (!currentUser || !userData) {
      return <Navigate to="/login" replace />;
    }

    if (userData.role === "admin") {
      return (
        <AdminDashboardPage currentUser={currentUser} userData={userData} />
      );
    } else if (userData.role === "staff") {
      return (
        <StaffDashboardPage currentUser={currentUser} userData={userData} />
      );
    } else {
      return <Navigate to="/" replace />;
    }
  };

  // Protected route component for profile
  const ProtectedProfile = () => {
    if (!currentUser || !userData) {
      return <Navigate to="/login" replace />;
    }
    return <ProfilePage currentUser={currentUser} userData={userData} />;
  };

  return (
    <Router>
      <div className="App" dir="rtl">
        <Navigation currentUser={currentUser} userData={userData} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/book"
              element={
                <BookingPage currentUser={currentUser} userData={userData} />
              }
            />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/profile" element={<ProtectedProfile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<ProtectedDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

// Main App Component with Auth Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
