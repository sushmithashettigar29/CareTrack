const MedicalRecord = require("../models/MedicalRecord");

// Create Medical Record (Doctor Only)
exports.createMedicalRecord = async (req, res) => {
  try {
    if (req.user.role !== "Doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { patientId, diagnosis, prescription, notes } = req.body;

    const record = new MedicalRecord({
      patientId,
      doctorId: req.user._id,
      diagnosis,
      prescription,
      notes,
    });

    await record.save();
    res.status(201).json({ message: "Medical record created", record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Records of a Patient (Patient or Doctor who treated them)
exports.getPatientRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const { search } = req.query;

    // In your controller
if (req.user.role === "Patient" && String(req.user._id) !== String(id)) {
  return res.status(403).json({ message: "Can only view your own records" });
}
    let filter = { patientId: id };

    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      filter.$or = [
        { diagnosis: regex },
        { prescription: regex },
        { notes: regex },
      ];
    }

    const records = await MedicalRecord.find(filter)
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Records Created by a Doctor (Doctor Only)
exports.getDoctorRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const { search } = req.query;

    if (req.user.role !== "Doctor" || req.user._id !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    let filter = { doctorId: id };

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { diagnosis: regex },
        { prescription: regex },
        { notes: regex },
      ];
    }

    const records = await MedicalRecord.find(filter)
      .populate("patientId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update medical record ( Doctor who created the record)
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await MedicalRecord.findById(id);

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    if (
      req.user.role !== "Doctor" ||
      String(record.doctorId) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { diagnosis, prescription, notes } = req.body;

    if (diagnosis) record.diagnosis = diagnosis;
    if (prescription) record.prescription = prescription;
    if (notes) record.notes = notes;

    await record.save();
    res.status(200).json({ message: "Medical record updated", record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete medical record (admin or doctor who created the record)
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await MedicalRecord.findById(id);

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    if (
      req.user.role !== "Admin" &&
      String(record.doctorId) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await record.deleteOne();
    res.status(200).json({ message: "Medical record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
