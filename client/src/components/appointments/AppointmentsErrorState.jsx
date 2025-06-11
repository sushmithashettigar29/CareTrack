import { FaCalendarAlt } from "react-icons/fa";

export const AppointmentsErrorState = ({
  appointmentsError,
  fetchAppointments,
}) => {
  return (
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
  );
};
