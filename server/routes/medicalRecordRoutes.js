const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createMedicalRecord,
  getPatientRecords,
  getDoctorRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
  getAllMedicalRecords,
  getRecordsByAppointment
} = require("../controllers/medicalRecordController");

router.post("/", protect, createMedicalRecord);
router.get("/", protect, getAllMedicalRecords);
router.get("/patient/:id", protect, getPatientRecords);
router.get("/doctor/:id", protect, getDoctorRecords);
router.put("/:id", protect, updateMedicalRecord);
router.delete("/:id", protect, deleteMedicalRecord);
router.get("/appointment/:id", protect, getRecordsByAppointment);

module.exports = router;
