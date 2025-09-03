import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Customer Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Products from "./pages/Products";
import FAQ from "./pages/FAQ";
import Account from "./pages/Account";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBookings from "./pages/admin/Bookings";
import AdminServices from "./pages/admin/Services";
import AdminRooms from "./pages/admin/Rooms";
import AdminStaff from "./pages/admin/Staff";
import AdminProducts from "./pages/admin/Products";
import AdminDiscounts from "./pages/admin/Discounts";
import AdminFAQ from "./pages/admin/FAQ";
import AdminFeedback from "./pages/admin/Feedback";
import AdminSettings from "./pages/admin/Settings";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-luxury">
        <Header />
        <main className="min-h-screen">
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/products" element={<Products />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/account/*" element={<Account />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/staff" element={<AdminStaff />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/discounts" element={<AdminDiscounts />} />
            <Route path="/admin/faq" element={<AdminFAQ />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
