const Task = require("../models/Task");

// Add a Task
const addTask = async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;

  const task = new Task({
    title,
    description,
    assignedTo,
    dueDate,
    createdBy: req.user.id,
  });

  try {
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(400).json({ message: "Task creation failed" });
  }
};

// Generate Report (Example)
const generateReport = async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "name email");
  res.json(tasks);
};

module.exports = { addTask, generateReport };
