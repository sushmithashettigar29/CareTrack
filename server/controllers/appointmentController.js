const Appointment = require("../models/Appointment");

// Book Appointment (patients only)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    const newAppointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      time,
      reason,
    });

    res
      .status(201)
      .json({ message: "Appointment Booked", appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments (Admin only)
exports.getAllAppointments = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { search, date, status } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    let appointments = await Appointment.find(query)
      .populate("doctorId", "name email specialization")
      .populate("patientId", "name email");

    if (search) {
      const keyword = search.toLowerCase();
      appointments = appointments.filter(
        (app) =>
          app.patientId.name.toLowerCase().includes(keyword) ||
          app.patientId.email.toLowerCase().includes(keyword) ||
          app.doctorId.name.toLowerCase().includes(keyword) ||
          app.doctorId.email.toLowerCase().includes(keyword)
      );
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in user's appointments (Doctor/ Patient)
exports.getMyAppointments = async (req, res) => {
  try {
    let query;
    if (req.user.role === "Doctor") {
      query = { doctorId: req.user._id };
    } else if (req.user.role === "Patient") {
      query = { patientId: req.user.id };
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointments = await Appointment.find(query)
      .populate("doctorId", "name email specialization")
      .populate("patientId", "name email");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status (Doctor / Admin)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      req.user.role !== "Admin" &&
      String(appointment.doctorId) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ message: "Status updated", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Appointment (Admin / Patient)
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      req.user.role !== "Admin" &&
      String(appointment.patientId) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await appointment.deleteOne();
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
