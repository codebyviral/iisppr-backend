
import Attendance from '../Models/AttendanceModel.js';


const markAttendance = async (req, res) => {
    try {
        const { userId, date, status } = req.body;

        // Basic validation
        if (!userId || !date || !status) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required.',
                code: 'MISSING_FIELDS'
            });
        }

        // Validate date format
        const submittedDate = new Date(date);
        if (isNaN(submittedDate)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid date format.',
                code: 'INVALID_DATE'
            });
        }

        // Check if date is today
        const today = new Date();
        const isToday = submittedDate.toISOString().split('T')[0] === today.toISOString().split('T')[0];

        if (!isToday) {
            return res.status(400).json({
                success: false,
                error: 'Attendance can only be marked for today.',
                code: 'INVALID_DATE_RANGE'
            });
        }

        // Validate status
        const validStatuses = ['present', 'absent', 'late', 'half-day'];
        if (!validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status. Must be one of: present, absent, late, half-day',
                code: 'INVALID_STATUS'
            });
        }

        // Get the start and end of today
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

        // Check if attendance is already marked for this user and date
        const existingAttendance = await Attendance.findOne({
            userId,
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        if (existingAttendance) {
            return res.status(409).json({
                success: false,
                error: 'Attendance already marked for today.',
                code: 'DUPLICATE_ATTENDANCE'
            });
        }

        // If no existing attendance, proceed to save
        const attendance = new Attendance({
            userId,
            date: submittedDate,
            status: status.toLowerCase(),
            markedAt: new Date()
        });
        await attendance.save();

        return res.status(201).json({
            success: true,
            message: 'Attendance marked successfully.',
            code: 'ATTENDANCE_MARKED',
            data: attendance
        });

    } catch (error) {
        console.error('Error marking attendance:', error);

        // Handle specific database errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.message,
                code: 'VALIDATION_ERROR'
            });
        }

        return res.status(500).json({
            success: false,
            error: 'An error occurred while marking attendance.',
            code: 'INTERNAL_SERVER_ERROR'
        });
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





export {
    markAttendance,
    getAttendance,
    getAttedanceByid
};
