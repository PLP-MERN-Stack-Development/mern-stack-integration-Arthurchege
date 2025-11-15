// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Middleware function to protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check if the token is present in the headers (standard practice is 'Bearer TOKEN')
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (removes 'Bearer ' prefix)
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Attach User to request object
            // Find the user by ID from the decoded payload, but DON'T include the password field
            req.user = await User.findById(decoded.id).select('-password');

            // Proceed to the next middleware or controller function
            next();
        } catch (error) {
            console.error(error);
            res.status(401); // Unauthorized
            throw new Error('Not authorized, token failed.');
        }
    }

    // If no token is found in the headers
    if (!token) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized, no token.');
    }
});

module.exports = { protect };