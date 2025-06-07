import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Overview from "./pages/Overview";
import AppointmentsPage from "./pages/AppointmentsPage";
import MedicalRecordsPage from "./pages/MedicalRecordsPage";
import DoctorsPage from "./pages/DoctorsPage";
import GetAppointment from "./pages/GetAppointment";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/medical-records" element={<MedicalRecordsPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/get-appointment" element={<GetAppointment />} />
    </Routes>
  );
}

export default App;
