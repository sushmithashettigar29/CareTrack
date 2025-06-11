import { useEffect, useState } from "react";
import Sidebar from "../pages/Sidebar";

const DashboardLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("userInfo")) || {
    name: "User",
    role: "Unknown",
  };

  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen h-screen">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Right Side */}
      <div
        className={`${
          collapsed ? "ml-24" : "ml-60"
        } flex flex-col w-full transition-all duration-300 min-h-screen h-screen`}
      >
        {/* Header */}
        <header
          className={`flex justify-between items-center px-3 ${
            collapsed ? "py-3 mx-2" : "py-0 mx-3"
          } mt-3 dark-bg sticky rounded-lg`}
        >
          <div className="w-full max-w-md">
            <h3
              className={`font-semibold white-color ${
                collapsed ? "text-md pl-1" : "text-xl p-4"
              }`}
            >
              Welcome, {user.name}!
            </h3>
          </div>
          <div className="flex items-center gap-2 pr-2">
            {!collapsed && (
              <div className="text-right">
                <div className="font-semibold white-color">{user.name}</div>
                <div className="text-sm white-color capitalize">
                  {user.role}
                </div>
              </div>
            )}
            <div
              className={`${
                collapsed ? "w-9 h-9" : "w-10 h-10"
              } rounded-full overflow-hidden`}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}&background=b9d4aa8c&color=f2efe7`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-3 min-h-0">
          <div className="flex-grow h-full rounded-lg">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
