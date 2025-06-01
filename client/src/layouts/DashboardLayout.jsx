import Sidebar from "../pages/Sidebar";

const DashboardLayout = ({ children }) => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("userInfo")) || {
    name: "User",
    role: "Unknown",
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="ml-69 flex flex-col w-full">
        {/* Top Navbar */}
        <header className="flex justify-between items-center px-8 py-6 bg-white shadow sticky top-4 z-10 rounded-xl mx-4">
          {/* Search Input */}
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}`}
              alt="avatar"
              className="w-10 h-10 rounded-full border"
            />
            <div className="text-right">
              <div className="font-semibold text-gray-800">{user.name}</div>
              <div className="text-sm text-gray-500 capitalize">
                {user.role}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
