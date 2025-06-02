import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const AppointmentsPage = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userToken = localStorage.getItem("userToken");

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!userToken) throw new Error("No authentication token found");

        let endpoint = "/api/appointments/my"; // Default for patient

        if (user.role === "Admin") {
          endpoint = "/api/appointments/all"; // Admin fetches all
        } else if (user.role === "Doctor") {
          endpoint = "/api/appointments/my"; // Doctor-specific endpoint
        }

        const response = await fetch(`http://localhost:5000${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch appointments");

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setAppointmentsError(err.message);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [userToken, user.role]);

  if (loadingAppointments) {
    return <div className="p-8">Loading data...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Appointments</h2>

        {user.role === "Admin" && (
          <p>View all appointments across the system.</p>
        )}
        {user.role === "Doctor" && <p>View your patient appointments.</p>}
        {user.role === "Patient" && <p>View your booked appointments.</p>}

        <div className="mt-8">
          {appointmentsError ? (
            <p className="text-red-500">{appointmentsError}</p>
          ) : appointments.length === 0 ? (
            <p className="text-green-500">No appointments found.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="border p-4 rounded-lg">
                  <h3 className="font-medium">
                    Appointment with {appointment.doctorId?.name}
                  </h3>
                  <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                  <p>Time: {appointment.time}</p>
                  <p>
                    Status:{" "}
                    <span
                      className={
                        appointment.status === "Confirmed"
                          ? "text-green-500"
                          : appointment.status === "Cancelled"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }
                    >
                      {appointment.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsPage;
