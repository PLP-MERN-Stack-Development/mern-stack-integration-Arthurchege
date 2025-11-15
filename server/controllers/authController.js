// server/controllers/authController.js

const User = require('../models/User'); // Assuming correct path to User.js
const asyncHandler = require('express-async-handler');

// Helper function to send JWT response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email 
        }
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // This creates and validates the user, throwing an error if validation fails
    const user = await User.create({ name, email, password });
    
    sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide an email and password.');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials.');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials.');
    }

    sendTokenResponse(user, 200, res);
});


module.exports = {
    register,
    login
};