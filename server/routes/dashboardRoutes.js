const express = require("express");
const router = express.Router();
const {
  getPatientDashboard,
  getDoctorDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");
const {
  protect,
  adminOnly,
  doctorOnly,
  patientOnly,
} = require("../middleware/authMiddleware");

router.get("/patient", protect, patientOnly, getPatientDashboard);
router.get("/doctor", protect, doctorOnly, getDoctorDashboard);
router.get("/admin", protect, adminOnly, getAdminDashboard);

module.exports = router;
