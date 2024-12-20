import jwt from "jsonwebtoken";
import User from "../Models/User";

// Protect Route - Ensure User is Authenticated
export const protect = async (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // If no token is found, return a 401 unauthorized response
  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded ID and exclude the password field from the response
    req.user = await User.findById(decoded.id).select("-password");

    // If user doesn't exist, return a 401 unauthorized response
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

// Admin Route - Ensure User is Admin
export const admin = (req, res, next) => {
  // If user has admin role, proceed to next middleware/route handler
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only, forbidden" });
  }
};
