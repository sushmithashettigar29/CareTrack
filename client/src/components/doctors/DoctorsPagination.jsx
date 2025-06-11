import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const DoctorsPagination = ({
  currentPage,
  totalPages,
  paginate,
  prevPage,
  nextPage,
  currentDoctors,
  filteredDoctors,
  searchTerm,
  setSearchTerm,
}) => {
  return (
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
  );
};
