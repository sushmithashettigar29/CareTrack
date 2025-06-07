import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Spinner } from "../components/Spinner";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFileMedical,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import Modal from "../components/Modal";

const MedicalRecordForm = ({ appointment, record, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    diagnosis: record?.diagnosis || "",
    treatment: record?.treatment || "",
    prescription: record?.prescription || "",
    notes: record?.notes || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userToken = localStorage.getItem("userToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;
      if (record) {
        // Update existing record
        response = await fetch(
          `http://localhost:5000/api/records/${record._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(formData),
          }
        );
      } else {
        // Create new record
        response = await fetch("http://localhost:5000/api/records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            ...formData,
            patientId: appointment.patientId._id,
            appointmentId: appointment._id,
            doctorId: appointment.doctorId._id,
          }),
        });
      }

      if (!response.ok)
        throw new Error(
          record
            ? "Failed to update medical record"
            : "Failed to create medical record"
        );

      const result = await response.json();
      onSuccess(result);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Diagnosis
        </label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.diagnosis}
          onChange={(e) =>
            setFormData({ ...formData, diagnosis: e.target.value })
          }
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Treatment
        </label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          value={formData.treatment}
          onChange={(e) =>
            setFormData({ ...formData, treatment: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Prescription
        </label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          value={formData.prescription}
          onChange={(e) =>
            setFormData({ ...formData, prescription: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isSubmitting
            ? record
              ? "Updating..."
              : "Saving..."
            : record
            ? "Update Medical Record"
            : "Save Medical Record"}
        </button>
      </div>
    </form>
  );
};

const AppointmentsPage = () => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const userToken = localStorage.getItem("userToken");

  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [isEditingRecord, setIsEditingRecord] = useState(false);
  const appointmentsPerPage = 8;

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      if (!userToken) throw new Error("No authentication token found");

      let endpoint = "/api/appointments/my";

      if (user?.role === "Admin") {
        endpoint = "/api/appointments/all";
      } else if (user?.role === "Doctor") {
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
      setAppointmentsError(null);
    } catch (err) {
      setAppointmentsError(err.message);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const newUser = JSON.parse(localStorage.getItem("userInfo"));
      if (JSON.stringify(newUser) !== JSON.stringify(user)) {
        setUser(newUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [userToken, user?.role]);

  const fetchRecordsForAppointment = async (appointmentId) => {
    try {
      setLoadingRecords(true);
      console.log(`Fetching records for appointment: ${appointmentId}`); // Debug log

      const response = await fetch(
        `http://localhost:5000/api/records/appointment/${appointmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      console.log("Response status:", response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error details:", errorData); // Debug log
        throw new Error(errorData.message || "Failed to fetch medical records");
      }

      const data = await response.json();
      console.log("Received records:", data); // Debug log

      setRecords(data);
    } catch (err) {
      console.error("Error fetching records:", err.message);
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

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

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete appointment");

      setAppointments((prev) => prev.filter((a) => a._id !== id));
      alert("Appointment deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this medical record?"))
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/records/${recordId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete medical record");

      // Refresh records for the appointment
      await fetchRecordsForAppointment(selectedAppointment._id);
      alert("Medical record deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditAppointment = (id) => {
    alert(`Edit feature to be implemented for appointment ${id}`);
  };

  const handleViewDetails = async (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
    setShowRecordForm(false);
    setIsEditingRecord(false);
    setSelectedRecord(null);
    await fetchRecordsForAppointment(appointment._id);
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setIsEditingRecord(true);
    setShowRecordForm(true);
  };

  const handleCreateRecord = () => {
    setSelectedRecord(null);
    setIsEditingRecord(false);
    setShowRecordForm(true);
  };

  const handleRecordSuccess = async () => {
    if (selectedAppointment) {
      await fetchRecordsForAppointment(selectedAppointment._id);
    }
    setShowRecordForm(false);
    setIsEditingRecord(false);
    setSelectedRecord(null);
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter((appointment) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      appointment.patientId?.name?.toLowerCase().includes(searchLower) ||
      appointment.doctorId?.name?.toLowerCase().includes(searchLower) ||
      appointment.reason?.toLowerCase().includes(searchLower) ||
      appointment.status?.toLowerCase().includes(searchLower) ||
      new Date(appointment.date).toLocaleDateString().includes(searchTerm) ||
      appointment.time?.toLowerCase().includes(searchLower)
    );
  });

  // Get current appointments for pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
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
      <div className="space-y-6 p-9 light-bg rounded-lg shadow">
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
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-red-500 mb-2">{appointmentsError}</p>
            <button
              onClick={fetchAppointments}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
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
                  {user?.role !== "Admin" && (
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
                      {user?.role === "Doctor" ? (
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
                    {user?.role !== "Admin" && (
                      <td className="py-3 px-4 border">
                        <div className="flex gap-2">
                          {user?.role === "Doctor" && (
                            <button
                              onClick={() => handleViewDetails(appointment)}
                              className="text-white text-xs px-3 py-1 bg-green-600 rounded hover:bg-green-700 flex items-center gap-1"
                              title="View details and manage medical records"
                            >
                              <FaFileMedical /> Record
                            </button>
                          )}
                          {(user?.role === "Doctor" ||
                            user?.role === "Patient") && (
                            <button
                              onClick={() =>
                                handleDeleteAppointment(appointment._id)
                              }
                              className="text-white text-xs px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          )}
                          {user?.role === "Patient" && (
                            <button
                              onClick={() =>
                                handleEditAppointment(appointment._id)
                              }
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

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <Modal
          onClose={() => {
            setShowDetailsModal(false);
            setShowRecordForm(false);
            setIsEditingRecord(false);
            setSelectedRecord(null);
          }}
          title="Appointment Details"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Patient</h4>
                <p>{selectedAppointment.patientId?.name || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Doctor</h4>
                <p>{selectedAppointment.doctorId?.name || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Date & Time</h4>
                <p>
                  {new Date(selectedAppointment.date).toLocaleDateString()} at{" "}
                  {selectedAppointment.time}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Status</h4>
                <p>{selectedAppointment.status}</p>
              </div>
              <div className="col-span-2">
                <h4 className="font-medium text-gray-700">Reason</h4>
                <p>{selectedAppointment.reason || "-"}</p>
              </div>
            </div>

            {/* Medical Record Section - Only for Doctors */}
            {user?.role === "Doctor" && (
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Medical Records</h3>
                  {!showRecordForm && (
                    <button
                      onClick={handleCreateRecord}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Create New Record
                    </button>
                  )}
                </div>

                {showRecordForm ? (
                  <MedicalRecordForm
                    appointment={selectedAppointment}
                    record={selectedRecord}
                    onSuccess={handleRecordSuccess}
                    onCancel={() => {
                      setShowRecordForm(false);
                      setIsEditingRecord(false);
                      setSelectedRecord(null);
                    }}
                  />
                ) : loadingRecords ? (
                  <div className="flex justify-center py-4">
                    <Spinner size="md" />
                  </div>
                ) : records.length > 0 ? (
                  <div className="space-y-4">
                    {records.map((record) => (
                      <div
                        key={record._id}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800">
                            Record from{" "}
                            {new Date(record.createdAt).toLocaleString()}
                          </h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditRecord(record)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit record"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(record._id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete record"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {record.diagnosis && (
                            <div>
                              <span className="font-medium">Diagnosis:</span>{" "}
                              {record.diagnosis}
                            </div>
                          )}
                          {record.treatment && (
                            <div>
                              <span className="font-medium">Treatment:</span>{" "}
                              {record.treatment}
                            </div>
                          )}
                          {record.prescription && (
                            <div>
                              <span className="font-medium">Prescription:</span>{" "}
                              {record.prescription}
                            </div>
                          )}
                          {record.notes && (
                            <div>
                              <span className="font-medium">Notes:</span>{" "}
                              {record.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No medical records found for this appointment
                  </p>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default AppointmentsPage;
