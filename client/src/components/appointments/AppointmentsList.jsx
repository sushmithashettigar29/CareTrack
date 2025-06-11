import { AppointmentCard } from "../appointments/AppointmentCard";

export const AppointmentsList = ({
  currentAppointments,
  user,
  handleStatusChange,
  handleDeleteAppointment,
  handleViewDetails,
  handleEdit,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {currentAppointments.map((appointment) => (
        <AppointmentCard
          key={appointment._id}
          appointment={appointment}
          user={user}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteAppointment}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
};
