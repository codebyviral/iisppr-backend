import Task from "../Models/task.js";  // Importing Task model

// Function to get all tasks
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();  // Get all tasks from database
        res.status(200).json(tasks);  // Respond with the tasks
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
};

// Function to create a new task
export const createTask = async (req, res) => {
    const { title, description, status } = req.body;
    
    if (!title || !description || !status) {
        return res.status(400).json({ message: "Title, description, and status are required" });
    }

    try {
        const newTask = new Task({ title, description, status });
        await newTask.save();  // Save task to database
        res.status(201).json(newTask);  // Respond with the created task
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
};

// Function to update task details
export const updateTask = async (req, res) => {
    const { taskId, title, description, status } = req.body;
    
    if (!taskId || !title || !description || !status) {
        return res.status(400).json({ message: "Task ID, title, description, and status are required" });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, { title, description, status }, { new: true });
        
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);  // Respond with the updated task
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

// Function to delete a task
export const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);  // Delete task from database
        
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};
