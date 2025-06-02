import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const PatientDashboard = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userToken = localStorage.getItem("userToken");

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);

  // Medical Records state
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [recordsError, setRecordsError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!userToken) throw new Error("No authentication token found");

        const response = await fetch(
          "http://localhost:5000/api/appointments/my",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch appointments");

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setAppointmentsError(err.message);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [userToken]);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        if (!userToken || !user?._id)
          throw new Error("Missing user information");

        const response = await fetch(
          `http://localhost:5000/api/records/patient/${user._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch medical records");

        const data = await response.json();
        setMedicalRecords(data);
      } catch (err) {
        setRecordsError(err.message);
      } finally {
        setLoadingRecords(false);
      }
    };

    if (user?._id) fetchMedicalRecords();
  }, [userToken, user?._id]);

  if (loadingAppointments || loadingRecords) {
    return <div className="p-8">Loading data...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>

        {/* Appointments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
          {appointmentsError ? (
            <p className="text-red-500">{appointmentsError}</p>
          ) : appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="border p-4 rounded-lg">
                  <h3 className="font-medium">
                    Appointment with {appointment.doctorId?.name}
                  </h3>
                  <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                  <p>Time: {appointment.time}</p>
                  <p>
                    Status:{" "}
                    <span
                      className={
                        appointment.status === "Confirmed"
                          ? "text-green-500"
                          : appointment.status === "Cancelled"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }
                    >
                      {appointment.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medical Records Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
          {recordsError ? (
            <p className="text-red-500">{recordsError}</p>
          ) : medicalRecords.length === 0 ? (
            <p>No medical records found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Doctor</th>
                    <th className="py-2 px-4 text-left">Diagnosis</th>
                    <th className="py-2 px-4 text-left">Prescription</th>
                    <th className="py-2 px-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {medicalRecords.map((record) => (
                    <tr key={record._id} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">
                        {record.doctorId?.name || "N/A"}
                      </td>
                      <td className="py-2 px-4">{record.diagnosis}</td>
                      <td className="py-2 px-4 whitespace-pre-line">
                        {record.prescription}
                      </td>
                      <td className="py-2 px-4">
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

export default PatientDashboard;
