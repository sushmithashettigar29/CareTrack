import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaFileMedical,
  FaSignOutAlt,
  FaCalendarAlt,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();

  // Sync collapse state with parent on resize
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    // Call once on mount
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const menuItems = [
    {
      to: "/overview",
      icon: <FaHome className="text-xl" />,
      label: "Overview",
    },
    {
      to: "/appointments",
      icon: <FaCalendarAlt className="text-xl" />,
      label: "Appointments",
    },
    {
      to: "/get-appointment",
      icon: <FaRegCalendarCheck className="text-xl" />,
      label: "Get Appointment",
    },
    {
      to: "/doctors",
      icon: <FaUserMd className="text-xl" />,
      label: "Doctors",
    },
    {
      to: "/medical-records",
      icon: <FaFileMedical className="text-xl" />,
      label: "Medical Records",
    },
  ];

  return (
    <>
      <aside
        className={`h-[95vh] ${
          collapsed ? "w-20" : "w-56"
        } medium-bg shadow-md m-3 fixed flex flex-col justify-between rounded-lg transition-all duration-300`}
      >
        <div className="p-4">
          <h1
            className={`${
              collapsed ? "text-sm" : "text-2xl"
            } font-bold dark-color text-center white-bg p-2 rounded-sm w-full mb-6`}
          >
            {collapsed ? "CT" : "CareTrack"}
          </h1>

          <nav className="space-y-4 white-color text-base">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-blue-100 hover-dark-color ${
                  collapsed ? "justify-center" : "justify-start"
                }`}
                data-tooltip-id={collapsed ? "sidebar-tip" : ""}
                data-tooltip-content={item.label}
              >
                {item.icon}
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 p-3 rounded-lg white-color hover-dark-bg w-full text-left mt-16 hover:cursor-pointer ${
                collapsed ? "justify-center" : "justify-start"
              }`}
              data-tooltip-id={collapsed ? "sidebar-tip" : ""}
              data-tooltip-content="Logout"
            >
              <FaSignOutAlt className="text-xl" />
              {!collapsed && <span className="font-medium">Logout</span>}
            </button>
          </nav>
        </div>
      </aside>

      {collapsed && (
        <Tooltip
          id="sidebar-tip"
          place="right"
          effect="solid"
          style={{
            backgroundColor: "#006a71",
            color: "white",
            zIndex: 9999,
          }}
        />
      )}
    </>
  );
}

export default Sidebar;
