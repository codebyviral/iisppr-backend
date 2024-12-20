import express from "express";
import dotenv from "dotenv";
import connectDB from './src/db/index.js';
import cors from 'cors';

// Importing route handlers
import router from "./Routes/AuthRouter.js";
import updateUser from "./Routes/AdminRoutes.js";
import attendanceRoutes from "./Routes/AttendanceRoutes.js";
import userDetail from "./Routes/TaskAllocationRoutes.js";
import { startCronJobs } from "./Controllers/AutoAccountDel.js";

// Initialize environment variables
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(express.json());  // Replaces bodyParser.json(), handles JSON payloads
app.use(cors());          // Enable CORS for all routes

// Routes
app.use('/user', updateUser);              // Admin-related routes
app.use('/api/auth', router);              // Authentication routes
app.use('/', attendanceRoutes);           // Attendance-related routes
app.use('/api/getUsers', userDetail);     // Task allocation related routes

// Start cron jobs for automatic account deletion or other scheduled tasks
startCronJobs();

// Health check route to verify server status
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Default route for the server status
app.get("/", (req, res) => {
    res.send("IISPPR Server is up and running!");
});

// Get port from environment variables or default to 4000
const PORT = process.env.PORT || 4000;

// Start the server only after successful DB connection
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });

        // Handling server errors
        app.on("error", (error) => {
            console.error(`Error: ${error}`);
            throw error;
        });
    })
    .catch((err) => {
        console.error(`MongoDB connection failed: ${err}`);
    });

// Export the app for testing or other purposes
export default app;
