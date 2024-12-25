const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const { connectDB } = require('./config/db');


// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());  // Enable CORS if needed

// Connect to MongoDB
connectDB();

// Routes
app.use('/task-completion', taskRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
