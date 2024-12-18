const express = require("express");
const { addTask, generateReport } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/task", protect, addTask);
router.get("/report", protect, generateReport);

module.exports = router;
