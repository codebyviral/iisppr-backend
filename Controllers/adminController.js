import Admin from "../Models/admin.js";  // Importing Admin model

// Function to get all users for admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await Admin.find();  // Get all users from the database
        res.status(200).json(users);  // Respond with the users
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// Function to update user details
export const updateUser = async (req, res) => {
    const { userId, name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    try {
        const updatedUser = await Admin.findByIdAndUpdate(userId, { name, email }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);  // Respond with the updated user
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// Function to delete a user
export const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const deletedUser = await Admin.findByIdAndDelete(userId);  // Delete user from database
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};
