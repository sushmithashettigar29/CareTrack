import { DoctorCard } from "../doctors/DoctorCard";

export const DoctorsList = ({
  currentDoctors,
  userRole,
  onApprove,
  onReject,
  onDelete,
  onBookAppointment,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {currentDoctors.map((doctor) => (
        <DoctorCard
          key={doctor._id}
          doctor={doctor}
          userRole={userRole}
          onApprove={onApprove}
          onReject={onReject}
          onDelete={onDelete}
          onBookAppointment={onBookAppointment}
        />
      ))}
    </div>
  );
};
