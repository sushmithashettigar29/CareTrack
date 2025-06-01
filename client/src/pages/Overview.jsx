import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

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

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold">Welcome, {user.name}!</h3>

        {error ? (
          <p className="text-red-600 font-medium">{error}</p>
        ) : !data ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {/* PATIENT */}
            {user.role === "Patient" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <p className="text-xl font-bold">
                      {data?.appointmentCount || 0}
                    </p>
                    <p>Appointments</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg text-center">
                    <p className="text-xl font-bold">
                      {data?.medicalRecordCount || 0}
                    </p>
                    <p>Medical Records</p>
                  </div>
                </div>

                {data?.showBookAppointment && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => navigate("/book-appointment")}
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
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-yellow-100 p-4 rounded-lg text-center">
                  <p className="text-xl font-bold">
                    {data?.totalAppointments || 0}
                  </p>
                  <p>Total Appointments</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <p className="text-xl font-bold">{data?.Confirmed || 0}</p>
                  <p>Confirmed</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <p className="text-xl font-bold">{data?.Cancelled || 0}</p>
                  <p>Cancelled</p>
                </div>
              </div>
            )}

            {/* ADMIN */}
            {user.role === "Admin" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <p className="text-xl font-bold">{data?.totalDoctors || 0}</p>
                  <p>Approved Doctors</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg text-center">
                  <p className="text-xl font-bold">
                    {data?.pendingDoctorApprovals || 0}
                  </p>
                  <p>Pending Approvals</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <p className="text-xl font-bold">
                    {data?.totalPatients || 0}
                  </p>
                  <p>Patients</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <p className="text-xl font-bold">
                    {data?.totalMedicalRecords || 0}
                  </p>
                  <p>Medical Records</p>
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
