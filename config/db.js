const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/task-mgt', 
        { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { connectDB };
