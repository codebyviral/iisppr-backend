
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
const getAttedanceByid = async (req, res) => {
    try {
        const { userId } = req.query;

        const query = userId ? { userId } : {};
        const records = await Attendance.find(query).sort({ date: -1 });

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getAttendance = async (req, res) => {
    try {
        // Get current date in the local time zone (India Standard Time)
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
        // Example UTC check-in time
const checkInTime = new Date("2024-12-14T19:15:30.360Z");

// Convert UTC to IST (Indian Standard Time)
const checkInTimeIST = checkInTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

console.log(checkInTimeIST); // It will display in IST

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
