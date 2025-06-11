import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaCalendarCheck, FaUserCheck, FaUserClock } from "react-icons/fa";

export const DoctorStats = ({ data }) => {
  const getPercent = (value, max) => {
    if (!value || !max || max === 0) return 0;
    return Math.min(100, Math.round((value / max) * 100));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="text-center border-transparent p-5 bg-amber-50 rounded-xl shadow">
        <div className="w-24 h-24 mx-auto mb-4">
          <CircularProgressbar
            value={getPercent(data.totalAppointments, 100)}
            text={`${data.totalAppointments || 0}`}
            styles={buildStyles({
              pathColor: "#ca8a04",
              textColor: "#854d0e",
              trailColor: "#e5e7eb",
              textSize: "28px",
              pathTransitionDuration: 1.5,
            })}
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-yellow-700 font-semibold mb-1">
          <FaCalendarCheck className="w-4 h-4" />
          <span>Total Appointments</span>
        </div>
      </div>

      <div className="text-center border-transparent p-5 bg-blue-50 rounded-xl shadow">
        <div className="w-24 h-24 mx-auto mb-4">
          <CircularProgressbar
            value={getPercent(data.Confirmed, data.totalAppointments || 1)}
            text={`${data.Confirmed || 0}`}
            styles={buildStyles({
              pathColor: "#2563eb",
              textColor: "#1e40af",
              trailColor: "#e5e7eb",
              textSize: "28px",
              pathTransitionDuration: 1.5,
            })}
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-blue-700 font-semibold mb-1">
          <FaUserCheck className="w-4 h-4" />
          <span>Confirmed</span>
        </div>
      </div>

      <div className="text-center border-transparent p-5 bg-purple-50 rounded-xl shadow">
        <div className="w-24 h-24 mx-auto mb-4">
          <CircularProgressbar
            value={getPercent(data.Pending || 0, data.totalAppointments || 1)}
            text={`${data.Pending || 0}`}
            styles={buildStyles({
              pathColor: "#8b5cf6",
              textColor: "#5b21b6",
              trailColor: "#e5e7eb",
              textSize: "28px",
              pathTransitionDuration: 1.5,
            })}
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-purple-700 font-semibold mb-1">
          <FaUserClock className="w-4 h-4" />
          <span>Pending</span>
        </div>
      </div>

      <div className="text-center border-transparent p-5 bg-red-50 rounded-xl shadow">
        <div className="w-24 h-24 mx-auto mb-4">
          <CircularProgressbar
            value={getPercent(data.Cancelled, data.totalAppointments || 1)}
            text={`${data.Cancelled || 0}`}
            styles={buildStyles({
              pathColor: "#dc2626",
              textColor: "#991b1b",
              trailColor: "#e5e7eb",
              textSize: "28px",
              pathTransitionDuration: 1.5,
            })}
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-red-700 font-semibold mb-1">
          <FaUserClock className="w-4 h-4" />
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
};
