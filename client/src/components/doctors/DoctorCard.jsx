import {
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaStar,
  FaMapMarkerAlt,
  FaCheck,
  FaBan,
  FaTrashAlt,
  FaClock,
} from "react-icons/fa";
import { MdVerified, MdPending } from "react-icons/md";

export const DoctorCard = ({
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
