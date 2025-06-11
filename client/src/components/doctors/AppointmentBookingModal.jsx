import { FaCalendarAlt, FaTimes, FaCheck, FaInfoCircle } from "react-icons/fa";

export const AppointmentBookingModal = ({
  showAppointmentPopup,
  selectedDoctor,
  closeAppointmentPopup,
  formData,
  handleAppointmentChange,
  handleAppointmentSubmit,
  isSubmitting,
  appointmentMessage,
  appointmentError,
}) => {
  if (!showAppointmentPopup || !selectedDoctor) return null;

  return (
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
  );
};
