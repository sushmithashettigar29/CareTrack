import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  FaCalendarCheck,
  FaFileMedical,
  FaUserMd,
  FaUserInjured,
  FaUserCheck,
  FaUserClock,
  FaNotesMedical,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaStethoscope,
  FaExclamationTriangle,
  FaSpinner,
  FaChartLine,
  FaEdit,
  FaUser,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

function EditProfileModal({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    age: user.age || "",
    gender: user.gender || "",
    specialization: user.specialization || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const testConnection = async () => {
    try {
      console.log("Testing API connection...");
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        await response.json();
      } else {
        await response.text();
      }
    } catch (error) {
      console.error("Connection test failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        await response.text();
        throw new Error(
          `Server returned non-JSON response. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      await response.json();

      const updatedUser = { ...user, ...formData };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      onUpdate(updatedUser);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "An error occurred while updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto light-bg rounded-full flex items-center justify-center mb-4">
            <FaEdit className="dark-color text-xl" />
          </div>
          <h2 className="text-xl font-bold dark-color">Edit Profile</h2>
          <p className="text-gray-600 text-sm">
            Update your personal information
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-start gap-2">
              <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error updating profile:</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
            <FaCheck className="mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none "
              required
              pattern="^\d{10}$"
              title="Please enter a valid 10-digit phone number"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: 10 digits without spaces or dashes
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {user.role === "Doctor" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none "
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 dark-bg text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Overview() {
  const [user, setUser] = useState(
    () =>
      JSON.parse(localStorage.getItem("userInfo")) || {
        name: "User",
        role: "Unknown",
      }
  );
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
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
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      setError(null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchUserProfile();
  }, [user]);

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    fetchDashboard();
    fetchUserProfile();
  };

  const getPercent = (value, max) => {
    if (!value || !max || max === 0) return 0;
    return Math.min(100, Math.round((value / max) * 100));
  };

  const adminMaxDoctors = Math.max(100, data?.totalDoctors || 0);
  const adminMaxPending = Math.max(20, data?.pendingDoctorApprovals || 0);
  const adminMaxPatients = Math.max(150, data?.totalPatients || 0);
  const adminMaxRecords = Math.max(300, data?.totalMedicalRecords || 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin dark-color mx-auto h-12 w-12 mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 w-full h-full mb-4">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* User Profile Section */}
            <div className=" rounded-xl r border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold dark-color flex items-center gap-2">
                    Overview
                  </h2>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center font-semibold gap-2 px-3 py-1.5 text-sm dark-bg text-white rounded-lg"
                  >
                    <FaEdit className="w-3 h-3" />
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="p-3 mb-4">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center lg:items-start mx-5 mt-2">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=006a71&color=ffffff&size=128&bold=true`}
                          alt="User avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-4 text-center lg:text-left">
                      <h3 className="text-2xl font-bold dark-color">
                        {user.name}
                      </h3>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaEnvelope className="text-blue-600 w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Email Address
                            </p>
                            <p className="font-medium text-gray-900 truncate">
                              {user.email || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FaPhone className="text-green-600 w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Phone Number
                            </p>
                            <p className="font-medium text-gray-900">
                              {user.phone || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <FaBirthdayCake className="text-yellow-600 w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Age
                            </p>
                            <p className="font-medium text-gray-900">
                              {user.age || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                            <FaVenusMars className="text-pink-600 w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Gender
                            </p>
                            <p className="font-medium text-gray-900">
                              {user.gender || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FaUser className="text-purple-600 w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Role
                            </p>
                            <p className="font-medium text-gray-900">
                              {user.role || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {user.role === "Doctor" && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <FaStethoscope className="text-red-600 w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Specialization
                              </p>
                              <p className="font-medium text-gray-900">
                                {user.specialization || "Not provided"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="mb-4 border-gray-200 overflow-hidden">
              <div className="p-6">
                {/* PATIENT STATS */}
                {user.role === "Patient" && data && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center border-transparent p-5 bg-blue-50 rounded-xl shadow">
                      <div className="w-24 h-24 mx-auto mb-4">
                        <CircularProgressbar
                          value={getPercent(data.appointmentCount, 20)}
                          text={`${data.appointmentCount || 0}`}
                          styles={buildStyles({
                            pathColor: "#2563eb",
                            textColor: "#1e40af",
                            trailColor: "#e5e7eb",
                            textSize: "28px",
                            pathTransitionDuration: 1.5,
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-blue-700 font-semibold mb-1">
                        <FaCalendarCheck className="w-4 h-4" />
                        <span>Total Appointments</span>
                      </div>
                    </div>

                    <div className="text-center border-transparent p-5 bg-green-50 rounded-xl shadow">
                      <div className="w-24 h-24 mx-auto mb-4">
                        <CircularProgressbar
                          value={getPercent(data.medicalRecordCount, 50)}
                          text={`${data.medicalRecordCount || 0}`}
                          styles={buildStyles({
                            pathColor: "#16a34a",
                            textColor: "#166534",
                            trailColor: "#e5e7eb",
                            textSize: "28px",
                            pathTransitionDuration: 1.5,
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-green-700 font-semibold mb-1">
                        <FaFileMedical className="w-4 h-4" />
                        <span>Medical Records</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* DOCTOR STATS */}
                {user.role === "Doctor" && data && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center border-transparent p-5 bg-amber-50 rounded-xl shadow">
                      <div className="w-24 h-24 mx-auto mb-4">
                        <CircularProgressbar
                          value={getPercent(data.totalAppointments, 100)}
                          text={`${data.totalAppointments || 0}`}
                          styles={buildStyles({
                            pathColor: "#ca8a04",
                            textColor: "#854d0e",
                            trailColor: "#e5e7eb",
                            textSize: "28px",
                            pathTransitionDuration: 1.5,
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-yellow-700 font-semibold mb-1">
                        <FaCalendarCheck className="w-4 h-4" />
                        <span>Total Appointments</span>
                      </div>
                    </div>

                    <div className="text-center border-transparent p-5 bg-blue-50 rounded-xl shadow">
                      <div className="w-24 h-24 mx-auto mb-4">
                        <CircularProgressbar
                          value={getPercent(
                            data.Confirmed,
                            data.totalAppointments || 1
                          )}
                          text={`${data.Confirmed || 0}`}
                          styles={buildStyles({
                            pathColor: "#2563eb",
                            textColor: "#1e40af",
                            trailColor: "#e5e7eb",
                            textSize: "28px",
                            pathTransitionDuration: 1.5,
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-blue-700 font-semibold mb-1">
                        <FaUserCheck className="w-4 h-4" />
                        <span>Confirmed</span>
                      </div>
                    </div>

                    <div className="text-center border-transparent p-5 bg-purple-50 rounded-xl shadow">
                      <div className="w-24 h-24 mx-auto mb-4">
                        <CircularProgressbar
                          value={getPercent(
                            data.Pending || 0,
                            data.totalAppointments || 1
                          )}
                          text={`${data.Pending || 0}`}
                          styles={buildStyles({
                            pathColor: "#8b5cf6",
                            textColor: "#5b21b6",
                            trailColor: "#e5e7eb",
                            textSize: "28px",
                            pathTransitionDuration: 1.5,
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-purple-700 font-semibold mb-1">
                        <FaUserClock className="w-4 h-4" />
                        <span>Pending</span>
                      </div>
                    </div>

                    <div className="text-center border-transparent p-5 bg-red-50 rounded-xl shadow">
                      <div className="w-24 h-24 mx-auto mb-4">
                        <CircularProgressbar
                          value={getPercent(
                            data.Cancelled,
                            data.totalAppointments || 1
                          )}
                          text={`${data.Cancelled || 0}`}
                          styles={buildStyles({
                            pathColor: "#dc2626",
                            textColor: "#991b1b",
                            trailColor: "#e5e7eb",
                            textSize: "28px",
                            pathTransitionDuration: 1.5,
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-red-700 font-semibold mb-1">
                        <FaUserClock className="w-4 h-4" />
                        <span>Cancelled</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ADMIN STATS */}
                {user.role === "Admin" && data && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center border-transparent p-5 bg-blue-50 rounded-xl shadow">
                      <div className="w-24 h-24 mx-auto mb-4">
                        <CircularProgressbar
                          value={getPercent(data.totalDoctors, adminMaxDoctors)}
                          text={`${data.totalDoctors || 0}`}
                          styles={buildStyles({
                            pathColor: "#2563eb",
                            textColor: "#1e40af",
                            trailColor: "#e5e7eb",
                            textSize: "28px",
                            pathTransitionDuration: 1.5,
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-blue-700 font-semibold mb-1">
                        <FaUserMd className="w-4 h-4" />
                        <span>Approved Doctors</span>
                      </div>
                    </div>

                    <div className="text-center border-transparent p-5 bg-amber-50 rounded-xl shadow">
                      <div className="w-24 h-24 mx-auto mb-4">
                        <CircularProgressbar
                          value={getPercent(
                            data.pendingDoctorApprovals,
                            adminMaxPending
                          )}
                          text={`${data.pendingDoctorApprovals || 0}`}
                          styles={buildStyles({
                            pathColor: "#ca8a04",
                            textColor: "#854d0e",
                            trailColor: "#e5e7eb",
                            textSize: "28px",
                            pathTransitionDuration: 1.5,
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-yellow-700 font-semibold mb-1">
                        <FaUserClock className="w-4 h-4" />
                        <span>Pending Approvals</span>
                      </div>
                    </div>

                    <div className="text-center border-transparent p-5 bg-green-50 rounded-xl shadow">
                      <div className="w-24 h-24 mx-auto mb-4">
                        <CircularProgressbar
                          value={getPercent(
                            data.totalPatients,
                            adminMaxPatients
                          )}
                          text={`${data.totalPatients || 0}`}
                          styles={buildStyles({
                            pathColor: "#16a34a",
                            textColor: "#166534",
                            trailColor: "#e5e7eb",
                            textSize: "28px",
                            pathTransitionDuration: 1.5,
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-green-700 font-semibold mb-1">
                        <FaUserInjured className="w-4 h-4" />
                        <span>Total Patients</span>
                      </div>
                    </div>

                    <div className="text-center border-transparent p-5 bg-purple-50 rounded-xl shadow">
                      <div className="w-24 h-24 mx-auto mb-4">
                        <CircularProgressbar
                          value={getPercent(
                            data.totalMedicalRecords,
                            adminMaxRecords
                          )}
                          text={`${data.totalMedicalRecords || 0}`}
                          styles={buildStyles({
                            pathColor: "#8b5cf6",
                            textColor: "#5b21b6",
                            trailColor: "#e5e7eb",
                            textSize: "28px",
                            pathTransitionDuration: 1.5,
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-purple-700 font-semibold mb-1">
                        <FaNotesMedical className="w-4 h-4" />
                        <span>Medical Records</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </DashboardLayout>
  );
}

export default Overview;
