const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { bookAppointment, getAllAppointments, getMyAppointments, updateAppointmentStatus, deleteAppointment } = require("../controllers/appointmentController");


router.post("/", protect, bookAppointment);
router.get("/all", protect, getAllAppointments);
router.get("/my", protect, getMyAppointments);
router.put("/:id", protect, updateAppointmentStatus);
router.delete("/:id", protect, deleteAppointment);

module.exports = router;