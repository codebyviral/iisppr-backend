import express from 'express';
import { markAttendance, getAttendance, getAttedanceByid } from '../Controllers/AttendanceController.js';

const router = express.Router();

router.post('/attendance', markAttendance);
router.get('/attendance', getAttendance);

export default router;
