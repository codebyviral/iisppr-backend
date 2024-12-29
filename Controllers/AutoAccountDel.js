import cron from 'node-cron';
import User from '../Models/User.js';
import Attendance from '../Models/AttendanceModel.js';
import Leave from '../Models/leave.js';
import Notification from '../Models/Notification.js';

export const startCronJobs = () => {
  console.log("Cron jobs initialized.");

  cron.schedule('0 0 * * *', async () => {
    try {
      const today = new Date();
      console.log("Cron job running");

      // 1. Identify accounts to be deleted tomorrow and send notifications
      const notificationDate = new Date();
      notificationDate.setDate(today.getDate() - 69);

      const usersToNotify = await User.find({
        startDate: { $lt: notificationDate },
        role: 'intern',
      });

      for (const user of usersToNotify) {
        // Create and send a notification
        const notificationMessage = "Your account will be deleted tomorrow. Please contact the administrator if you have any concerns.";
        const notification = new Notification({
          userId: user._id,
          message: notificationMessage,
          type: 'Warning',
        });

        await notification.save();
        await User.findByIdAndUpdate(user._id, {
          $push: { notifications: notification._id },
        });

        console.log(`Notification sent to user with ID ${user._id}.`);
      }

      // 2. Delete accounts older than 70 days
      const bufferDate = new Date();
      bufferDate.setDate(today.getDate() - 70);

      const expiredAccountsResult = await User.deleteMany({
        startDate: { $lt: bufferDate },
        role: 'intern',
      });

      console.log(`${expiredAccountsResult.deletedCount} accounts deleted for exceeding 70 days.`);

      // 3. Check consecutive absences excluding leave dates
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

        // 4. Check for missing attendance
        const attendanceDays = validDates.map(date => date.toISOString().split('T')[0]); // Extract date (YYYY-MM-DD)
        const todayString = today.toISOString().split('T')[0];

        if (!attendanceDays.includes(todayString)) {
          // Send notification for missing attendance
          const missingAttendanceMessage = `You have not marked your attendance for today. Please mark your attendance ASAP.`;
          const missingAttendanceNotification = new Notification({
            userId: userId,
            message: missingAttendanceMessage,
            type: 'Reminder',
          });

          await missingAttendanceNotification.save();
          await User.findByIdAndUpdate(userId, {
            $push: { notifications: missingAttendanceNotification._id },
          });

          console.log(`Notification sent to user with ID ${userId} for missing attendance.`);
        }

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
            // Send notification before account deletion
            const accountDeletionMessage = `Your account will be deleted due to 2 consecutive absences. Please contact the administrator if you have any concerns.`;
            const accountDeletionNotification = new Notification({
              userId: userId,
              message: accountDeletionMessage,
              type: 'Warning',
            });

            await accountDeletionNotification.save();
            await User.findByIdAndUpdate(userId, {
              $push: { notifications: accountDeletionNotification._id },
            });

            console.log(`Notification sent to user with ID ${userId} before account deletion.`);

            // Delete the user after sending the notification
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
