import Notification from "../Models/Notification.js";
import User from "../Models/User.js";
import Task from "../Models/Task.js";

// Function to send a notification
const sendNotification = async (req, res) => {
    const { userId, status, message, taskId } = req.body;

    try {
        // Create notification object with required fields
        const notificationData = {
            userId,
            message,
            type: status
        };

        // Only add task field if taskId is provided
        if (taskId) {
            notificationData.task = taskId;
        }

        const notification = new Notification(notificationData);

        await notification.save();
        await User.findByIdAndUpdate(userId, {
            $push: { notifications: notification._id }
        });

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

const deleteNotification = async (req, res) => {
    const { notificationId } = req.query;
    const { userId } = req.query;
    try {
        if (!notificationId || !userId) {
            return res.status(400).json({ message: "Invalid request: Missing notificationId or userId." });
        }
        await Notification.findByIdAndDelete(notificationId);
        await User
            .findByIdAndUpdate(userId, {
                $pull: { notifications: notificationId }
            });
        res.status(200).json({ message: "Notification deleted successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete notification!" });
        console.error("Error deleting notification:", error);
    }
}


export { sendNotification, getNotifcation, deleteNotification };