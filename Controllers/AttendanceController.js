
import Attendance from '../Models/AttendanceModel.js';


const markAttendance = async (req, res) => {
    try {
        const { userId, date, status } = req.body;

        if (!userId || !date || !status) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if attendance is already marked for this user and date
        const existingAttendance = await Attendance.findOne({ userId, date });
        if (existingAttendance) {
            return res.status(400).json({ error: 'Attendance already marked for this date.' });
        }

        // If no existing attendance, proceed to save
        const attendance = new Attendance({ userId, date, status });
        await attendance.save();

        res.status(201).json({ message: 'Attendance marked successfully.', attendance });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ error: 'An error occurred while marking attendance.' });
    }
};


// GET /attendance - Retrieve attendance records
// In your route file (e.g., routes.js)

// In your controller
const getAttedanceByid = async (req, res) => {
    try {
        const { userId } = req.params;  
        
        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const records = await Attendance.find({ userId: userId }).sort({ date: -1 });
        
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAttendance = async (req, res) => {
    try {
        const today = new Date();
        
        // Set the start of the day (00:00:00) in local time
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        
        // Set the end of the day (23:59:59.999) in local time
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        console.log("Query Range:", startOfDay, endOfDay);


        // Find records for the current date
        const records = await Attendance.find({
            date: { $gte: startOfDay, $lte: endOfDay },
        }).sort({ date: -1 });
        



        res.status(200).json(records || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





export  {
    markAttendance,
    getAttendance,
    getAttedanceByid
};
