import Task from "../Models/Task";

// Add a Task
const addTask = async (req, res) => {
  const { title, description, assignedTo, dueDate, priority, status } = req.body;

  // Ensure that assignedTo is a valid user ID
  if (!assignedTo) {
    return res.status(400).json({ message: "Assigned user is required." });
  }

  const task = new Task({
    title,
    description,
    assignedTo,
    dueDate,
    priority,
    status,
    createdBy: req.user.id, // Assuming req.user.id holds the ID of the authenticated user
  });

  try {
    const createdTask = await task.save();
    res.status(201).json({ message: "Task created successfully", task: createdTask });
  } catch (error) {
    res.status(400).json({ message: "Task creation failed", error: error.message });
  }
};

// Generate Report
const generateReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    res.json({ message: "Report generated successfully", tasks });
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error: error.message });
  }
};

export default { addTask, generateReport };
