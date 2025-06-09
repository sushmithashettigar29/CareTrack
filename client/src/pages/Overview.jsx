import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  FaCalendarCheck,
  FaFileMedical,
  FaUserMd,
  FaUserInjured,
  FaUserCheck,
  FaUserClock,
  FaNotesMedical,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaUserTag,
  FaStethoscope,
  FaPlusCircle,
} from "react-icons/fa";

function Overview() {
  const user = useMemo(() => {
    return (
      JSON.parse(localStorage.getItem("userInfo")) || {
        name: "User",
        role: "Unknown",
      }
    );
  }, []);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = user.token;
        let endpoint = "";

        if (user.role === "Patient")
          endpoint = "http://localhost:5000/api/dashboard/patient";
        else if (user.role === "Doctor")
          endpoint = "http://localhost:5000/api/dashboard/doctor";
        else if (user.role === "Admin")
          endpoint = "http://localhost:5000/api/dashboard/admin";
        else {
          setError("Invalid role or user not logged in.");
          return;
        }

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard. Please try again later.");
      }
    };

    fetchDashboard();
  }, [user]);

  const getPercent = (value, max) => {
    if (!value || !max || max === 0) return 0;
    return Math.min(100, Math.round((value / max) * 100));
  };

  const adminMaxDoctors = Math.max(100, data?.totalDoctors || 0);
  const adminMaxPending = Math.max(20, data?.pendingDoctorApprovals || 0);
  const adminMaxPatients = Math.max(150, data?.totalPatients || 0);
  const adminMaxRecords = Math.max(300, data?.totalMedicalRecords || 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6  rounded-lg w-full h-full">
        {error ? (
          <p className="text-red-600 font-medium">{error}</p>
        ) : !data ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Dashboard Overview
              </h1>
            </div>

            <div className="white-bg shadow rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 sm:w-29 sm:h-29 rounded-full overflow-hidden shadow-md border-2 border-gray-300 flex-shrink-0 mr-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=006a71&color=f2efe7`}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 w-full mt-4 sm:flex">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <FaUser className="text-blue-600 flex-shrink-0" />
                      <span className="text-center sm:text-left">
                        <strong>Name:</strong> {user.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <FaEnvelope className="text-purple-600 flex-shrink-0" />
                      <span className="text-center sm:text-left break-all">
                        <strong>Email:</strong> {user.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <FaPhone className="text-green-600 flex-shrink-0" />
                      <span className="text-center sm:text-left">
                        <strong>Phone:</strong> {user.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <FaBirthdayCake className="text-yellow-600 flex-shrink-0" />
                      <span className="text-center sm:text-left">
                        <strong>Age:</strong> {user.age || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <FaVenusMars className="text-pink-600 flex-shrink-0" />
                      <span className="text-center sm:text-left">
                        <strong>Gender:</strong> {user.gender || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <FaUserTag className="text-indigo-600 flex-shrink-0" />
                      <span className="text-center sm:text-left">
                        <strong>Role:</strong> {user.role}
                      </span>
                    </div>
                    {user.role === "Doctor" && (
                      <div className="flex items-center gap-2 justify-center sm:justify-start sm:col-span-2">
                        <FaStethoscope className="text-red-600 flex-shrink-0" />
                        <span className="text-center sm:text-left">
                          <strong>Specialization:</strong>{" "}
                          {user.specialization || "N/A"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
                <Link
                  href="/appointments"
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <FaCalendarCheck />
                  <span>Appointments</span>
                </Link>

                <Link
                  href="/medical-records"
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  <FaFileMedical />
                  <span>Medical Records</span>
                </Link>

                <Link
                  href="/get-appointment"
                  className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
                >
                  <FaPlusCircle />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4 pb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Statistics
              </h2>

              {/* PATIENT STATS */}
              {user.role === "Patient" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3">
                      <CircularProgressbar
                        value={getPercent(data.appointmentCount, 20)}
                        text={`${data.appointmentCount || 0}`}
                        styles={buildStyles({
                          pathColor: "#2563eb",
                          textColor: "#1e40af",
                          trailColor: "#bfdbfe",
                          textSize: "20px",
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm sm:text-base">
                      <FaCalendarCheck />
                      <span>Appointments</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 sm:p-6 rounded-lg text-center flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3">
                      <CircularProgressbar
                        value={getPercent(data.medicalRecordCount, 50)}
                        text={`${data.medicalRecordCount || 0}`}
                        styles={buildStyles({
                          pathColor: "#16a34a",
                          textColor: "#166534",
                          trailColor: "#bbf7d0",
                          textSize: "20px",
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-green-800 font-semibold text-sm sm:text-base">
                      <FaFileMedical />
                      <span>Medical Records</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DOCTOR STATS */}
              {user.role === "Doctor" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-yellow-50 p-4 sm:p-6 rounded-lg text-center flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3">
                      <CircularProgressbar
                        value={getPercent(data.totalAppointments, 50)}
                        text={`${data.totalAppointments || 0}`}
                        styles={buildStyles({
                          pathColor: "#ca8a04",
                          textColor: "#854d0e",
                          trailColor: "#fde68a",
                          textSize: "20px",
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-yellow-800 font-semibold text-sm sm:text-base">
                      <FaCalendarCheck />
                      <span>Total Appointments</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3">
                      <CircularProgressbar
                        value={getPercent(
                          data.Confirmed,
                          data.totalAppointments
                        )}
                        text={`${data.Confirmed || 0}`}
                        styles={buildStyles({
                          pathColor: "#2563eb",
                          textColor: "#1e40af",
                          trailColor: "#bfdbfe",
                          textSize: "20px",
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm sm:text-base">
                      <FaUserCheck />
                      <span>Confirmed</span>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 sm:p-6 rounded-lg text-center flex flex-col items-center sm:col-span-2 lg:col-span-1">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3">
                      <CircularProgressbar
                        value={getPercent(
                          data.Cancelled,
                          data.totalAppointments
                        )}
                        text={`${data.Cancelled || 0}`}
                        styles={buildStyles({
                          pathColor: "#dc2626",
                          textColor: "#991b1b",
                          trailColor: "#fecaca",
                          textSize: "20px",
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-red-800 font-semibold text-sm sm:text-base">
                      <FaUserClock />
                      <span>Cancelled</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ADMIN STATS */}
              {user.role === "Admin" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3">
                      <CircularProgressbar
                        value={getPercent(data.totalDoctors, adminMaxDoctors)}
                        text={`${data.totalDoctors || 0}`}
                        styles={buildStyles({
                          pathColor: "#2563eb",
                          textColor: "#1e40af",
                          trailColor: "#bfdbfe",
                          textSize: "18px",
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs sm:text-sm text-center">
                      <FaUserMd />
                      <span>Approved Doctors</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 sm:p-6 rounded-lg text-center flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3">
                      <CircularProgressbar
                        value={getPercent(
                          data.pendingDoctorApprovals,
                          adminMaxPending
                        )}
                        text={`${data.pendingDoctorApprovals || 0}`}
                        styles={buildStyles({
                          pathColor: "#ca8a04",
                          textColor: "#854d0e",
                          trailColor: "#fde68a",
                          textSize: "18px",
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-yellow-800 font-semibold text-xs sm:text-sm text-center">
                      <FaUserClock />
                      <span>Pending Approvals</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 sm:p-6 rounded-lg text-center flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3">
                      <CircularProgressbar
                        value={getPercent(data.totalPatients, adminMaxPatients)}
                        text={`${data.totalPatients || 0}`}
                        styles={buildStyles({
                          pathColor: "#16a34a",
                          textColor: "#166534",
                          trailColor: "#bbf7d0",
                          textSize: "18px",
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-green-800 font-semibold text-xs sm:text-sm text-center">
                      <FaUserInjured />
                      <span>Patients</span>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 sm:p-6 rounded-lg text-center flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3">
                      <CircularProgressbar
                        value={getPercent(
                          data.totalMedicalRecords,
                          adminMaxRecords
                        )}
                        text={`${data.totalMedicalRecords || 0}`}
                        styles={buildStyles({
                          pathColor: "#7c3aed",
                          textColor: "#5b21b6",
                          trailColor: "#ddd6fe",
                          textSize: "18px",
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-purple-800 font-semibold text-xs sm:text-sm text-center">
                      <FaNotesMedical />
                      <span>Medical Records</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Overview;
