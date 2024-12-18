const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// GET all attendance records
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new attendance record
router.post("/", async (req, res) => {
  const { id, userId, date, status } = req.body;

  const newRecord = new Attendance({ id, userId, date, status });

  try {
    const savedRecord = await newRecord.save();
    res.status(201).json({ message: "Record added", record: savedRecord });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET an attendance record by ID
router.get("/:id", async (req, res) => {
  try {
    const record = await Attendance.findOne({ id: req.params.id });
    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE an attendance record by ID
router.delete("/:id", async (req, res) => {
  try {
    const result = await Attendance.deleteOne({ id: req.params.id });
    if (result.deletedCount > 0) {
      res.json({ message: "Record deleted successfully" });
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
