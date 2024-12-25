import mongoose from "mongoose";

const TaskCompletionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
    },
    task:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    comments: { type: String, required: true },
    file: { type: String },
    image: { type: String },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const TaskCompletion = mongoose.model("TaskCompletion", TaskCompletionSchema);

export default TaskCompletion;
