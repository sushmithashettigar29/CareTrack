import {
  FaFileMedical,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaUserMd,
} from "react-icons/fa";

export const AppointmentCard = ({
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
