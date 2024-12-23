const bcrypt = require('bcrypt');
const User = require('./Models/User.js'); 

const userPassUpdate = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare old password with stored hash
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password' });
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

module.exports = userPassUpdate;


//Routes Ke liye hai (Path apne hisab se set karlena)
const express = require('express');
const userPassUpdate = require('../controllers/userPassUpdate');
const router = express.Router();
router.post('/update-password', userPassUpdate);
module.exports = router;


//server.js file daal dena ye wala bas
app.use('/api/users', userRoutes);
