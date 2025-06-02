const express = require("express");
const {
  getAllApprovedDoctors,
  getDoctorById,
} = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Accessible to any logged-in user
router.get("/", protect, getAllApprovedDoctors);
router.get("/:id", protect, getDoctorById);

module.exports = router;
