// server/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'] // Ensuring clear validation message
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Ensures password field is NOT returned in queries by default
    }
}, {
    timestamps: true
});

// --- Instance Method to Generate JWT ---
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// --- Pre-save Hook to Hash Password ---
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next(); // Use return here for clean exit
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- Instance Method to Compare Password ---
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// --- Export the Model ---
const User = mongoose.model('User', UserSchema);

module.exports = User;