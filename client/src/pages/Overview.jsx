/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { EditProfileModal } from "../components/overview/EditProfileModal";
import { UserProfileSection } from "../components/overview/UserProfileSection";
import { PatientStats } from "../components/overview/PatientStats";
import { DoctorStats } from "../components/overview/DoctorStats";
import { AdminStats } from "../components/overview/AdminStats";
import { LoadingState } from "../components/overview/LoadingState";
import { ErrorState } from "../components/overview/ErrorState";

function Overview() {
  const [user, setUser] = useState(
    () =>
      JSON.parse(localStorage.getItem("userInfo")) || {
        name: "User",
        role: "Unknown",
      }
  );
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [, setProfileData] = useState(null);
  const [, setLoadingProfile] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = user.token;
      let endpoint = "";

      if (user.role === "Patient")
        endpoint = "http://localhost:5000/api/dashboard/patient";
      else if (user.role === "Doctor")
        endpoint = "http://localhost:5000/api/dashboard/doctor";
      else if (user.role === "Admin")
        endpoint = "http://localhost:5000/api/dashboard/admin";
      else {
        setError("Invalid role or user not logged in.");
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      setError(null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchUserProfile();
  }, [user]);

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    fetchDashboard();
    fetchUserProfile();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 w-full h-full mb-4">
        {error ? (
          <ErrorState error={error} onRetry={() => window.location.reload()} />
        ) : (
          <>
            <UserProfileSection
              user={user}
              onEditClick={() => setShowEditModal(true)}
            />

            <div className="mb-4 border-gray-200 overflow-hidden">
              <div className="p-6">
                {user.role === "Patient" && data && (
                  <PatientStats data={data} />
                )}

                {user.role === "Doctor" && data && <DoctorStats data={data} />}

                {user.role === "Admin" && data && <AdminStats data={data} />}
              </div>
            </div>
          </>
        )}
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </DashboardLayout>
  );
}

export default Overview;
