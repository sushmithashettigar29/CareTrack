import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorWaiting from "./pages/DoctorWaiting";
import Overview from "./pages/Overview";
import AppointmentsPage from "./pages/AppointmentsPage";
import MedicalRecordsPage from "./pages/MedicalRecordsPage";
import DoctorsPage from "./pages/DoctorsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      <Route path="/patient-dashboard" element={<PatientDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/doctor-waiting" element={<DoctorWaiting />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/medical-records" element={<MedicalRecordsPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
    </Routes>
  );
}

export default App;
