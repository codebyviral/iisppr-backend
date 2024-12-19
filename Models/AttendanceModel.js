import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Intern', 
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'],
        required: true,
    },
    CheckInTime: {
        type: Date,
        default: function () {
            const currentDate = new Date();  // Get the current local time
            return currentDate;  // Store the local time directly
        }, // Automatically records when attendance is marked
    },
    CheckOutTime:{
        type:Date,
    }
});

// Ensure no duplicate attendance for the same intern on the same date
AttendanceSchema.index({ internId: 1, date: 1 }, { unique: true });
export default  mongoose.model('Attendance', AttendanceSchema);
