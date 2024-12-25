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
        // Allow jpeg, jpg, png, gif, and webp
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extName = allowedTypes.test(file.originalname.split('.').pop().toLowerCase());

        if (mimeType && extName) {
            return cb(null, true); // Accept the file
        }
        cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)."));
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
  
// DELETE: Delete a project by ID
export const deleteProject = async (req, res) => {
  try {
      const { id } = req.params;

      if (!id) {
          return res.status(400).json({ error: "Project ID is required." });
      }

      const project = await Project.findByIdAndDelete(id);

      if (!project) {
          return res.status(404).json({ error: "Project not found." });
      }

      res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "An error occurred while deleting the project." });
  }
};

// PUT: Update a project by ID
export const updateProject = async (req, res) => {
  try {
      const { id } = req.params;
      const { title, subTitle, description, createdBy } = req.body;

      if (!id) {
          return res.status(400).json({ error: "Project ID is required." });
      }

      // Build the update object dynamically
      const updateData = {};
      if (title) updateData.title = title;
      if (subTitle) updateData.subTitle = subTitle;
      if (description) updateData.description = description;
      if (createdBy) updateData.createdBy = createdBy;

      // If a new image is provided
      if (req.file) {
          updateData.image = `/uploads/${req.file.filename}`;
      }

      const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedProject) {
          return res.status(404).json({ error: "Project not found." });
      }

      res.status(200).json({ message: "Project updated successfully.", project: updatedProject });
  } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "An error occurred while updating the project." });
  }
};


export { upload };
