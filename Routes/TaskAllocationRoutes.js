import express from "express";
import { getUsers } from "../Controllers/TaskAllocation.js"
const router = express.Router();

router.get('/', getUsers);

export default router;
