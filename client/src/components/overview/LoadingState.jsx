import { FaSpinner } from "react-icons/fa";

export const LoadingState = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <FaSpinner className="animate-spin dark-color mx-auto h-12 w-12 mb-4" />
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );
};
