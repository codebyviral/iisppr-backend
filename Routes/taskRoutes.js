import express from "express";
import { getAllTasks, createTask, updateTask, deleteTask } from "../Controllers/taskController.js";  // Importing controller functions

const router = express.Router();

// Route to get all tasks
router.get('/tasks', getAllTasks);

// Route to create a new task
router.post('/task/create', createTask);

// Route to update a task
router.put('/task/update', updateTask);

// Route to delete a task
router.delete('/task/delete/:taskId', deleteTask);

export default router;
