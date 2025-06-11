import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";
import { Spinner } from "../components/Spinner";
import { DoctorsEmptyState } from "../components/doctors/DoctorsEmptyState";
import { DoctorsHeader } from "../components/doctors/DoctorsHeader";
import { DoctorsFilters } from "../components/doctors/DoctorsFilters";
import { DoctorsPagination } from "../components/doctors/DoctorsPagination";
import { DoctorsList } from "../components/doctors/DoctorsList";
import { AppointmentBookingModal } from "../components/doctors/AppointmentBookingModal";

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const doctorsPerPage = 3;

  const [showAppointmentPopup, setShowAppointmentPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentMessage, setAppointmentMessage] = useState("");
  const [appointmentError, setAppointmentError] = useState("");

  const storedUser = localStorage.getItem("userInfo");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!user || !user.token) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const url =
          user?.role === "Admin"
            ? "http://localhost:5000/api/admin/doctors"
            : "http://localhost:5000/api/doctors";

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await res.json();
        setDoctors(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [user]);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/approve-doctor/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to approve doctor");

      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === id ? { ...doc, isApproved: true, isRejected: false } : doc
        )
      );
    } catch (err) {
      alert(err.message || "Approve failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/delete-user/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete doctor");

      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/reject-doctor/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to reject doctor");

      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === id ? { ...doc, isRejected: true, isApproved: false } : doc
        )
      );
    } catch (err) {
      alert(err.message || "Reject failed");
    }
  };

  // Appointment booking functions
  const openAppointmentPopup = (doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentPopup(true);
    setFormData({
      date: "",
      time: "",
      reason: "",
    });
    setAppointmentMessage("");
    setAppointmentError("");
  };

  const closeAppointmentPopup = () => {
    setShowAppointmentPopup(false);
    setSelectedDoctor(null);
  };

  const handleAppointmentChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setAppointmentError("");
    setAppointmentMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          ...formData,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Booking failed");
      }

      const result = await res.json();
      setAppointmentMessage(
        result.message || "Appointment booked successfully!"
      );
      setFormData({ date: "", time: "", reason: "" });
      setTimeout(() => {
        closeAppointmentPopup();
      }, 2000);
    } catch (err) {
      setAppointmentError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filter === "approved") matchesFilter = doctor.isApproved;
    if (filter === "pending")
      matchesFilter = !doctor.isApproved && !doctor.isRejected;
    if (filter === "rejected") matchesFilter = doctor.isRejected;

    return matchesSearch && matchesFilter;
  });

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-6 flex justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 w-full h-full">
        <DoctorsHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          userRole={user?.role}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <DoctorsFilters
          filter={filter}
          setFilter={setFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          userRole={user?.role}
        />

        <DoctorsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          prevPage={prevPage}
          nextPage={nextPage}
          currentDoctors={currentDoctors}
          filteredDoctors={filteredDoctors}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <FaInfoCircle className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {filteredDoctors.length === 0 ? (
          <DoctorsEmptyState
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        ) : (
          <DoctorsList
            currentDoctors={currentDoctors}
            userRole={user?.role}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            onBookAppointment={openAppointmentPopup}
          />
        )}
      </div>

      <AppointmentBookingModal
        showAppointmentPopup={showAppointmentPopup}
        selectedDoctor={selectedDoctor}
        closeAppointmentPopup={closeAppointmentPopup}
        formData={formData}
        handleAppointmentChange={handleAppointmentChange}
        handleAppointmentSubmit={handleAppointmentSubmit}
        isSubmitting={isSubmitting}
        appointmentMessage={appointmentMessage}
        appointmentError={appointmentError}
      />
    </DashboardLayout>
  );
}

export default DoctorsPage;
