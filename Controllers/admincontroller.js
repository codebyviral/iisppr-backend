import User from "../Models/User.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinaryConfig.js";

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "profile_picture", // Folder in cloudinary bucket
        allowed_formats: ["jpeg", "jpg", "png", "gif", "webp"], // Allowed file formats
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Function to update user details, including profile picture
export const updateUser = async (req, res) => {
    try {
        const { userid } = req.params; // Extract user ID from route parameters
        const updates = req.body; // Get updates from the request body

        // If a file is uploaded, include its URL in the updates
        if (req.file) {
            updates.profilePicture = req.file.path; // Cloudinary stores the file URL in `path`
        }

        console.log("id:", userid, "updates:", updates);

        const updatedUser = await User.findByIdAndUpdate(userid, updates, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules are applied
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", data: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// Middleware to handle file uploads
export const uploadProfilePicture = upload.single("profilePicture");

// Function to get all users for admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json({ message: "Users fetched successfully", data: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};
// Function to delete a user
export const deleteUser = async (req, res) => {
    try {
        const { userid } = req.params; // Extract user ID from route parameters

        console.log(`Deleting user with ID: ${userid}`);

        const deletedUser = await User.findByIdAndDelete(userid); // Delete user from database
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", data: deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};
