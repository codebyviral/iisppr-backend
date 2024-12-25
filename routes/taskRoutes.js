const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { Task } = require('../models/Task');

const router = express.Router();

// Multer setup for file upload in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST endpoint to create a new task (with file upload)
router.post('/', upload.single('file'), async (req, res) => {
  console.log('File Upload:', req.file); 

  try {
    const { description } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, 
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          return res.status(500).json({ error: 'File upload failed' });
        }

        const fileUrl = result.secure_url;
        const newTask = new Task({
          description,
          fileUrl,
          dateCompleted: new Date(),
        });

        newTask.save()
          .then(task => {
            res.status(200).json({ message: 'Task created successfully', task });
          })
          .catch(err => {
            console.error('Error saving task:', err);
            res.status(500).json({ error: 'Failed to save task' });
          });
      }
    ).end(req.file.buffer);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/', async (req, res) => {
    try {
      const tasks = await Task.find(); // Get all tasks from MongoDB
      res.status(200).json(tasks); // Return all tasks
    } catch (err) {
      console.error('Error retrieving tasks:', err);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const task = await Task.findById(id); // Find task by ID
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json(task); // Return the task
    } catch (err) {
      console.error('Error retrieving task:', err);
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  });

  

  router.put('/:id', upload.single('file'), async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    
    try {
      // Find the task by its ID
      let task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // If a new file is uploaded, upload it to Cloudinary
      let fileUrl = task.fileUrl; // Retain existing file URL if no new file is uploaded
      if (req.file) {
        cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) {
              return res.status(500).json({ error: 'File upload failed' });
            }
  
            // Get the file URL from Cloudinary response
            fileUrl = result.secure_url;
  
            // Update task
            task.description = description || task.description;
            task.fileUrl = fileUrl;
  
            task.save()
              .then(updatedTask => {
                res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
              })
              .catch(err => {
                console.error('Error updating task:', err);
                res.status(500).json({ error: 'Failed to update task' });
              });
          }
        ).end(req.file.buffer);
      } else {
        // If no new file, update the task without uploading a new file
        task.description = description || task.description;
        task.save()
          .then(updatedTask => {
            res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
          })
          .catch(err => {
            console.error('Error updating task:', err);
            res.status(500).json({ error: 'Failed to update task' });
          });
      }
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const task = await Task.findByIdAndDelete(id); // Delete the task by ID
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
      console.error('Error deleting task:', err);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });
  

module.exports = router;
