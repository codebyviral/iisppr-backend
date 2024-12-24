import bcrypt from 'bcrypt';
import User from "../Models/User.js";

export const userPassUpdate = async (req, res) => {
    const { email, oldPassword, newPassword, cnewPassword } = req.body;

    // Validate input fields
    if (!email || !oldPassword || !newPassword || !cnewPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if new password and confirmation password match
    if (newPassword !== cnewPassword) {
        return res.status(400).json({ message: 'New password and confirmation password do not match' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare old password with stored hash
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        // Check if the new password is the same as the old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
