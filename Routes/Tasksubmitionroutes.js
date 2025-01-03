import express from 'express';
import { submitTaskCompletion, getTasksreports, upload } from '../Controllers/Tasksubmitioncontroller.js';
import { ensureAuthenticated } from '../Middlewares/Auth.js';
import { getNotifcation, deleteNotification } from '../Controllers/notificationController.js';

const router = express.Router();

router.post('/submitTask', ensureAuthenticated, upload.fields([{ name: 'file' }, { name: 'image' }]), submitTaskCompletion);
router.get('/getsubmitedtasks', getTasksreports);
router.get('/get-notifications', getNotifcation)
router.delete('/delete-notification', ensureAuthenticated,deleteNotification)

export default router;