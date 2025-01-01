import express from 'express';
import { sendNotification, notifyAll } from "../Controllers/notificationController.js";

const router = express.Router();

// Route for sending notifications
router.post('/notification', sendNotification);
router.post('/notify-all', notifyAll);

export default router;
