import express from "express";
import { addTask, getTasks, updateTask, deleteTask } from "../Controllers/TaskController.js";

const taskRouter = express.Router();

taskRouter.post("/add-task", addTask);
taskRouter.get("/get-tasks", getTasks);
taskRouter.put("/update-task/:id", updateTask);
taskRouter.delete("/delete-task/:id", deleteTask);

export default taskRouter;