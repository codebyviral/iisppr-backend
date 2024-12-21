import mongoose from "mongoose";

const { Schema } = mongoose;

// Admin schema definition
const AdminSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mnumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "manager", "intern"],
    default: "admin",  // Default role is admin
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a middleware to automatically update the `updatedAt` field
AdminSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the Admin model
export default mongoose.model("Admin", AdminSchema);
