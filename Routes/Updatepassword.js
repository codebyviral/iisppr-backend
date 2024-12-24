import express from 'express';
import { userPassUpdate } from '../Controllers/Passwordcontroller.js';

const router = express.Router();

// Route for updating password
router.post('/updatepassword', userPassUpdate);

export default router;
