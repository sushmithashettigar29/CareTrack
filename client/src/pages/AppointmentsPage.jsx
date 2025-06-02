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

        let endpoint = "/api/appointments/my";

        if (user.role === "Admin") {
          endpoint = "/api/appointments/all";
        } else if (user.role === "Doctor") {
          endpoint = "/api/appointments/my";
        }

        const response = await fetch(`http://localhost:5000${endpoint}`, {
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete appointment");

      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (id) => {
    alert(`Edit feature to be implemented for appointment ${id}`);
  };

  if (loadingAppointments) {
    return <div className="p-8">Loading data...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Appointments</h2>

        <div className="overflow-x-auto mt-6">
          {appointmentsError ? (
            <p className="text-red-500">{appointmentsError}</p>
          ) : appointments.length === 0 ? (
            <p className="text-green-500">No appointments found.</p>
          ) : (
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Patient</th>
                  <th className="py-2 px-4 border">Doctor</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Time</th>
                  <th className="py-2 px-4 border">Reason</th>
                  <th className="py-2 px-4 border">Status</th>
                  {user.role !== "Admin" && (
                    <th className="py-2 px-4 border">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">
                      {appointment.patientId?.name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border">
                      {appointment.doctorId?.name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">
                      {new Date(
                        `1970-01-01T${appointment.time}`
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>

                    <td className="py-2 px-4 border">
                      {appointment.reason || "-"}
                    </td>
                    <td className="py-2 px-4 border">
                      {user.role === "Doctor" ? (
                        <select
                          value={appointment.status}
                          onChange={(e) =>
                            handleStatusChange(appointment._id, e.target.value)
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span
                          className={
                            appointment.status === "Confirmed"
                              ? "text-green-600"
                              : appointment.status === "Cancelled"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }
                        >
                          {appointment.status}
                        </span>
                      )}
                    </td>
                    {user.role !== "Admin" && (
                      <td className="py-2 px-4 border">
                        <div className="flex justify-center gap-2">
                          {(user.role === "Doctor" ||
                            user.role === "Patient") && (
                            <button
                              onClick={() => handleDelete(appointment._id)}
                              className="inline-block text-white text-sm px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          )}

                          {user.role === "Patient" && (
                            <button
                              onClick={() => handleEdit(appointment._id)}
                              className="inline-block text-white text-sm px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsPage;
