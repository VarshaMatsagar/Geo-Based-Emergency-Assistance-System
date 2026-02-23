import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AboutUs from "./Components/AboutUs";
import ContactUs from "./Components/ContactUs";
import LoginModal from "./Components/LoginModal";
import Register from "./pages/Register";
import Dashboard from "./Components/Dashboard";
import CitizenDashboard from "./Components/CitizenDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import PoliceDashboard from "./pages/police/PoliceDashboard";
import PoliceEmergencyDetail from "./pages/police/PoliceEmergencyDetail";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import HospitalEmergencyDetail from "./pages/hospital/HospitalEmergencyDetail";
import HospitalProtectedRoute from "./Components/HospitalProtectedRoute";
import AdminDashboard from "./Components/AdminDashboard";
import AddUser from "./Components/AddUser";
import EditUser from "./Components/EditUser";
import AdminLayout from "./Components/AdminLayout";

function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/citizen_Landing" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />

            <Route path="/citizen" element={
              <ProtectedRoute>
                <CitizenDashboard />
              </ProtectedRoute>
            } />
            <Route path="/police" element={
                <PoliceDashboard />
              
            } />
            <Route path="/police/emergency/:id" element={
              <ProtectedRoute>
                <PoliceEmergencyDetail />
              </ProtectedRoute>
            } />
            <Route path="/hospital" element={
              <HospitalProtectedRoute>
                <HospitalDashboard />
              </HospitalProtectedRoute>
            } />
            <Route path="/hospital/emergency/:id" element={
              <HospitalProtectedRoute>
                <HospitalEmergencyDetail />
              </HospitalProtectedRoute>
            } />
            <Route path="/login" element={<LoginModal />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
            
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
