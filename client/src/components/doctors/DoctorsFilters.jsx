export const DoctorsFilters = ({
  filter,
  setFilter,
  showFilters,
  setShowFilters,
  userRole,
}) => {
  if (userRole !== "Admin") return null;

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden sm:block">
        <select
          className="h-[42px] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Doctors</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="sm:hidden bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-gray-600">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Doctors</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      )}
    </>
  );
};
