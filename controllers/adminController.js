const User = require("../models/User");
const Task = require("../models/Task");
const Attendance = require("../models/Attendance");

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ status: "Completed" });
  res.json({ totalUsers, totalTasks, completedTasks });
};

// User Management
exports.manageUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// Task Management
exports.manageTasks = async (req, res) => {
  const { title, description, assignedTo, priority, deadline } = req.body;
  const task = new Task({ title, description, assignedTo, priority, deadline });
  await task.save();
  res.json({ message: "Task Created", task });
};

// Attendance Management
exports.manageAttendance = async (req, res) => {
  const { userId, date, status } = req.body;
  const attendance = new Attendance({ userId, date, status });
  await attendance.save();
  res.json({ message: "Attendance Marked", attendance });
};

// Report Generation
exports.generateReports = async (req, res) => {
  const tasks = await Task.find();
  res.json({ message: "Report Generated", tasks });
};
