import mongoose from "mongoose";

const { Schema } = mongoose;

const LeaveApplicationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Ensure this references your User model correctly
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Disapproved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const LeaveApplication = mongoose.model("LeaveApplication", LeaveApplicationSchema);

export default LeaveApplication;
