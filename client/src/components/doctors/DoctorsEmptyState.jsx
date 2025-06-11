import { FaUserMd } from "react-icons/fa";

export const DoctorsEmptyState = ({ searchTerm, setSearchTerm }) => {
  return (
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
  );
};
