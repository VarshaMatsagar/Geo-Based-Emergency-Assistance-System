import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AboutUs from "./Components/AboutUs";
import ContactUs from "./Components/ContactUs";
import LoginModal from "./Components/LoginModal";
import Register from "./pages/Register";
import OtpVerification from "./Components/OtpVerification";
import Dashboard from "./Components/Dashboard";
import CitizenDashboard from "./Components/CitizenDashboard";
import LandingPage from "./Components/LandingPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import PoliceDashboard from "./pages/police/PoliceDashboard";
import PoliceEmergencyDetail from "./pages/police/PoliceEmergencyDetail";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import HospitalEmergencyDetail from "./pages/hospital/HospitalEmergencyDetail";
import AdminDashboard from "./Components/AdminDashboard";
import AddUser from "./Components/AddUser";
import EditUser from "./Components/EditUser";
import AdminLayout from "./Components/AdminLayout";
import FeedbackForm from "./Components/FeedbackForm";
import AdminContactList from "./Components/AdminContactList";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="main-content flex-grow-1">
          <Routes>
            <Route path="/citizen_Landing" element={<LandingPage />} />
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/citizen"
              element={
                <ProtectedRoute role="CITIZEN">
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/police"
              element={
                <ProtectedRoute role="POLICE">
                  <PoliceDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/police/emergency/:id"
              element={
                <ProtectedRoute role="POLICE">
                  <PoliceEmergencyDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hospital"
              element={
                <ProtectedRoute role="HOSPITAL">
                  <HospitalDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hospital/emergency/:id"
              element={
                <ProtectedRoute role="HOSPITAL">
                  <HospitalEmergencyDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute role="CITIZEN">
                  <FeedbackForm />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<LoginModal />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/admin/contacts" element={<AdminContactList />} />

            {/* ===== ADMIN ROUTES (NO NAVBAR / FOOTER) ===== */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="add-user" element={<AddUser />} />
              <Route path="edit-user/:id" element={<EditUser />} />
            </Route>
          </Routes>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;