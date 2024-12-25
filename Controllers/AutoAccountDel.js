import cron from 'node-cron';

import User from '../Models/User.js';

export const startCronJobs = () => {
    console.log("execution started");
  cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date();
        console.log("Execution started");
        
        // Calculate the date 100 days ago
        const bufferDate = new Date();
        bufferDate.setDate(today.getDate() - 70);
        
        // Delete interns whose accounts started more than 100 days ago
        const result = await User.deleteMany({
          startDate: { $lt: bufferDate },
          role: 'intern',
        });
        
        console.log(`${result.deletedCount} intern(s) deleted.`);
        
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
