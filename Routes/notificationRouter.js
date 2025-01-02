import express from 'express';
import { sendNotification, notifyAll, sendNotificationToSingleUser } from "../Controllers/notificationController.js";

const router = express.Router();

// Route for sending notifications
router.post('/notification', sendNotification);
router.post('/notify-all', notifyAll);
router.post('/notify-single', sendNotificationToSingleUser)

export default router;
