import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  FaUserMd,
  FaUserClock,
  FaUserInjured,
  FaNotesMedical,
} from "react-icons/fa";

export const AdminStats = ({ data }) => {
  const getPercent = (value, max) => {
    if (!value || !max || max === 0) return 0;
    return Math.min(100, Math.round((value / max) * 100));
  };

  const adminMaxDoctors = Math.max(100, data?.totalDoctors || 0);
  const adminMaxPending = Math.max(20, data?.pendingDoctorApprovals || 0);
  const adminMaxPatients = Math.max(150, data?.totalPatients || 0);
  const adminMaxRecords = Math.max(300, data?.totalMedicalRecords || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="text-center border-transparent p-5 bg-blue-50 rounded-xl shadow">
        <div className="w-24 h-24 mx-auto mb-4">
          <CircularProgressbar
            value={getPercent(data.totalDoctors, adminMaxDoctors)}
            text={`${data.totalDoctors || 0}`}
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
          <FaUserMd className="w-4 h-4" />
          <span>Approved Doctors</span>
        </div>
      </div>

      <div className="text-center border-transparent p-5 bg-amber-50 rounded-xl shadow">
        <div className="w-24 h-24 mx-auto mb-4">
          <CircularProgressbar
            value={getPercent(data.pendingDoctorApprovals, adminMaxPending)}
            text={`${data.pendingDoctorApprovals || 0}`}
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
          <FaUserClock className="w-4 h-4" />
          <span>Pending Approvals</span>
        </div>
      </div>

      <div className="text-center border-transparent p-5 bg-green-50 rounded-xl shadow">
        <div className="w-24 h-24 mx-auto mb-4">
          <CircularProgressbar
            value={getPercent(data.totalPatients, adminMaxPatients)}
            text={`${data.totalPatients || 0}`}
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
          <FaUserInjured className="w-4 h-4" />
          <span>Total Patients</span>
        </div>
      </div>

      <div className="text-center border-transparent p-5 bg-purple-50 rounded-xl shadow">
        <div className="w-24 h-24 mx-auto mb-4">
          <CircularProgressbar
            value={getPercent(data.totalMedicalRecords, adminMaxRecords)}
            text={`${data.totalMedicalRecords || 0}`}
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
          <FaNotesMedical className="w-4 h-4" />
          <span>Medical Records</span>
        </div>
      </div>
    </div>
  );
};
