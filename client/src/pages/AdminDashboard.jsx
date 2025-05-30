import React from "react";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, Admin {user?.name}</h1>
      <p className="mt-4">
        This is the admin dashboard. You can manage users, approve doctors, and
        oversee the system here.
      </p>
    </div>
  );
};

export default AdminDashboard;
