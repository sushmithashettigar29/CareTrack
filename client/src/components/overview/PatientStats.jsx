import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaCalendarCheck, FaFileMedical } from "react-icons/fa";

export const PatientStats = ({ data }) => {
  const getPercent = (value, max) => {
    if (!value || !max || max === 0) return 0;
    return Math.min(100, Math.round((value / max) * 100));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="text-center border-transparent p-5 bg-blue-50 rounded-xl shadow">
        <div className="w-24 h-24 mx-auto mb-4">
          <CircularProgressbar
            value={getPercent(data.appointmentCount, 20)}
            text={`${data.appointmentCount || 0}`}
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
          <FaCalendarCheck className="w-4 h-4" />
          <span>Total Appointments</span>
        </div>
      </div>

      <div className="text-center border-transparent p-5 bg-green-50 rounded-xl shadow">
        <div className="w-24 h-24 mx-auto mb-4">
          <CircularProgressbar
            value={getPercent(data.medicalRecordCount, 50)}
            text={`${data.medicalRecordCount || 0}`}
            styles={buildStyles({
              pathColor: "#16a34a",
              textColor: "#166534",
              trailColor: "#e5e7eb",
              textSize: "28px",
              pathTransitionDuration: 1.5,
            })}
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-green-700 font-semibold mb-1">
          <FaFileMedical className="w-4 h-4" />
          <span>Medical Records</span>
        </div>
      </div>
    </div>
  );
};
