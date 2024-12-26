import mongoose from "mongoose";
import User from "../Models/User.js";
import Task from "../Models/Task.js";

// Define the schema for the notification
const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Assuming you have a User model to reference
            required: true,
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

// Create the Notification model using the schema
const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
