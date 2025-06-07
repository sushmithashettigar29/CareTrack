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
    <div className="flex min-h-screen white-bg">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={`${
          collapsed ? "ml-24" : "ml-60"
        } flex flex-col w-full transition-all duration-300`}
      >
        <header
          className={`flex justify-between items-center px-3 ${
            collapsed ? "py-3 mx-2" : "py-0 mx-3"
          } mt-3 medium-bg sticky rounded-lg`}
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
                src={`https://ui-avatars.com/api/?name=${user.name}&background=006a71&color=f2efe7`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-3">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
