import express from "express";
import { submitWeeklyStatus, getAllWeeklyStatusReports } from "../Controllers/Submitreport.js";

const router = express.Router();

// POST: Submit a Weekly Status Report
router.post("/submit", submitWeeklyStatus);

// GET: Retrieve all Weekly Status Reports
router.get("/reports", getAllWeeklyStatusReports);

export default router;
