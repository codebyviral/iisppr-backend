import express from "express";
import { createProject, getAllProjects, upload } from "../Controllers/Projectcontroller.js";
const router = express.Router();

// POST /api/projects - Create a new project
router.post("/submit", upload.single("image"), createProject);

// GET /api/projects - Get all projects
router.get("/all", getAllProjects);

export default router;
