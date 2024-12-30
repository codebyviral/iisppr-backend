import express from "express";
import { getAllUsers, updateUser, deleteUser,uploadProfilePicture } from "../Controllers/admincontroller.js";

const router = express.Router();

// Route to fetch all users
router.get("/allusers", getAllUsers);

// Route to update a user
router.put("/update/:userid",uploadProfilePicture, updateUser);

// Route to delete a user
router.delete("/delete/:userid", deleteUser);

export default router;
