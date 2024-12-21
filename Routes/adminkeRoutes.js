import express from "express";
import { getAllUsers, updateUser, deleteUser } from "../Controllers/adminController.js";  // Importing controller functions

const router = express.Router();

// Route to get all users
router.get('/users', getAllUsers);

// Route to update a user's details
router.put('/user/update', updateUser);

// Route to delete a user
router.delete('/user/delete/:userId', deleteUser);

export default router;
