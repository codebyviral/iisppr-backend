import express from "express";
import { ensureAuthenticated } from "../middlewares/authMiddleware"; // Your middleware for JWT authentication
import {
  createLeaveApplication,
  getAllLeaveApplications,
  updateLeaveApplicationStatus,
} from "../Controllers/LeaveApplication";

const router = express.Router();

// Route for creating a leave application (User - authenticated only)
router.post("/leave", ensureAuthenticated, createLeaveApplication);

// Route for getting all leave applications (Admin - authenticated and authorized)
router.get(
  "/leave",
  ensureAuthenticated,
  //   checkAdminRole,          required to create checkAdminRole function to check
  getAllLeaveApplications
);

// Route for updating leave application status (Admin - approve/disapprove)
router.put(
  "/leave/:applicationId",
  ensureAuthenticated,
  //   checkAdminRole,        required to create checkAdminRole function to check
  updateLeaveApplicationStatus
);

export default router;
