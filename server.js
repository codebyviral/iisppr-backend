// Importing required dependencies
import express from "express"; // Express framework for creating the server
import dotenv from "dotenv"; // To load environment variables from a .env file
import connectDB from "./src/db/index.js"; // Function to connect to the database
import cors from "cors"; // To enable Cross-Origin Resource Sharing (CORS)

import router from "./Routes/AuthRouter.js"; // Importing authentication routes
import attendanceRoutes from "./Routes/AttendanceRoutes.js"; // Importing attendance-related routes
import { startCronJobs } from "./Controllers/AutoAccountDel.js"; // Importing function to start cron jobs for automatic account deletion
import adminrouter from "./Routes/AdminRoutes.js";
import passupdaterouter from "./Routes/Updatepassword.js";
import taskRouter from "./Routes/TaskRouter.js";
import reportRoutes from "./Routes/ReportRoutes.js"; //Importing report generation routes
import submitreportroutes from "./Routes/SubmitreportRoutes.js";
import projectRoutes from "./Routes/ProjectRoutes.js";
// Loading environment variables from .env file
dotenv.config();

// Creating an instance of express server
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use("/uploads", express.static("projectimageuploads"));


const corsOptions = {
	origin: ['https://iisppr-intern-management.vercel.app', 'http://localhost:5173'],
	methods: ['GET', 'POST', 'DELETE', 'PATCH', 'HEAD'], 
	credentials: true, 
	allowedHeaders: ['Content-Type', 'Authorization'] 
};

app.use(cors(corsOptions));

// Defining routes for various functionalities
app.use("/api/auth", router); // Route for authentication functionalities
app.use("/user", passupdaterouter);   //passwor dupdate
app.use("/", attendanceRoutes); // Route for attendance-related functionalities
app.use("/task", taskRouter);      //for task cration
app.use("/", adminrouter);      //for admin panal
app.use("/reports", reportRoutes); //Route for report -> pdf/excel generation functionalities
app.use("/project", projectRoutes)
app.use("/weeklystatus", submitreportroutes);

// Predefined responses for chatbot functionality
const responses = {
	hello: "Hi! How can I assist you?", // Response for 'hello' message
	goodbye: "Goodbye! Have a nice day.", // Response for 'goodbye' message
	default: "Sorry, I didn't understand that.", // Default response for unrecognized messages
};

// Handling POST requests to '/chat' endpoint for chatbot interaction
app.post("/chat", (req, res) => {
	const userMessage = req.body.message ? req.body.message.toLowerCase() : ""; // Extracting and normalizing user message
	let botResponse = responses[userMessage] || responses.default; // Selecting appropriate bot response
	res.json({ message: botResponse }); // Responding with the selected message
});

// Starting cron jobs for automatic account deletion (or other tasks)
startCronJobs();

// A simple health check route to test server status
app.get("/ping", (req, res) => {
	res.send("PONG"); // Responds with 'PONG' when pinged
});

// Default route to confirm server is up and running
app.get("/", (req, res) => {
	res.send("IISPPR Server is up and running!"); // Custom message indicating the server is active
});

// Setting the port to listen for incoming requests (either from environment or default to 4000)
const PORT = process.env.PORT || 4000;

// Connecting to the database and starting the server
connectDB() // Connect to the database
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
