const express = require("express");
const {
  getDashboardStats,
  manageUsers,
  manageTasks,
  manageAttendance,
  generateReports,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Dashboard Stats
router.get("/dashboard", protect, admin, getDashboardStats);

// User Management
router.get("/users", protect, admin, manageUsers);

// Task Management
router.post("/tasks", protect, admin, manageTasks);

// Attendance Management
router.post("/attendance", protect, admin, manageAttendance);

// Report Generation
router.get("/reports", protect, admin, generateReports);

module.exports = router;
