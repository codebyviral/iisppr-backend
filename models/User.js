const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "manager", "intern"], default: "intern" },
  startDate: Date,
  endDate: Date,
});

module.exports = mongoose.model("User", UserSchema);
