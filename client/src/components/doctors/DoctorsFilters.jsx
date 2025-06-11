export const DoctorsFilters = ({ filter, setFilter, userRole }) => {
  if (userRole !== "Admin") return null;

  return (
    <div className="block">
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
  );
};
