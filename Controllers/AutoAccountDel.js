import cron from 'node-cron';
import Interns from '../Models/InternModel.js'; // Adjust case and path as necessary
 // Adjust the path as necessary

export const startCronJobs = () => {
    console.log("execution started");
  cron.schedule('* * * * *', async () => {
    try {
      const today = new Date();
        console.log("execution started");
      // Calculate the date 10 days ago
      const bufferDate = new Date();
      bufferDate.setDate(today.getDate() - 10);

      // Delete interns whose internship ended more than 10 days ago
      const result = await Interns.deleteMany({
        endDate: { $lt: bufferDate },
      });

      if (result.deletedCount > 0) {
        console.log(`${result.deletedCount} intern(s) deleted from the database.`);
      } else {
        console.log('No expired intern accounts to delete today.');
      }
    } catch (error) {
      console.error('Error running cron job:', error);
    }
  });

  console.log('Cron jobs initialized.');
};
