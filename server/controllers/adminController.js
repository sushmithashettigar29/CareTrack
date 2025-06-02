const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Helper function to buld search query
const buildSearchQuery = (role, search) => {
  if (search) {
    return {
      role,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
  }
  return { role };
};

//Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const search = req.query.search || "";
    // const patients = await User.find({ role: "Patient" }).select(
    //   "-password -isApproved"
    // );
    const patients = await User.find(
      buildSearchQuery("Patient", search)
    ).select("-password -isApproved");
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const search = req.query.search || "";
    // const doctors = await User.find({ role: "Doctor" }).select("-password");
    const doctors = await User.find(buildSearchQuery("Doctor", search)).select(
      "-password"
    );
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get unapproved doctors
exports.getUnapprovedDoctors = async (req, res) => {
  const unapproved = await User.find({
    role: "Doctor",
    isApproved: false,
  }).select("-password");
  res.status(200).json(unapproved);
};

//Get approved doctors
exports.getapprovedDoctors = async (req, res) => {
  const approved = await User.find({ role: "Doctor", isApproved: true }).select(
    "-password"
  );
  res.status(200).json(approved);
};

//Approve a doctor
exports.approveDoctor = async (req, res) => {
  const { id } = req.params;
  const doctor = await User.findById(id);

  if (!doctor || doctor.role !== "Doctor") {
    return res.status(404).json({ message: "Doctor not found" });
  }

  doctor.isApproved = true;
  await doctor.save();
  res.status(200).json({ message: "Doctor approved successfully" });
};

// Delete a user (Doctor/Patient)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) return res.status(404).json({ message: "User not found" });

  await User.findByIdAndDelete(id);
  res.status(200).json({ message: "User deleted successfully" });
};

//Admin dashboard statistics
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: "Doctor" });
    const approveDoctors = await User.countDocuments({
      role: "Doctor",
      isApproved: false,
    });
    const pendingDoctors = await User.countDocuments({
      role: "Doctor",
      isApproved: false,
    });
    const totalAppointments = await Appointment.countDocuments();
    const upcomingAppointments = await Appointment.countDocuments({
      date: { $gte: new Date().toISOString().split("T")[0] },
      status: { $ne: "Cancelled" },
    });

    res.status(200).json({
      totalUsers,
      totalDoctors,
      approveDoctors,
      pendingDoctors,
      totalAppointments,
      upcomingAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject a doctor
exports.rejectDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);

    if (!doctor || doctor.role !== "Doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.isRejected = true;
    doctor.isApproved = false;

    await doctor.save();

    res.status(200).json({ message: "Doctor rejected successfully" });
  } catch (error) {
    console.error("Reject doctor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
