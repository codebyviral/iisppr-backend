import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import moment from 'moment';

const secretKey = process.env.JWT_SECRET;

export const signup = async (req, res) => {
    try {
        const { name, email, password, rpassword, mnumber, role, startDate } = req.body;

        // Check if passwords match
        if (password !== rpassword) {
            return res.status(400).json({ message: "Passwords do not match", success: false });
        }

        // Check if user already exists
        try {
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: "User already exists", success: false });
            }
        } catch (error) {
            console.error("Error checking user existence:", error);
            return res.status(500).json({ message: "Internal server error", success: false });
        }

        // Encrypt password
        let hashedPassword;
        try {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        } catch (error) {
            console.error("Error hashing password:", error);
            return res.status(500).json({ message: "Internal server error", success: false });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mnumber,
            role,
            startDate: moment(startDate).startOf('day').toDate(), // Format date
        });

        try {
            await newUser.save();
        } catch (error) {
            console.error("Error saving new user:", error);
            return res.status(500).json({ message: "Internal server error", success: false });
        }

        // Generate token
        let token;
        try {
            token = jwt.sign(
                { id: newUser._id, role: newUser.role },
                secretKey,
                { expiresIn: "30d" }
            );
        } catch (error) {
            console.error("Error generating token:", error);
            return res.status(500).json({ message: "Internal server error", success: false });
        }

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                startDate: moment(newUser.startDate).format('YYYY-MM-DD'),
            },
        });
        console.log(`New Account Created: Welcome ${newUser.name} to IISPPR!`);
    } catch (error) {
        console.error("Unexpected error during signup:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user;
        try {
            user = await User.findOne({ email });
            if (!user) {
                return res.status(403).json({ message: "Invalid email or password", success: false });
            }
        } catch (error) {
            console.error("Error finding user during login:", error);
            return res.status(500).json({ message: "Internal server error", success: false });
        }

        // Verify password
        let isPassEqual;
        try {
            isPassEqual = await bcrypt.compare(password, user.password);
            if (!isPassEqual) {
                return res.status(403).json({ message: "Invalid email or password", success: false });
            }
        } catch (error) {
            console.error("Error comparing password during login:", error);
            return res.status(500).json({ message: "Internal server error", success: false });
        }

        // Generate token
        let token;
        try {
            token = jwt.sign(
                { email: user.email, id: user._id, role: user.role },
                secretKey,
                { expiresIn: "24h" }
            );
        } catch (error) {
            console.error("Error generating token during login:", error);
            return res.status(500).json({ message: "Internal server error", success: false });
        }

        res.status(200).json({
            message: "Login successful",
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
        console.log(`${user.name} just logged in to IISPPR!`);
    } catch (error) {
        console.error("Unexpected error during login:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
