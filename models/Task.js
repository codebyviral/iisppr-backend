const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  fileUrl: { type: String }, // URL of the uploaded file (if any)
  dateCompleted: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task };
