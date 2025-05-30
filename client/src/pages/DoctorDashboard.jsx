import React from "react";

const DoctorDashboard = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, Dr. {user?.name}</h1>
      <p className="mt-4">
        This is your doctor dashboard. You can view and manage appointments,
        patients, etc.
      </p>
    </div>
  );
};

export default DoctorDashboard;
