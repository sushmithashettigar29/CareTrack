import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Spinner } from "../components/Spinner";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

const MedicalRecordsPage = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userToken = localStorage.getItem("userToken");

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [recordsError, setRecordsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

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

  // Filter records based on search term
  const filteredRecords = medicalRecords.filter((record) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (record.doctorId?.name?.toLowerCase().includes(searchLower)) ||
      (record.patientId?.name?.toLowerCase().includes(searchLower)) ||
      (record.diagnosis?.toLowerCase().includes(searchLower)) ||
      (record.prescription?.toLowerCase().includes(searchLower)) ||
      (new Date(record.date).toLocaleDateString().includes(searchTerm))
    );
  });

  // Get current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
      <div className="space-y-6 p-6">
        {/* Header with title, search, and pagination */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Medical Records</h2>
            {user.role === "Admin" && (
              <p className="text-gray-600">Admin view: View all records.</p>
            )}
            {user.role === "Doctor" && (
              <p className="text-gray-600">Doctor view: View patient records.</p>
            )}
            {user.role === "Patient" && (
              <p className="text-gray-600">Patient view: View your history.</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            {/* Search */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search records..."
                className="w-full h-[42px] pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>

            {/* Pagination Controls */}
            {filteredRecords.length > recordsPerPage && (
              <div className="flex items-center h-[42px] bg-white rounded-lg shadow-sm">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`h-full px-3 flex items-center ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <FaChevronLeft />
                </button>
                
                <div className="flex h-full">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`w-10 h-full flex items-center justify-center ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`h-full px-3 flex items-center ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Records Table */}
        {recordsError ? (
          <p className="text-red-500">{recordsError}</p>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No medical records found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-blue-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  {user.role === "Admin" && (
                    <>
                      <th className="py-3 px-4 text-left border">Doctor</th>
                      <th className="py-3 px-4 text-left border">Patient</th>
                    </>
                  )}
                  {user.role === "Doctor" && (
                    <th className="py-3 px-4 text-left border">Patient</th>
                  )}
                  {user.role === "Patient" && (
                    <th className="py-3 px-4 text-left border">Doctor</th>
                  )}
                  <th className="py-3 px-4 text-left border">Diagnosis</th>
                  <th className="py-3 px-4 text-left border">Prescription</th>
                  <th className="py-3 px-4 text-left border">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    {user.role === "Admin" && (
                      <>
                        <td className="py-3 px-4 border">
                          {record.doctorId?.name || "N/A"}
                        </td>
                        <td className="py-3 px-4 border">
                          {record.patientId?.name || "N/A"}
                        </td>
                      </>
                    )}
                    {user.role === "Doctor" && (
                      <td className="py-3 px-4 border">
                        {record.patientId?.name || "N/A"}
                      </td>
                    )}
                    {user.role === "Patient" && (
                      <td className="py-3 px-4 border">
                        {record.doctorId?.name || "N/A"}
                      </td>
                    )}
                    <td className="py-3 px-4 border">{record.diagnosis}</td>
                    <td className="py-3 px-4 border whitespace-pre-line">
                      {record.prescription}
                    </td>
                    <td className="py-3 px-4 border">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecordsPage;