import React, { useEffect, useState } from "react";
import {
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaStar,
  FaClinicMedical,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdVerified, MdPending, MdCancel } from "react-icons/md";
import DashboardLayout from "../layouts/DashboardLayout";
import { Spinner } from "../components/Spinner";
import { DoctorCard } from "../components/DoctorCard";

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;

  // Add these states for the appointment popup
  const [showAppointmentPopup, setShowAppointmentPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
  });
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

  // New functions for appointment booking
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
      setAppointmentMessage(result.message);
      setFormData({ date: "", time: "", reason: "" });
      // Close popup after 2 seconds if successful
      setTimeout(() => {
        closeAppointmentPopup();
      }, 2000);
    } catch (err) {
      setAppointmentError(err.message);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());

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

  if (error)
    return (
      <DashboardLayout>
        <div className="p-6 text-red-600">Error: {error}</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="space-y-4 px-6 py-5 w-full h-full relative bg-white rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Doctors Directory
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search doctors..."
                  className="w-full h-[42px] pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>

              {user?.role === "Admin" && (
                <select
                  className="border rounded-lg px-3 h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Doctors</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              )}
            </div>

            {/* Pagination Controls */}
            {filteredDoctors.length > doctorsPerPage && (
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

        {/* Doctors Grid - Single Instance */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-500 text-lg">No doctors found</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Appointment Booking Popup */}
        {showAppointmentPopup && selectedDoctor && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Book Appointment with {selectedDoctor.name}
                </h2>
                <button
                  onClick={closeAppointmentPopup}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              {appointmentMessage && (
                <p className="text-green-600 mb-4">{appointmentMessage}</p>
              )}
              {appointmentError && (
                <p className="text-red-500 mb-4">{appointmentError}</p>
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
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleAppointmentChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Appointment
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleAppointmentChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Book Appointment
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DoctorsPage;
