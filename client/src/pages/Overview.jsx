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
      <div className="space-y-6 p-6 bg-white rounded-lg shadow w-full h-full">
        {error ? (
          <p className="text-red-600 font-medium">{error}</p>
        ) : !data ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold sm:mb-2 dark-color border-b-5 pb-2 sm:text-3xl">
              Overview
            </h2>

            <div className=" flex-col sm:gap-6 gap-1 sm:p-6 hidden sm:block m-0">
              <div className="flex sm:items-center gap-6 border-b-5 light-color pb-6">
                <div className="sm:w-36 sm:h-36 rounded-full  overflow-hidden shadow border-2 border-gray-300 lg:mr-10">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=006a71&color=f2efe7`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid sm:grid-cols-2 sm:gap-5 dark-color">
                  <div className="flex items-center gap-2 text-sm lg:text-lg ">
                    <FaUser className="text-blue-600" />
                    <span>
                      <strong>Name:</strong> {user.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm lg:text-lg ">
                    <FaEnvelope className="text-purple-600" />
                    <span>
                      <strong>Email:</strong> {user.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm lg:text-lg ">
                    <FaPhone className="text-green-600" />
                    <span>
                      <strong>Phone:</strong> {user.phone || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm lg:text-lg ">
                    <FaBirthdayCake className="text-yellow-600" />
                    <span>
                      <strong>Age:</strong> {user.age || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm lg:text-lg ">
                    <FaVenusMars className="text-pink-600" />
                    <span>
                      <strong>Gender:</strong> {user.gender || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm lg:text-lg ">
                    <FaUserTag className="text-indigo-600" />
                    <span>
                      <strong>Role:</strong> {user.role}
                    </span>
                  </div>
                  {user.role === "Doctor" && (
                    <div className="flex items-center gap-3 text-sm lg:text-lg  col-span-2">
                      <FaStethoscope className="text-red-600" />
                      <span>
                        <strong>Specialization:</strong>{" "}
                        {user.specialization || "N/A"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-1 sm:gap-4 sm:pt-3 justify-center">
                <Link
                  to="/appointments"
                  className="flex items-center  gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <FaCalendarCheck />
                  <span>Appointments</span>
                </Link>

                <Link
                  to="/medical-records"
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <FaFileMedical />
                  <span>Records</span>
                </Link>

                <Link
                  to="/get-appointment"
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  <FaPlusCircle />
                  <span>Book Now</span>
                </Link>
              </div>
            </div>

            {/* PATIENT */}
            {user.role === "Patient" && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-blue-100 p-6 rounded-lg text-center flex flex-col items-center">
                    <div className="w-24 h-24 mb-3">
                      <CircularProgressbar
                        value={getPercent(data.appointmentCount, 20)}
                        text={`${data.appointmentCount || 0}`}
                        styles={buildStyles({
                          pathColor: "#2563eb",
                          textColor: "#1e40af",
                          trailColor: "#bfdbfe",
                          textSize: "24px",
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-blue-800 font-semibold">
                      <FaCalendarCheck />
                      <span>Appointments</span>
                    </div>
                  </div>

                  <div className="bg-green-100 p-6 rounded-lg text-center flex flex-col items-center">
                    <div className="w-24 h-24 mb-3">
                      <CircularProgressbar
                        value={getPercent(data.medicalRecordCount, 50)}
                        text={`${data.medicalRecordCount || 0}`}
                        styles={buildStyles({
                          pathColor: "#16a34a",
                          textColor: "#166534",
                          trailColor: "#bbf7d0",
                          textSize: "24px",
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-green-800 font-semibold">
                      <FaFileMedical />
                      <span>Medical Records</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* DOCTOR */}
            {user.role === "Doctor" && (
              <div className="grid sm:grid-cols-3 sm:gap-6 grid-cols-1 gap-3">
                <div className="bg-yellow-100 p-3 sm:p-6 rounded-lg text-center flex flex-col items-center">
                  <div className="w-24 h-24 mb-3">
                    <CircularProgressbar
                      value={getPercent(data.totalAppointments, 50)}
                      text={`${data.totalAppointments || 0}`}
                      styles={buildStyles({
                        pathColor: "#ca8a04",
                        textColor: "#854d0e",
                        trailColor: "#fde68a",
                        textSize: "24px",
                      })}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-yellow-800 font-semibold">
                    <FaCalendarCheck />
                    <span>Total Appointments</span>
                  </div>
                </div>

                <div className="bg-blue-100 p-3 sm:p-6 rounded-lg text-center flex flex-col items-center">
                  <div className="w-24 h-24 mb-3">
                    <CircularProgressbar
                      value={getPercent(data.Confirmed, data.totalAppointments)}
                      text={`${data.Confirmed || 0}`}
                      styles={buildStyles({
                        pathColor: "#2563eb",
                        textColor: "#1e40af",
                        trailColor: "#bfdbfe",
                        textSize: "24px",
                      })}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 font-semibold">
                    <FaUserCheck />
                    <span>Confirmed</span>
                  </div>
                </div>

                <div className="bg-red-100 p-3 sm:p-6 rounded-lg text-center flex flex-col items-center">
                  <div className="w-24 h-24 mb-3">
                    <CircularProgressbar
                      value={getPercent(data.Cancelled, data.totalAppointments)}
                      text={`${data.Cancelled || 0}`}
                      styles={buildStyles({
                        pathColor: "#dc2626",
                        textColor: "#991b1b",
                        trailColor: "#fecaca",
                        textSize: "24px",
                      })}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-red-800 font-semibold">
                    <FaUserClock />
                    <span>Cancelled</span>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN */}
            {user.role === "Admin" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-blue-100 p-6 rounded-lg text-center flex flex-col items-center">
                  <div className="w-24 h-24 mb-3">
                    <CircularProgressbar
                      value={getPercent(data.totalDoctors, adminMaxDoctors)}
                      text={`${data.totalDoctors || 0}`}
                      styles={buildStyles({
                        pathColor: "#2563eb",
                        textColor: "#1e40af",
                        trailColor: "#bfdbfe",
                        textSize: "24px",
                      })}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 font-semibold">
                    <FaUserMd />
                    <span>Approved Doctors</span>
                  </div>
                </div>

                <div className="bg-yellow-100 p-6 rounded-lg text-center flex flex-col items-center">
                  <div className="w-24 h-24 mb-3">
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
                        textSize: "24px",
                      })}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-yellow-800 font-semibold">
                    <FaUserClock />
                    <span>Pending Approvals</span>
                  </div>
                </div>

                <div className="bg-green-100 p-6 rounded-lg text-center flex flex-col items-center">
                  <div className="w-24 h-24 mb-3">
                    <CircularProgressbar
                      value={getPercent(data.totalPatients, adminMaxPatients)}
                      text={`${data.totalPatients || 0}`}
                      styles={buildStyles({
                        pathColor: "#16a34a",
                        textColor: "#166534",
                        trailColor: "#bbf7d0",
                        textSize: "24px",
                      })}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-green-800 font-semibold">
                    <FaUserInjured />
                    <span>Patients</span>
                  </div>
                </div>

                <div className="bg-purple-100 p-6 rounded-lg text-center flex flex-col items-center">
                  <div className="w-24 h-24 mb-3">
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
                        textSize: "24px",
                      })}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-purple-800 font-semibold">
                    <FaNotesMedical />
                    <span>Medical Records</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Overview;
