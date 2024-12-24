import User from "../Models/User.js";

export const updateUser = async (req, res) => {
    try {
        console.log("I'm in the admin controller")
        const { id } = req.params;
        const updates = req.body;

        console.log("id:", id, "updates:", updates)

        const updatedUser = await User.findByIdAndUpdate(id, updates, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules are applied
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};
