import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const MedicalRecordsPage = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userToken = localStorage.getItem("userToken");

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [recordsError, setRecordsError] = useState(null);

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

  if (loadingRecords) {
    return <div className="p-8">Loading medical records...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Medical Records</h2>

        {user.role === "Admin" && (
          <p className="mb-2 text-gray-600">Admin view: View all records.</p>
        )}
        {user.role === "Doctor" && (
          <p className="mb-2 text-gray-600">
            Doctor view: View patient records.
          </p>
        )}
        {user.role === "Patient" && (
          <p className="mb-2 text-gray-600">Patient view: View your history.</p>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Records List</h2>
          {recordsError ? (
            <p className="text-red-500">{recordsError}</p>
          ) : medicalRecords.length === 0 ? (
            <p className="text-green-600">No medical records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    {user.role === "Admin" && (
                      <>
                        <th className="py-2 px-4 text-left border">Doctor</th>
                        <th className="py-2 px-4 text-left border">Patient</th>
                      </>
                    )}
                    {user.role === "Doctor" && (
                      <th className="py-2 px-4 text-left border">Patient</th>
                    )}
                    {user.role === "Patient" && (
                      <th className="py-2 px-4 text-left border">Doctor</th>
                    )}
                    <th className="py-2 px-4 text-left border">Diagnosis</th>
                    <th className="py-2 px-4 text-left border">Prescription</th>
                    <th className="py-2 px-4 text-left border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {medicalRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      {user.role === "Admin" && (
                        <>
                          <td className="py-2 px-4 border">
                            {record.doctorId?.name || "N/A"}
                          </td>
                          <td className="py-2 px-4 border">
                            {record.patientId?.name || "N/A"}
                          </td>
                        </>
                      )}
                      {user.role === "Doctor" && (
                        <td className="py-2 px-4 border">
                          {record.patientId?.name || "N/A"}
                        </td>
                      )}
                      {user.role === "Patient" && (
                        <td className="py-2 px-4 border">
                          {record.doctorId?.name || "N/A"}
                        </td>
                      )}
                      <td className="py-2 px-4 border">{record.diagnosis}</td>
                      <td className="py-2 px-4 border whitespace-pre-line">
                        {record.prescription}
                      </td>
                      <td className="py-2 px-4 border">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecordsPage;
