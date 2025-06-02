const Doctor = require("../models/User");

exports.getAllApprovedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ role: "Doctor", isApproved: true });
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Error fetching doctor" });
  }
};
