import express from 'express';
import { submitTaskCompletion, getTasksreports, upload } from '../Controllers/Tasksubmitioncontroller.js';
import { ensureAuthenticated } from '../Middlewares/Auth.js';

const router = express.Router();

router.post('/submitTask', ensureAuthenticated, upload.fields([{ name: 'file' }, { name: 'image' }]), submitTaskCompletion);
router.get('/getsubmitedtasks', ensureAuthenticated, getTasksreports);

export default router;