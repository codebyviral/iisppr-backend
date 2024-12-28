import cron from 'node-cron';
import User from '../Models/User.js';
import Attendance from '../Models/AttendanceModel.js';
import Leave from '../Models/leave.js';

export const startCronJobs = () => {
    console.log("Cron jobs initialized.");

    cron.schedule('0 0 * * *', async () => {
        try {
            const today = new Date();
            console.log("Cron job running");

            // 1. Delete accounts older than 70 days
            const bufferDate = new Date();
            bufferDate.setDate(today.getDate() - 70);

            const expiredAccountsResult = await User.deleteMany({
                startDate: { $lt: bufferDate },
                role: 'intern',
            });

            console.log(`${expiredAccountsResult.deletedCount} accounts deleted for exceeding 70 days.`);

            // 2. Check consecutive absences excluding leave dates
            const attendanceData = await Attendance.aggregate([
                {
                    $group: {
                        _id: "$userId",
                        attendanceDates: { $push: "$date" },
                    },
                },
            ]);

            for (const record of attendanceData) {
                const { _id: userId, attendanceDates } = record;

                // Fetch approved leave dates for the user
                const approvedLeaves = await Leave.find({
                    internid: userId,
                    status: 'Approved',
                    leaveDates: { $exists: true, $ne: [] },
                }).select('leaveDates');

                const leaveDates = approvedLeaves.flatMap((leave) => leave.leaveDates);

                // Combine attendance and leave dates
                const validDates = attendanceDates
                    .concat(leaveDates)
                    .map((date) => new Date(date))
                    .sort((a, b) => a - b);

                // Check for consecutive absences
                let consecutiveAbsences = 0;
                for (let i = 1; i < validDates.length; i++) {
                    const diffInDays = (validDates[i] - validDates[i - 1]) / (1000 * 60 * 60 * 24);

                    if (diffInDays > 1) {
                        consecutiveAbsences++;
                    } else {
                        consecutiveAbsences = 0;
                    }

                    if (consecutiveAbsences === 2) {
                        const deleteResult = await User.deleteOne({ _id: userId, role: 'intern' });
                        if (deleteResult.deletedCount > 0) {
                            console.log(`User with ID ${userId} deleted for 2 consecutive absences.`);
                        }
                        break;
                    }
                }
            }

            console.log("Cron job completed.");
        } catch (error) {
            console.error('Error running cron job:', error);
        }
    });
};
