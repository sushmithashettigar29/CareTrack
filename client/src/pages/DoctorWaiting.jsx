import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorWaiting = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-xl mb-4">Waiting for Approval</h2>
        <p>
          Your account is currently under review by the admin. Once approved,
          you will have access to the doctor dashboard.
        </p>
        <button
          onClick={() => navigate("/patient-dashboard")}
          className="w-full py-2 bg-gray-500 text-white rounded mt-4"
        >
          Go to Patient Dashboard
        </button>
      </div>
    </div>
  );
};

export default DoctorWaiting;
