import React from "react";
import {
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaStar,
  FaClinicMedical,
} from "react-icons/fa";
import { MdVerified, MdPending, MdCancel } from "react-icons/md";

export function DoctorCard({
  doctor,
  userRole,
  onApprove,
  onReject,
  onDelete,
  onBookAppointment,
}) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <FaUserMd className="text-2xl text-blue-600" />
            </div>
            {doctor.isApproved && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <MdVerified className="text-white text-sm" />
              </div>
            )}
            {!doctor.isApproved && !doctor.isRejected && (
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
                <MdPending className="text-white text-sm" />
              </div>
            )}
            {doctor.isRejected && (
              <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
                <MdCancel className="text-white text-sm" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800">
                {doctor.name}
              </h3>
              {doctor.rating && (
                <div className="flex items-center gap-1 text-amber-500">
                  <FaStar className="text-sm" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                </div>
              )}
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                <FaClinicMedical className="text-xs" />
                <span className="capitalize">
                  {doctor.specialization || "General"}
                </span>
              </span>

              {doctor.experience && (
                <span className="text-xs text-gray-500">
                  {doctor.experience} years exp
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaEnvelope className="text-gray-400" />
            <span className="truncate">{doctor.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaPhone className="text-gray-400" />
            <span>{doctor.phone || "Not provided"}</span>
          </div>

          {doctor.availability && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaCalendarAlt className="text-gray-400" />
              <span>{doctor.availability}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
          {(userRole === "Patient" || userRole === "Doctor") &&
            doctor.isApproved && (
              <button
                onClick={() => onBookAppointment(doctor)}
                className="w-full bg-blue-600 text-white py-2 hover:bg-blue-700 transition"
              >
                Book Appointment
              </button>
            )}

          {userRole === "Admin" && (
            <>
              <button
                onClick={() => onApprove(doctor._id)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  doctor.isApproved
                    ? "bg-green-100 text-green-800 cursor-default"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
                disabled={doctor.isApproved}
              >
                {doctor.isApproved ? "Approved" : "Approve"}
              </button>

              <button
                onClick={() => onReject(doctor._id)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  doctor.isRejected
                    ? "bg-red-100 text-red-800 cursor-default"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
                disabled={doctor.isRejected}
              >
                {doctor.isRejected ? "Rejected" : "Reject"}
              </button>

              <button
                onClick={() => onDelete(doctor._id)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
