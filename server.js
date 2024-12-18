const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;


// Middleware
app.use(express.json());

// MongoDB connection
const mongoURI = "mongodb://127.0.0.1:27017/attendanceDB"; 
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connetion error:", err));

// Routes
const attendanceRoutes = require("./routes/attendance");
app.use("/api/attendance", attendanceRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Welcome to the Attendance API using MongoDB!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
