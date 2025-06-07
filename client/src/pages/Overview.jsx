import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
        setError(null); // Clear any previous error
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard. Please try again later.");
      }
    };

    fetchDashboard();
  }, [user]);

  // Helper to get percentage for circular progress
  const getPercent = (value, max) => {
    if (!value || !max || max === 0) return 0;
    return Math.min(100, Math.round((value / max) * 100));
  };

  // Calculate dynamic max values for Admin stats to ensure circle progress is visible even for low values
  const adminMaxDoctors = Math.max(100, data?.totalDoctors || 0);
  const adminMaxPending = Math.max(20, data?.pendingDoctorApprovals || 0);
  const adminMaxPatients = Math.max(150, data?.totalPatients || 0);
  const adminMaxRecords = Math.max(300, data?.totalMedicalRecords || 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 light-bg rounded-lg shadow">
        {error ? (
          <p className="text-red-600 font-medium">{error}</p>
        ) : !data ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-6">
            {/* PATIENT */}
            {user.role === "Patient" && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-blue-100 p-6 rounded-lg text-center flex flex-col items-center">
                    <div className="w-24 h-24 mb-3">
                      <CircularProgressbar
                        value={getPercent(data.appointmentCount, 20)} // Assuming max 20 appts for progress
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
                        value={getPercent(data.medicalRecordCount, 50)} // Assuming max 50 medical records
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

                {data?.showBookAppointment && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => navigate("/get-appointment")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Book My Appointment
                    </button>
                  </div>
                )}
              </>
            )}

            {/* DOCTOR */}
            {user.role === "Doctor" && (
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-yellow-100 p-6 rounded-lg text-center flex flex-col items-center">
                  <div className="w-24 h-24 mb-3">
                    <CircularProgressbar
                      value={getPercent(data.totalAppointments, 50)} // max 50 total appointments
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

                <div className="bg-blue-100 p-6 rounded-lg text-center flex flex-col items-center">
                  <div className="w-24 h-24 mb-3">
                    <CircularProgressbar
                      value={getPercent(data.Confirmed, data.totalAppointments)} // % of confirmed
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

                <div className="bg-red-100 p-6 rounded-lg text-center flex flex-col items-center">
                  <div className="w-24 h-24 mb-3">
                    <CircularProgressbar
                      value={getPercent(data.Cancelled, data.totalAppointments)} // % cancelled
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
