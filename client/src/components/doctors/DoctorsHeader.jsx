import { FaSearch, FaFilter } from "react-icons/fa";

export const DoctorsHeader = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold dark-color">
            Doctors Directory
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search doctors..."
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
