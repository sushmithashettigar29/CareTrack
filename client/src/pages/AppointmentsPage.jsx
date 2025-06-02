import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Spinner } from "../components/Spinner";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

const AppointmentsPage = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userToken = localStorage.getItem("userToken");

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 8;

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
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    
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

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter((appointment) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (appointment.patientId?.name?.toLowerCase().includes(searchLower)) ||
      (appointment.doctorId?.name?.toLowerCase().includes(searchLower)) ||
      (appointment.reason?.toLowerCase().includes(searchLower)) ||
      (appointment.status?.toLowerCase().includes(searchLower)) ||
      (new Date(appointment.date).toLocaleDateString().includes(searchTerm)) ||
      (appointment.time?.toLowerCase().includes(searchLower))
    );
  });

  // Get current appointments for pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loadingAppointments) {
    return (
      <DashboardLayout>
        <div className="p-6 flex justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header with title, search, and pagination */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            {/* Search */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full h-[42px] pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            {/* Pagination Controls */}
            {filteredAppointments.length > appointmentsPerPage && (
              <div className="flex items-center h-[42px] bg-white rounded-lg shadow-sm">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`h-full px-3 flex items-center ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <FaChevronLeft />
                </button>
                
                <div className="flex h-full">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`w-10 h-full flex items-center justify-center ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`h-full px-3 flex items-center ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Appointments Table */}
        {appointmentsError ? (
          <p className="text-red-500">{appointmentsError}</p>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No appointments found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-blue-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border text-left">Patient</th>
                  <th className="py-3 px-4 border text-left">Doctor</th>
                  <th className="py-3 px-4 border text-left">Date</th>
                  <th className="py-3 px-4 border text-left">Time</th>
                  <th className="py-3 px-4 border text-left">Reason</th>
                  <th className="py-3 px-4 border text-left">Status</th>
                  {user.role !== "Admin" && (
                    <th className="py-3 px-4 border text-left">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border">
                      {appointment.patientId?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 border">
                      {appointment.doctorId?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 border">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 border">
                      {new Date(
                        `1970-01-01T${appointment.time}`
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="py-3 px-4 border">
                      {appointment.reason || "-"}
                    </td>
                    <td className="py-3 px-4 border">
                      {user.role === "Doctor" ? (
                        <select
                          value={appointment.status}
                          onChange={(e) =>
                            handleStatusChange(appointment._id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span
                          className={
                            appointment.status === "Confirmed"
                              ? "text-green-600 font-medium"
                              : appointment.status === "Cancelled"
                              ? "text-red-500 font-medium"
                              : "text-yellow-500 font-medium"
                          }
                        >
                          {appointment.status}
                        </span>
                      )}
                    </td>
                    {user.role !== "Admin" && (
                      <td className="py-3 px-4 border">
                        <div className="flex gap-2">
                          {(user.role === "Doctor" ||
                            user.role === "Patient") && (
                            <button
                              onClick={() => handleDelete(appointment._id)}
                              className="text-white text-xs px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          )}
                          {user.role === "Patient" && (
                            <button
                              onClick={() => handleEdit(appointment._id)}
                              className="text-white text-xs px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
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
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsPage;