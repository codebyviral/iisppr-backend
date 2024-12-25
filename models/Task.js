const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['image', 'pdf'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
