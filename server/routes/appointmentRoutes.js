const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  bookAppointment,
  getAllAppointments,
  getMyAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  editAppointmentByPatient,
} = require("../controllers/appointmentController");

router.post("/", protect, bookAppointment);
router.get("/all", protect, adminOnly, getAllAppointments);
router.get("/my", protect, getMyAppointments);
router.put("/:id", protect, updateAppointmentStatus);
router.delete("/:id", protect, deleteAppointment);
router.put("/edit/:id", protect, editAppointmentByPatient);

module.exports = router;
