import Notification from "../Models/Notification.js";

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
        res.status(200).json({ message: "Notification sent successfully!" });
        console.log("Notification sent successfully!");
    } catch (error) {
        res.status(500).json({ message: "Failed to send notification!" });
        console.error("Error sending notification:", error);
    }
};

export { sendNotification }