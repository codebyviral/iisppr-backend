import Project from "../Models/Projects.js";
import multer from "multer";

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "projectimageuploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });
  

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const mimeType = allowedTypes.test(file.mimetype);
      const extName = allowedTypes.test(file.originalname.split('.').pop().toLowerCase());
      if (mimeType && extName) {
        return cb(null, true);
      }
      cb(new Error("Only image files are allowed (jpeg, jpg, png, gif)."));
    },
  });
  
// POST: Create a new project
export const createProject = async (req, res) => {
    try {
      const { title, subTitle, description, createdBy } = req.body;
      if (!title || !description || !createdBy || !req.file) {
        return res.status(400).json({ error: "All fields and an image are required." });
      }
      const project = new Project({
        title,
        subTitle,
        description,
        image: `/uploads/${req.file.filename}`,
        createdBy,
      });
      await project.save();
      res.status(201).json({ message: "Project created successfully.", project });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "An error occurred while creating the project." });
    }
  };
  
export const getAllProjects = async (req, res) => {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "An error occurred while fetching projects." });
    }
  };
  

export { upload };
