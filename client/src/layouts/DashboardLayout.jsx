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
      <div className="ml-60 flex flex-col w-full">
        {/* Top Navbar */}
        <header className="flex justify-between items-center px-3 py-3 mx-3 mt-3 bg-amber-200 sticky rounded-2xl">
          {/* Search Input */}
          <div className="w-full max-w-md">
            <h3 className="text-xl font-semibold pl-4">
              Welcome, {user.name}!
            </h3>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 pr-4">
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
        <main className="flex-1 p-3">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
