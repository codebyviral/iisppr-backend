import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import moment from 'moment';
import dotenv from "dotenv";
import mongoose from 'mongoose';
dotenv.config();

const secretKey = process.env.JWT_SECRET;

export const signup = async (req, res) => {
    try {
        const { name, email, password, rpassword, mnumber } = req.body;

        // Validate fields
        if (!name || !email || !password || !mnumber || !rpassword) {
            return res.status(400).json({ message: "All fields are required.", success: false });
        }

        // Check if passwords match
        if (password !== rpassword) {
            return res.status(400).json({ message: "Passwords do not match.", success: false });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists.", success: false });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mnumber
        });

        await newUser.save();

        return res.status(201).json({ message: "User registered successfully.", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", success: false });
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
                { expiresIn: "30d" }
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
                isAdmin: user.isAdmin,
            },
        });
        console.log(`${user.name} just logged in to IISPPR!`);
    } catch (error) {
        console.error("Unexpected error during login:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      // Query the database for the user by ID
      const user = await User.findById(id);
  
      // If user is not found
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Return the user details excluding the password
      res.status(200).json({
        name: user.name,
        mnumber: user.mnumber,
        email: user.email,
        role: user.role,
        startDate: user.startDate,
        isAdmin: user.isAdmin,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
