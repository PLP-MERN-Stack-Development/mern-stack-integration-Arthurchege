// server/controllers/categoryController.js

const Category = require('../models/Category');
const asyncHandler = require('express-async-handler'); // Helper for error handling (Task 2: Error Handling)

// Install this helper:
// npm install express-async-handler

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
    });
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Public (for now, will be restricted later)
const createCategory = asyncHandler(async (req, res) => {
    // We will add more robust input validation later (Task 2)
    const { name } = req.body;

    if (!name) {
        // Send a 400 response if the name is missing
        res.status(400);
        throw new Error('Category name is required.');
    }

    // Simple slug generation for now
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');

    const category = await Category.create({ name, slug });
    
    res.status(201).json({
        success: true,
        data: category,
    });
});


module.exports = {
    getCategories,
    createCategory,
};