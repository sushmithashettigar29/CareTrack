import { useEffect, useState } from "react";
import {
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaStar,
  FaClinicMedical,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter,
  FaTimes,
  FaMapMarkerAlt,
  FaCheck,
  FaBan,
  FaTrashAlt,
  FaClock,
  FaInfoCircle,
} from "react-icons/fa";
import { MdVerified, MdPending } from "react-icons/md";
import DashboardLayout from "../layouts/DashboardLayout";
import { Spinner } from "../components/Spinner";

const DoctorCard = ({
  doctor,
  userRole,
  onApprove,
  onReject,
  onDelete,
  onBookAppointment,
}) => {
  const getStatusBadge = () => {
    if (doctor.isApproved) {
      return (
        <div className="absolute top-4 right-4 flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          <MdVerified className="text-green-600" />
        </div>
      );
    } else if (doctor.isRejected) {
      return (
        <div className="absolute top-4 right-4 flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          <FaBan className="text-red-600" />
        </div>
      );
    } else {
      return (
        <div className="absolute top-4 right-4 flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          <MdPending className="text-yellow-600" />
        </div>
      );
    }
  };

  return (
    <div className="border-cl rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative border border-gray-100">
      {getStatusBadge()}

      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-24 h-24 rounded-full light-bg flex items-center justify-center flex-shrink-0">
            {doctor.profileImage ? (
              <img
                src={doctor.profileImage || "/placeholder.svg"}
                alt={doctor.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <FaUserMd className="w-12 h-12 dark-color" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {doctor.name}
            </h3>
            <p className="dark-color font-medium mb-2">
              {doctor.specialization}
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-4">
              {doctor.experience && (
                <span className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                  <FaClock className="mr-1" /> {doctor.experience} Years
                </span>
              )}
              {doctor.rating && (
                <span className="inline-flex items-center text-xs text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">
                  <FaStar className="mr-1" /> {doctor.rating}/5
                </span>
              )}
              {doctor.location && (
                <span className="inline-flex items-center text-xs text-green-600 bg-green-100 px-2.5 py-1 rounded-full">
                  <FaMapMarkerAlt className="mr-1" /> {doctor.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <FaEnvelope className="dark-color flex-shrink-0" />
            <span className="text-sm truncate">{doctor.email}</span>
          </div>

          {doctor.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <FaPhone className="medium-color flex-shrink-0" />
              <span className="text-sm">{doctor.phone}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {userRole === "Admin" && (
            <>
              {!doctor.isApproved && (
                <button
                  onClick={() => onApprove(doctor._id)}
                  className="flex-1 flex items-center justify-center gap-1 dark-bg text-white py-2 px-4 rounded-md transition-colors"
                >
                  <FaCheck /> Approve
                </button>
              )}

              {!doctor.isRejected && (
                <button
                  onClick={() => onReject(doctor._id)}
                  className="flex-1 flex items-center justify-center gap-1 medium-bg text-white py-2 px-4 rounded-md transition-colors"
                >
                  <FaBan /> Reject
                </button>
              )}

              <button
                onClick={() => onDelete(doctor._id)}
                className="flex-1 flex items-center justify-center gap-1 dark-bg text-white py-2 px-4 rounded-md transition-colors"
              >
                <FaTrashAlt /> Delete
              </button>
            </>
          )}

          {userRole === "Patient" && doctor.isApproved && (
            <button
              onClick={() => onBookAppointment(doctor)}
              className="w-full flex items-center justify-center gap-2 dark-bg text-white py-2 px-4 rounded-md transition-colors"
            >
              <FaCalendarAlt /> Book Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 w-full h-full bg-white rounded-lg shadow">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold dark-color">
                Doctors Directory
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search doctors..."
                  className="w-full h-[42px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>

              {/* Filter Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaFilter />
                Filters
              </button>

              {/* Filter Dropdown (Desktop) */}
              {user?.role === "Admin" && (
                <div className="hidden sm:block">
                  <select
                    className="h-[42px] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Doctors</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && user?.role === "Admin" && (
          <div className="sm:hidden bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Status</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Doctors</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        )}

        {/* Results Summary and Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 light-bg rounded-lg p-4">
          <div className="text-sm dark-color">
            Showing {currentDoctors.length} of {filteredDoctors.length} doctors
            {searchTerm && (
              <span>
                {" "}
                for "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 dark-bg hover:underline"
                >
                  Clear
                </button>
              </span>
            )}
          </div>

          {/* Pagination */}
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
                          : "hover:bg-gray-100 dark-color"
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

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <FaInfoCircle className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
            <div className="max-w-md mx-auto">
              <FaUserMd className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Doctors Found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No doctors available"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="dark-color hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentDoctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                userRole={user?.role}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                onBookAppointment={openAppointmentPopup}
              />
            ))}
          </div>
        )}
      </div>

      {/* Appointment Booking Modal */}
      {showAppointmentPopup && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAppointmentPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close"
            >
              <FaTimes size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto light-bg rounded-full flex items-center justify-center mb-4">
                <FaCalendarAlt className="dark-color text-2xl" />
              </div>
              <h2 className="text-xl font-bold dark-green">Book Appointment</h2>
              <p className="text-gray-600">with Dr. {selectedDoctor.name}</p>
            </div>

            {appointmentMessage && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                <div className="flex items-center">
                  <FaCheck className="mr-2 flex-shrink-0" />
                  <p>{appointmentMessage}</p>
                </div>
              </div>
            )}

            {appointmentError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <div className="flex items-center">
                  <FaInfoCircle className="mr-2 flex-shrink-0" />
                  <p>{appointmentError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleAppointmentChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleAppointmentChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Appointment
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleAppointmentChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                  rows="3"
                  placeholder="Please describe your symptoms or reason for visit"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeAppointmentPopup}
                  className="flex-1 py-3 px-4 border border-gray-300 dark-color rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 dark-bg white-color font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default DoctorsPage;
