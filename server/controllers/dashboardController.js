const Appointment = require("../models/Appointment");
const MedicalRecord = require("../models/MedicalRecord");
const User = require("../models/User");

exports.getPatientDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const appointmentCount = await Appointment.countDocuments({
      patientId: userId,
    });
    const medicalRecordCount = await MedicalRecord.countDocuments({
      patientId: userId,
    });

    res.status(200).json({
      message: `Welcome, ${req.user.name}!`,
      appointmentCount,
      medicalRecordCount,
      showBookAppointment: appointmentCount === 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
};

exports.getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const appointments = await Appointment.find({ doctorId });

    const statusCount = {
      Pending: 0,
      Confirmed: 0,
      Cancelled: 0,
    };

    appointments.forEach((a) => {
      statusCount[a.status]++;
    });

    res.status(200).json({
      totalAppointments: appointments.length,
      ...statusCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({
      role: "Doctor",
      isApproved: true,
    });
    const pendingDcotors = await User.countDocuments({
      role: "Doctor",
      isApproved: false,
    });
    const totalPatients = await User.countDocuments({ role: "Patient" });

    const totalMedicalRecords = await MedicalRecord.countDocuments();

    res.status(200).json({
      totalDoctors,
      totalPatients,
      pendingDoctorApprovals: pendingDcotors,
      totalMedicalRecords,
    });
  } catch (error) {
    res.status(500).json({ error: " Something went wrong." });
  }
};
