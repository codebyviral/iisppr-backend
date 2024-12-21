import mongoose from "mongoose";
import moment from 'moment';

const { Schema } = mongoose;

// Define the Task schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model to whom the task is assigned
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
      set: (value) => moment(value).format('YYYY-MM-DD'), // Formatting date
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Task model
const Task = mongoose.model("Task", taskSchema);

export default Task;
