import  express  from 'express';
import { sendNotification } from "../Controllers/notificationController.js";

const router = express.Router();

// Route for sending notifications
router.post('/notification', sendNotification);

export default router;
