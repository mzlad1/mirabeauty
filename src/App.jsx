import React, { useState, useEffect } from "react";
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
import BookingPage from "./pages/BookingPage";
import FAQPage from "./pages/FAQPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";

// Import Components
import Navigation from "./components/common/Navigation";
import Footer from "./components/common/Footer";

// Import Sample Data
import { sampleUsers } from "./data/sampleUsers";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Protected route component for dashboard
  const ProtectedDashboard = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }

    if (currentUser.role === "admin") {
      return <AdminDashboardPage currentUser={currentUser} />;
    } else if (currentUser.role === "staff") {
      return <StaffDashboardPage currentUser={currentUser} />;
    } else {
      return <Navigate to="/" replace />;
    }
  };

  // Protected route component for profile
  const ProtectedProfile = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return (
      <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />
    );
  };

  return (
    <Router>
      <div className="App" dir="rtl">
        <Navigation currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route
              path="/book"
              element={<BookingPage currentUser={currentUser} />}
            />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/profile" element={<ProtectedProfile />} />
            <Route
              path="/login"
              element={<LoginPage setCurrentUser={setCurrentUser} />}
            />
            <Route
              path="/register"
              element={<RegisterPage setCurrentUser={setCurrentUser} />}
            />
            <Route path="/dashboard" element={<ProtectedDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
