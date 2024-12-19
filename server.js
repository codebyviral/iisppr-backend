import express from "express";
import dotenv from "dotenv";
import connectDB from './src/db/index.js';
import cors from 'cors';

import router from "./Routes/AuthRouter.js";

// Initialize environment variables
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(express.json()); // Replaces bodyParser.json()
app.use(cors());

// Routes
app.use('/api/auth', router);

// Health check route
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

        app.on("error", (error) => {
            console.error(`Error: ${error}`);
            throw error;
        });
    })
    .catch((err) => {
        console.error(`MongoDB connection failed: ${err}`);
    });

export default app;
