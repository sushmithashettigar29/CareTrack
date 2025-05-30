const express = require("express");
const {
  getAllPatients,
  getAllDoctors,
  getUnapprovedDoctors,
  getapprovedDoctors,
  approveDoctor,
  deleteUser,
  getAdminStats,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/patients", protect, adminOnly, getAllPatients);
router.get("/doctors", protect, adminOnly, getAllDoctors);
router.get("/doctors/unapproved", protect, adminOnly, getUnapprovedDoctors);
router.get("/doctors/approved", protect, adminOnly, getapprovedDoctors);
router.put("/approve-doctor/:id", protect, adminOnly, approveDoctor);
router.delete("/delete-user/:id", protect, adminOnly, deleteUser);
router.get("/stats", protect, adminOnly, getAdminStats);

module.exports = router;
