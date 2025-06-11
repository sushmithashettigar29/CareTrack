import { useState } from "react";
import { Spinner } from "../Spinner";

export const MedicalRecordForm = ({
  appointment,
  record,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    diagnosis: record?.diagnosis || "",
    treatment: record?.treatment || "",
    prescription: record?.prescription || "",
    notes: record?.notes || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userToken = localStorage.getItem("userToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;
      if (record) {
        response = await fetch(
          `http://localhost:5000/api/records/${record._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(formData),
          }
        );
      } else {
        response = await fetch("http://localhost:5000/api/records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            ...formData,
            patientId: appointment.patientId._id,
            appointmentId: appointment._id,
            doctorId: appointment.doctorId._id,
          }),
        });
      }

      if (!response.ok)
        throw new Error(
          record
            ? "Failed to update medical record"
            : "Failed to create medical record"
        );

      const result = await response.json();
      onSuccess(result);
      alert(`Medical record ${record ? "updated" : "created"} successfully`);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Diagnosis
        </label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.diagnosis}
          onChange={(e) =>
            setFormData({ ...formData, diagnosis: e.target.value })
          }
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Treatment
        </label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          value={formData.treatment}
          onChange={(e) =>
            setFormData({ ...formData, treatment: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Prescription
        </label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          value={formData.prescription}
          onChange={(e) =>
            setFormData({ ...formData, prescription: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white dark-bg  focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          {isSubmitting
            ? record
              ? "Updating..."
              : "Saving..."
            : record
            ? "Update Medical Record"
            : "Save Medical Record"}
        </button>
      </div>
    </form>
  );
};
