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
router.post('/submit', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  }, createProject);
  
// Get all projects
router.get("/all", getAllProjects);

// Update a project (with optional image upload)
router.put("/update/:id", upload.single("image"), updateProject);

// Delete a project
router.delete("/delete/:id", deleteProject);

export default router;
