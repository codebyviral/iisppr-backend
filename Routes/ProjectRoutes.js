import express from "express";
import { 
    createProject, 
    getAllProjects, 
    deleteProject, 
    updateProject, 
    upload 
} from "../Controllers/Projectcontroller.js";

const router = express.Router();

// Create a new project (with image upload)
router.post("/submit", upload.single("image"), createProject);

// Get all projects
router.get("/all", getAllProjects);

// Delete a project
router.delete("/delete/:id", deleteProject);

// Update a project (with optional image upload)
router.put("/update/:id", upload.single("image"), updateProject);

export default router;
