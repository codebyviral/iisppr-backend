import jwt from 'jsonwebtoken';

export const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        console.log("Authorization header is missing");
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is required' });
    }

    try {
        const token = auth.split(' ')[1];  // Extract the token
        console.log("Token received:", token);  // Log token for debugging
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach user info to the request
        console.log("Decoded user:", req.user);  // Log the decoded user for debugging
        next();
    } catch (err) {
        console.log("Error decoding token:", err.message);
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is invalid or expired' });
    }
};