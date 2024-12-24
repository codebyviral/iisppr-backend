import express from "express";
import generateReport from "../Controllers/ReportController.js";

const router = express.Router();

router.route("/").get(generateReport);

export default router;
