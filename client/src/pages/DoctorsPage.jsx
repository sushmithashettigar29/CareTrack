import React, { useEffect, useState } from "react";
import { FaUserMd, FaEnvelope, FaPhone } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedUser = localStorage.getItem("userInfo");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!user || !user.token) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const url =
          user?.role === "Admin"
            ? "http://localhost:5000/api/admin/doctors"
            : "http://localhost:5000/api/doctors";

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await res.json();
        setDoctors(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [user]);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/approve-doctor/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to approve doctor");

      setDoctors((prev) =>
        prev.map((doc) => (doc._id === id ? { ...doc, isApproved: true } : doc))
      );
    } catch (err) {
      alert(err.message || "Approve failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/delete-user/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete doctor");

      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/reject-doctor/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to reject doctor");

      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === id ? { ...doc, isRejected: true, isApproved: false } : doc
        )
      );
    } catch (err) {
      alert(err.message || "Reject failed");
    }
  };

  if (loading) return <div className="p-6">Loading doctors...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">All Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="border rounded-2xl p-4 shadow-md bg-white"
            >
              <div className="flex items-center gap-4">
                <FaUserMd className="text-3xl text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold">{doc.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {doc.specialization || "General"}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FaEnvelope /> {doc.email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FaPhone /> {doc.phone}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {(user?.role === "Patient" || user?.role === "Doctor") && (
                  <button
                    onClick={() =>
                      alert(`Book appointment with Dr. ${doc.name}`)
                    }
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  >
                    Get Appointment
                  </button>
                )}

                {user?.role === "Admin" && (
                  <>
                    <button
                      onClick={() => handleApprove(doc._id)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                      disabled={doc.isApproved}
                      title={
                        doc.isApproved ? "Already approved" : "Approve doctor"
                      }
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(doc._id)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 disabled:opacity-50"
                      disabled={doc.isRejected}
                      title={
                        doc.isRejected ? "Already rejected" : "Reject doctor"
                      }
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DoctorsPage;
