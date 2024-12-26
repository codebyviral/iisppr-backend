import Notification from "../Models/Notification.js";
import User from "../Models/User.js";
import Task from "../Models/Task.js";

// Function to send a notification
const sendNotification = async (req, res) => {
    const { userId } = req.body;
    const { taskId } = req.body;
    const { status } = req.body;
    const { message } = req.body;
    try {
        const notification = new Notification({
            userId,
            message,
            task: taskId,
            type: status,
        });

        await notification.save();
        await User.findByIdAndUpdate(userId, { $push: { notifications: notification._id } })
        res.status(200).json({ message: "Notification sent successfully!" });
        console.log("Notification sent successfully!");
    } catch (error) {
        res.status(500).json({ message: "Failed to send notification!" });
        console.error("Error sending notification:", error);
    }
};

const getNotifcation = async (req, res) => {
    // Get userId from query parameters
    const { userId } = req.query;

    try {
        // Fetch notifications for the given userId
        const notifications = await User.findById(userId).populate("notifications");
        res.status(200).json({ notifications });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: "Failed to get notifications!" });
        console.error("Error getting notifications:", error);
    }
}

export { sendNotification, getNotifcation };