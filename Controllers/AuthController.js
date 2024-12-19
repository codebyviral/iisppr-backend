import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
const secretKey = process.env.JWT_SECRET
export const signup = async (req, res) => {
    try {
        const { name, email, password, rpassword, mnumber, role } = req.body;

        // Check if passwords match
        if (password !== rpassword) {
            return res.status(400).json({ message: "Passwords do not match", success: false });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mnumber,
            role,
        });

        await newUser.save();

        // Generate token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
        console.log(`New Account Created: Welcome ${newUser.name} to IISPPR!`)
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "Invalid email or password", success: false });
        }

        // Verify password
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: "Invalid email or password", success: false });
        }

        // Generate token
        const token = jwt.sign(
            { email: user.email, id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
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
        console.log(`${user.name} just logged in to IISPPR!`)
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};