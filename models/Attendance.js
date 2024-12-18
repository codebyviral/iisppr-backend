const mongoose = require("mongoose");

// Define the schema
const attendanceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true, enum: ["present", "absent", "leave"] },
});

// Export the model
module.exports = mongoose.model("Attendance", attendanceSchema);
