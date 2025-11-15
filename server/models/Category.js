// server/models/Category.js

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    // The name of the category (e.g., 'Technology')
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true, // Categories should have unique names
        trim: true,
        maxlength: 50
    },
    // Slug for clean URLs (e.g., 'technology')
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    }
}, {
    timestamps: true // Adds 'createdAt' and 'updatedAt' fields automatically
});

// Create the Mongoose Model
const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;