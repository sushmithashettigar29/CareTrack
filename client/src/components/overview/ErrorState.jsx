import { FaExclamationTriangle } from "react-icons/fa";

export const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center gap-3">
        <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0" />
        <p className="text-red-700 font-medium">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );
};
