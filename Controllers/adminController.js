import User from "../Models/User.js";
import Task from "../Models/Task";
import Attendance from "../Models/AttendanceModel.js";

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    res.json({ totalUsers, totalTasks, completedTasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
};

// User Management
export const manageUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Task Management
export const manageTasks = async (req, res) => {
  const { title, description, assignedTo, priority, deadline } = req.body;
  try {
    const task = new Task({ title, description, assignedTo, priority, deadline });
    await task.save();
    res.json({ message: "Task Created", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

// Attendance Management
export const manageAttendance = async (req, res) => {
  const { userId, date, status } = req.body;

  try {
    // Ensure no duplicate attendance for the same intern on the same date
    const existingAttendance = await Attendance.findOne({ userId, date });

    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance already marked for this date" });
    }

    const attendance = new Attendance({ userId, date, status });
    await attendance.save();
    res.json({ message: "Attendance Marked", attendance });
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance", error });
  }
};

// Report Generation
export const generateReports = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ message: "Report Generated", tasks });
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error });
  }
};
