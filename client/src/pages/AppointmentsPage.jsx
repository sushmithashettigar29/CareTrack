/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Spinner } from "../components/Spinner";
import Modal from "../components/Modal";
import { CreateAppointmentForm } from "../components/appointments/CreateAppointmentForm";
import { EditAppointmentForm } from "../components/appointments/EditAppointmentForm";
import { AppointmentsHeader } from "../components/appointments/AppointmentsHeader";
import { AppointmentsPagination } from "../components/appointments/AppointmentsPagination";
import { AppointmentsList } from "../components/appointments/AppointmentsList";
import { AppointmentsEmptyState } from "../components/appointments/AppointmentsEmptyState";
import { AppointmentsErrorState } from "../components/appointments/AppointmentsErrorState";
import { AppointmentDetailsModal } from "../components/appointments/AppointmentDetailsModal";

const AppointmentsPage = () => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const userToken = localStorage.getItem("userToken");

  const [appointments, setAppointments] = useState([]);
  const [, setRecords] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [, setLoadingRecords] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [, setIsEditingRecord] = useState(false);
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
      <div className="space-y-6 p-4 sm:p-6 lg:p-9 w-full h-full rounded-lg">
        <AppointmentsHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <AppointmentsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          prevPage={prevPage}
          nextPage={nextPage}
          currentAppointments={currentAppointments}
          filteredAppointments={filteredAppointments}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {appointmentsError ? (
          <AppointmentsErrorState
            appointmentsError={appointmentsError}
            fetchAppointments={fetchAppointments}
          />
        ) : filteredAppointments.length === 0 ? (
          <AppointmentsEmptyState
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            user={user}
            setShowCreateModal={setShowCreateModal}
          />
        ) : (
          <AppointmentsList
            currentAppointments={currentAppointments}
            user={user}
            handleStatusChange={handleStatusChange}
            handleDeleteAppointment={handleDeleteAppointment}
            handleViewDetails={handleViewDetails}
            handleEdit={handleEdit}
          />
        )}
      </div>

      {/* Modals */}
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

      <AppointmentDetailsModal
        selectedAppointment={selectedAppointment}
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        showRecordForm={showRecordForm}
        setShowRecordForm={setShowRecordForm}
        setIsEditingRecord={setIsEditingRecord}
        setSelectedRecord={setSelectedRecord}
        user={user}
        handleCreateRecord={handleCreateRecord}
        selectedRecord={selectedRecord}
        handleRecordSuccess={handleRecordSuccess}
      />

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
