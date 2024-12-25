
import express from "express";
import { upload,getTasksreports,submitTaskCompletion } from "../Controllers/Tasksubmitioncontroller.js";
const router = express.Router();

// Route to handle task completion
router.post("/submittask", upload.fields([{ name: "file" }, { name: "image" }]), submitTaskCompletion);
router.get("/getsubmitedtasks", getTasksreports);

export default router;
