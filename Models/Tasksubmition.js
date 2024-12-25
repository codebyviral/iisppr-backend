import mongoose from "mongoose";

const TaskCompletionSchema = new mongoose.Schema(
  {
    comments: { type: String, required: true },
    file: { type: String },
    image: { type: String }, 
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const TaskCompletion = mongoose.model("TaskCompletion", TaskCompletionSchema);

export default TaskCompletion;
