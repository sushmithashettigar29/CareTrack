import { FaCalendarAlt } from "react-icons/fa";

export const AppointmentsEmptyState = ({
  searchTerm,
  setSearchTerm,
  user,
  setShowCreateModal,
}) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
      <div className="max-w-md mx-auto">
        <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Appointments Found
        </h3>
        <p className="text-gray-600 mb-4">
          {searchTerm
            ? "Try adjusting your search terms"
            : "You don't have any appointments yet"}
        </p>
        {searchTerm ? (
          <button
            onClick={() => setSearchTerm("")}
            className="text-blue-600 hover:underline"
          >
            Clear search
          </button>
        ) : (
          user?.role === "Patient" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 dark-bg text-white rounded-md transition-colors"
            >
              Book Your First Appointment
            </button>
          )
        )}
      </div>
    </div>
  );
};
