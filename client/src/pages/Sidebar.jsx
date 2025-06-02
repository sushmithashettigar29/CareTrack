import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaFileMedical,
  FaSignOutAlt,
  FaCalendarAlt,
  FaRegCalendarCheck,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <aside className="h-full   w-64 bg-white shadow-md  fixed flex flex-col justify-between">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">CareTrack</h1>

        <nav className="space-y-4 text-gray-700 text-base">
          <Link
            to="/overview"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100"
          >
            <FaHome /> Overview
          </Link>
          <Link
            to="/appointments"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100"
          >
            <FaCalendarAlt /> Appointments
          </Link>
          <Link
            to="/get-appointment"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100"
          >
            <FaRegCalendarCheck /> Get Appointment
          </Link>
          <Link
            to="/doctors"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100"
          >
            <FaUserMd /> Doctors
          </Link>
          <Link
            to="/medical-records"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100"
          >
            <FaFileMedical /> Medical Records
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 rounded-lg text-red-600 hover:bg-red-100 w-full text-left"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
