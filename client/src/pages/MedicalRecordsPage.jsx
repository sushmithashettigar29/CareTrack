import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Spinner } from "../components/Spinner";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaUser,
  FaUserMd,
  FaCalendarAlt,
  FaFileAlt,
} from "react-icons/fa";

const MedicalRecordsPage = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userToken = localStorage.getItem("userToken");

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [recordsError, setRecordsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        if (!userToken || !user?.role || !user?._id) {
          throw new Error("Missing user credentials");
        }

        let endpoint = "";

        switch (user.role) {
          case "Admin":
            endpoint = "/api/records";
            break;
          case "Doctor":
            endpoint = `/api/records/doctor/${user._id}`;
            break;
          case "Patient":
            endpoint = `/api/records/patient/${user._id}`;
            break;
          default:
            throw new Error("Unknown user role");
        }

        const response = await fetch(`http://localhost:5000${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch medical records");
        }

        const data = await response.json();
        setMedicalRecords(data);
      } catch (err) {
        setRecordsError(err.message);
      } finally {
        setLoadingRecords(false);
      }
    };

    fetchMedicalRecords();
  }, [userToken, user]);

  const filteredRecords = medicalRecords.filter((record) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      record.doctorId?.name?.toLowerCase().includes(searchLower) ||
      record.patientId?.name?.toLowerCase().includes(searchLower) ||
      record.diagnosis?.toLowerCase().includes(searchLower) ||
      record.prescription?.toLowerCase().includes(searchLower) ||
      new Date(record.date).toLocaleDateString().includes(searchTerm)
    );
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const RecordCard = ({ record }) => (
    <div className="border-cl rounded-lg p-5 mb-3">
      <div className="space-y-4">
        {/* Header with Date */}
        <div className="flex justify-between items-center border-gray-100">
          <h3 className="font-semibold text-gray-900">Medical Record</h3>
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
            <FaCalendarAlt className="dark-color text-sm" />
            <span className="text-sm font-medium">
              {new Date(record.date).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* People Information */}
        <div className="grid grid-cols-1 gap-3">
          {(user.role === "Admin" ||
            user.role === "Patient" ||
            user.role === "Doctor") && (
            <div className="flex flex-wrap items-center p-3 bg-gray-50 rounded-lg">
              {/* Doctor Info - Only if user is Admin or Patient */}
              {(user.role === "Admin" || user.role === "Patient") && (
                <>
                  <div className="flex-shrink-0 w-10 h-10 light-bg rounded-full flex items-center justify-center mr-3">
                    <FaUserMd className="dark-color" />
                  </div>
                  <div className="min-w-0 mr-6">
                    <p className="text-xs font-medium dark-color uppercase tracking-wide">
                      Doctor
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {record.doctorId?.name || "N/A"}
                    </p>
                  </div>
                </>
              )}

              {/* Patient Info - Only if user is Admin or Doctor */}
              {(user.role === "Admin" || user.role === "Doctor") && (
                <>
                  <div className="flex-shrink-0 w-10 h-10 light-bg rounded-full flex items-center justify-center mr-3">
                    <FaUser className="dark-color" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-green-700 uppercase tracking-wide">
                      Patient
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {record.patientId?.name || "N/A"}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Medical details */}
        <div className="space-y-3 mt-2">
          {/* Diagnosis */}
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Diagnosis
                </span>
                <p className="text-sm text-gray-700 mt-1">
                  {record.diagnosis || "No diagnosis provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Prescription - if available */}
          {record.prescription && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Prescription
                  </span>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                    {record.prescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes - if available */}
          {record.notes && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Notes
                  </span>
                  <p className="text-sm text-gray-700 mt-1">{record.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loadingRecords) {
    return (
      <DashboardLayout>
        <div className="p-6 flex justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-9 w-full h-full">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Medical Records
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search records..."
                  className="w-full h-[42px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary and Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 light-bg rounded-lg p-4">
          <div className="text-sm dark-color">
            Showing {currentRecords.length} of {filteredRecords.length} records
            {searchTerm && (
              <span>
                {" "}
                for "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 dark-color hover:underline"
                >
                  Clear
                </button>
              </span>
            )}
          </div>

          {/* Pagination */}
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
                          : "hover:bg-gray-100 text-gray-700"
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

        {/* Content */}
        {recordsError ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
            <div className="max-w-md mx-auto">
              <FaFileAlt className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error Loading Records
              </h3>
              <p className="text-red-500 mb-4">{recordsError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
            <div className="max-w-md mx-auto">
              <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Medical Records Found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No medical records available"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {currentRecords.map((record) => (
              <RecordCard key={record._id} record={record} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecordsPage;
