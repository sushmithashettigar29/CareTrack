import { FaSearch } from "react-icons/fa";

export const AppointmentsHeader = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold dark-color">
            Appointments
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full h-[42px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};