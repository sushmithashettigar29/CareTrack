import { MedicalRecordForm } from "../appointments/MedicalRecordForm";
import Modal from "../Modal";

export const AppointmentDetailsModal = ({
  selectedAppointment,
  showDetailsModal,
  setShowDetailsModal,
  showRecordForm,
  setShowRecordForm,
  setIsEditingRecord,
  setSelectedRecord,
  user,
  handleCreateRecord,
  selectedRecord,
  handleRecordSuccess,
}) => {
  if (!selectedAppointment) return null;

  return (
    <Modal
      onClose={() => {
        setShowDetailsModal(false);
        setShowRecordForm(false);
        setIsEditingRecord(false);
        setSelectedRecord(null);
      }}
      title="Appointment Details"
      isOpen={showDetailsModal}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700">Patient</h4>
            <p>{selectedAppointment.patientId?.name || "N/A"}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Doctor</h4>
            <p>{selectedAppointment.doctorId?.name || "N/A"}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Date & Time</h4>
            <p>
              {new Date(selectedAppointment.date).toLocaleDateString()} at{" "}
              {selectedAppointment.time}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Status</h4>
            <p>{selectedAppointment.status}</p>
          </div>
          <div className="col-span-2">
            <h4 className="font-medium text-gray-700">Reason</h4>
            <p>{selectedAppointment.reason || "-"}</p>
          </div>
        </div>

        {user?.role === "Doctor" && (
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Medical Records</h3>
              {!showRecordForm && (
                <button
                  onClick={handleCreateRecord}
                  className="px-3 py-3 dark-bg font-bold text-white rounded text-sm hover:bg-blue-700"
                >
                  Create New Record
                </button>
              )}
            </div>
            {showRecordForm && (
              <MedicalRecordForm
                appointment={selectedAppointment}
                record={selectedRecord}
                onSuccess={handleRecordSuccess}
                onCancel={() => {
                  setShowRecordForm(false);
                  setIsEditingRecord(false);
                  setSelectedRecord(null);
                }}
              />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
