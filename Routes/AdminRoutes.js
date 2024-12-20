import express from "express";
import { updateUser } from "../Controllers/UpdateAdminController.js"; 

const router = express.Router();

//updates user data
router.put('/:id', updateUser);

export default router;
