// Importing required dependencies
import express from "express";  // Express framework for creating the server
import dotenv from "dotenv";   // To load environment variables from a .env file
import connectDB from './src/db/index.js';  // Function to connect to the database
import cors from 'cors';  // To enable Cross-Origin Resource Sharing (CORS)

import router from "./Routes/AuthRouter.js";  // Importing authentication routes
import adminKeRoutes from "./Routes/adminkeRoutes.js";  // Importing admin-related routes (adminKeRoutes)
import adminRoutes from "./Routes/AdminRoutes.js";  // Importing admin-related routes (AdminRoutes)
import attendanceRoutes from "./Routes/AttendanceRoutes.js";  // Importing attendance-related routes
import { startCronJobs } from "./Controllers/AutoAccountDel.js";  // Importing function to start cron jobs for automatic account deletion
import taskAllocationRoutes from "./Routes/TaskAllocationRoutes.js";  // Importing task allocation routes
import taskRoutes from "./Routes/taskRoutes.js";  // Importing task-related routes

// Loading environment variables from .env file
dotenv.config();

// Creating an instance of express server
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enabling Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

// Defining routes for various functionalities
app.use('/admin', adminKeRoutes);  // Route for admin-related functionalities (adminKeRoutes)
app.use('/admin/update', adminRoutes);  // Route for admin update functionalities (AdminRoutes)
app.use('/api/auth', router);  // Route for authentication functionalities
app.use('/', attendanceRoutes);  // Route for attendance-related functionalities
app.use('/api/getUsers', taskAllocationRoutes);  // Route for fetching user details (task allocation related)
app.use('/task', taskRoutes);  // Route for task-related functionalities

// Predefined responses for chatbot functionality
const responses = {
  hello: "Hi! How can I assist you?",  // Response for 'hello' message
  goodbye: "Goodbye! Have a nice day.",  // Response for 'goodbye' message
  default: "Sorry, I didn't understand that."  // Default response for unrecognized messages
};

// Handling POST requests to '/chat' endpoint for chatbot interaction
app.post('/chat', (req, res) => {
  const userMessage = req.body.message ? req.body.message.toLowerCase() : '';  // Extracting and normalizing user message
  let botResponse = responses[userMessage] || responses.default;  // Selecting appropriate bot response
  res.json({ message: botResponse });  // Responding with the selected message
});

// Starting cron jobs for automatic account deletion (or other tasks)
startCronJobs();

// A simple health check route to test server status
app.get('/ping', (req, res) => {
    res.send('PONG');  // Responds with 'PONG' when pinged
});

// Default route to confirm server is up and running
app.get("/", (req, res) => {
    res.send("IISPPR Server is up and running!");  // Custom message indicating the server is active
});

// Setting the port to listen for incoming requests (either from environment or default to 4000)
const PORT = process.env.PORT || 4000;

// Connecting to the database and starting the server
connectDB()  // Connect to the database
    .then(() => {
        // Start the server if the database connection is successful
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });

        // Handle errors related to server operations
        app.on("error", (error) => {
            console.error(`Error: ${error}`);
            throw error;
        });
    })
    .catch((err) => {
        // If database connection fails, log the error
        console.error(`MongoDB connection failed: ${err}`);
    });

// Export the app for testing or further use
export default app;
