import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  CheckInTime: {
    type: Date,
    default: function () {
      const currentDate = new Date(); // Get the current local time
      return currentDate; // Store the local time directly
    }, // Automatically records when attendance is marked
  },
  CheckOutTime: {
    type: Date,
  },
});

// Ensure no duplicate attendance for the same intern on the same date
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
export default mongoose.model("Attendance", AttendanceSchema);
