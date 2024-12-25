import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js";
import TaskCompletion from "../Models/Tasksubmition.js";
import { ensureAuthenticated } from "../Middlewares/Auth.js";

// Configure Multer for Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "task_files", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "pdf", "docx", "webp"], // Allowed file formats
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

// Controller for submitting task completion data
export const submitTaskCompletion = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;  

    if (!userId) {
      return res.status(403).json({ message: "Unauthorized. User information is missing." });
    }

    const { taskId, comments } = req.body;  // Extract taskId from the request body

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required." });  // Ensure taskId is provided
    }

    if (!comments) {
      return res.status(400).json({ error: "Comments/Description are required." });
    }

    // Extract and handle files as before
    const fileData = req.files || {};
    const uploadedFiles = {};

    if (fileData.file) {
      uploadedFiles.file = fileData.file[0].path;
    }
    if (fileData.image) {
      uploadedFiles.image = fileData.image[0].path;
    }

    // Create and save the task completion
    const taskCompletion = new TaskCompletion({
      user: userId,
      task: taskId,  // Pass the taskId as a reference (ObjectId) here
      comments,
      file: uploadedFiles.file || null,
      image: uploadedFiles.image || null,
    });

    await taskCompletion.save();
    res.status(201).json({ message: "Task submitted successfully.", taskCompletion });
  } catch (error) {
    console.error("Error submitting task:", error);
    res.status(500).json({ error: "An error occurred while submitting the task." });
  }
};


export const getTasksreports = async (req, res) => {
  try {
    const tasks = await TaskCompletion.find().sort({ createdAt: -1 }); // Fetch tasks sorted by creation date (latest first)
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "An error occurred while fetching tasks." });
  }
};

// Export the Multer upload function for use in routes
export { upload };