import express from "express";
import { addTask, generateReport } from "../Controllers/taskController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Add Task
router.post("/task", protect, addTask);

// Generate Report
router.get("/report", protect, generateReport);

export default router;
