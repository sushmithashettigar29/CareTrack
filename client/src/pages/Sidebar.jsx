import React from "react";
import {
  FaHome,
  FaUserMd,
  FaFileMedical,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaCalendarAlt,
} from "react-icons/fa";

function Sidebar() {
  return (
  <aside className="h-[95vh] mt-4 ml-4 w-64 bg-white border shadow-md rounded-2xl fixed flex flex-col justify-between">

      {/* Top Branding & Nav */}
      <div className="p-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600 mb-8">CareTrack</h1>

        {/* Navigation */}
        <nav className="space-y-4 text-gray-700 text-base">
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100"
          >
            <FaHome /> Overview
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100"
          >
            <FaCalendarAlt /> Appointments
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100"
          >
            <FaUserMd /> Doctors
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100"
          >
            <FaFileMedical /> Medical Records
          </a>
          {/* <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 relative"
          >
            <FaComments /> Chats
            <span className="absolute right-3 top-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
              10
            </span>
          </a> */}

          {/* <div className="pt-6 border-t text-sm text-gray-500 uppercase">
            Account
          </div> */}
          {/* 
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100"
          >
            <FaCog /> Settings
          </a> */}
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg text-red-600 hover:bg-red-100"
          >
            <FaSignOutAlt /> Logout
          </a>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
