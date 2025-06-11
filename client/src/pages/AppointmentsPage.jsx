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
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaUserMd,
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
      alert(`Medical record ${record ? "updated" : "created"} successfully`);
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
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white dark-bg  focus:outline-none focus:ring-2 focus:ring-offset-2"
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

const CreateAppointmentForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const userToken = localStorage.getItem("userToken");

  // Fetch doctors when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await fetch("http://localhost:5000/api/doctors", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch doctors");

        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        alert("Failed to load doctors. Please try again.");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [userToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create appointment");

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
          Select Doctor
        </label>
        {loadingDoctors ? (
          <div className="mt-1 flex items-center justify-center h-10 border border-gray-300 rounded-md">
            <Spinner size="sm" />
          </div>
        ) : (
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.doctorId}
            onChange={(e) =>
              setFormData({ ...formData, doctorId: e.target.value })
            }
            required
          >
            <option value="">Choose a doctor...</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          min={new Date().toISOString().split("T")[0]} // Prevent past dates
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <input
          type="time"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reason for Visit
        </label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Describe the reason for your appointment..."
          required
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
          disabled={isSubmitting || loadingDoctors}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Appointment"}
        </button>
      </div>
    </form>
  );
};

const EditAppointmentForm = ({ appointment, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    date: appointment?.date
      ? new Date(appointment.date).toISOString().split("T")[0]
      : "",
    time: appointment?.time || "",
    reason: appointment?.reason || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userToken = localStorage.getItem("userToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/edit/${appointment._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update appointment");

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
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          min={new Date().toISOString().split("T")[0]} // Prevent past dates
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <input
          type="time"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reason
        </label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Describe the reason for your appointment..."
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
          {isSubmitting ? "Updating..." : "Update Appointment"}
        </button>
      </div>
    </form>
  );
};

const AppointmentCard = ({
  appointment,
  user,
  onStatusChange,
  onDelete,
  onViewDetails,
  onEdit,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="border-cl rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            {/* First Row: Appointment label and status */}
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm font-semibold text-gray-800">Appointment</p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
            </div>

            {/* Second Row: Doctor Info (Admin or Patient) */}
            {(user.role === "Admin" || user.role === "Patient") && (
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 light-bg rounded-full flex items-center justify-center">
                  <FaUserMd className="dark-color text-sm" />
                </div>
                <div>
                  <p className="text-xs font-medium dark-color uppercase tracking-wide">
                    Doctor
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {appointment.doctorId?.name || "N/A"}
                  </p>
                </div>
              </div>
            )}

            {/* Third Row: Patient Info (Admin or Doctor) */}
            {(user.role === "Admin" || user.role === "Doctor") && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 light-bg rounded-full flex items-center justify-center">
                  <FaUser className="dark-color text-sm" />
                </div>
                <div>
                  <p className="text-xs font-medium dark-color uppercase tracking-wide">
                    Patient
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {appointment.patientId?.name || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 px-4">
            <div className="flex items-center gap-2 text-gray-600">
              <FaCalendarAlt className="medium-color text-sm" />
              <span className="text-sm">
                {new Date(appointment.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaClock className="dark-color text-sm" />
              <span className="text-sm">{formatTime(appointment.time)}</span>
            </div>
          </div>

          {appointment.reason && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Reason
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    {appointment.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {user?.role === "Doctor" && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Update Status:
              </label>
              <select
                value={appointment.status}
                onChange={(e) =>
                  onStatusChange(appointment._id, e.target.value)
                }
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {/* Actions */}
          {user?.role !== "Admin" && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {user?.role === "Doctor" && (
                <button
                  onClick={() => onViewDetails(appointment)}
                  className="flex items-center gap-1 px-3 py-2 dark-bg text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                >
                  <FaFileMedical />
                  Records
                </button>
              )}
              {user?.role === "Patient" && (
                <button
                  onClick={() => onEdit(appointment)}
                  className="flex items-center gap-1 px-3 py-2 medium-bg text-white text-xs rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <FaEdit />
                  Edit
                </button>
              )}

              {user?.role === "Patient" && (
                <button
                  onClick={() => onDelete(appointment._id)}
                  className="flex items-center gap-1 px-3 py-2 dark-bg text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                >
                  <FaTrash />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const appointmentsPerPage = 3;

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
      const response = await fetch(
        `http://localhost:5000/api/records/appointment/${appointmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch medical records");
      }

      const data = await response.json();
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

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setShowEditModal(true);
  };

  const handleEditSuccess = (updatedAppointment) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app._id === updatedAppointment._id ? updatedAppointment : app
      )
    );
    setShowEditModal(false);
    setEditingAppointment(null);
    alert("Appointment updated successfully");
  };

  const handleCreateSuccess = (newAppointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
    setShowCreateModal(false);
    alert("Appointment created successfully");
  };

  const handleViewDetails = async (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
    setShowRecordForm(false);
    setIsEditingRecord(false);
    setSelectedRecord(null);
    await fetchRecordsForAppointment(appointment._id);
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

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

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
      <div className="space-y-6 p-4 sm:p-6 lg:p-9 w-full h-full rounded-lg ">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold dark-color">
                Appointments
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="w-full h-[42px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 light-bg rounded-lg p-4">
          <div className="text-sm dark-color">
            Showing {currentAppointments.length} of{" "}
            {filteredAppointments.length} appointments
            {searchTerm && (
              <span>
                {" "}
                for "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Clear
                </button>
              </span>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "dark-color hover:bg-blue-50"
                }`}
              >
                <FaChevronLeft />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`w-8 h-8 rounded-md text-sm ${
                        currentPage === pageNum
                          ? "dark-bg text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "dark-color hover:bg-blue-50"
                }`}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>

        {appointmentsError ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
            <div className="max-w-md mx-auto">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error Loading Appointments
              </h3>
              <p className="text-red-500 mb-4">{appointmentsError}</p>
              <button
                onClick={fetchAppointments}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
            <div className="max-w-md mx-auto">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Appointments Found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "You don't have any appointments yet"}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              ) : (
                user?.role === "Patient" && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 dark-bg text-white rounded-md  transition-colors"
                  >
                    Book Your First Appointment
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {currentAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                user={user}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteAppointment}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <Modal
          onClose={() => setShowCreateModal(false)}
          title="Create New Appointment"
        >
          <CreateAppointmentForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}

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
                      className="px-3 py-3 dark-bg font-bold text-white rounded text-sm hover:bg-blue-700"
                    >
                      Create New Record
                    </button>
                  )}
                </div>
                {showRecordForm && (
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
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {showEditModal && editingAppointment && (
        <Modal
          onClose={() => {
            setShowEditModal(false);
            setEditingAppointment(null);
          }}
          title="Edit Appointment"
        >
          <EditAppointmentForm
            appointment={editingAppointment}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setShowEditModal(false);
              setEditingAppointment(null);
            }}
          />
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default AppointmentsPage;
