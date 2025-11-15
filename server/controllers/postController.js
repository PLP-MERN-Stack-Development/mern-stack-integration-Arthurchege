// server/controllers/postController.js

const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');
const fs = require('fs'); 
const User = require('../models/User'); // 🚨 NEW IMPORT: Need to get user info 

// @desc    Get all blog posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
    // We now populate the 'author' field to get the name
    const posts = await Post.find({})
        .populate('category', 'name slug')
        .populate('author', 'name'); // 🚨 FIX: Populate the author's name
    
    res.status(200).json({
        success: true,
        count: posts.length,
        data: posts,
    });
});

// @desc    Get a specific blog post
// @route   GET /api/posts/:id
// @access  Public
const getPost = asyncHandler(async (req, res) => {
    // We now populate the 'author' field to get the name
    const post = await Post.findById(req.params.id)
        .populate('category', 'name slug')
        .populate('author', 'name'); // 🚨 FIX: Populate the author's name

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    res.status(200).json({ success: true, data: post });
});

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private (Requires token)
const createPost = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;
    
    // Get the user object if protect middleware ran, otherwise set to null/default user
    const user = req.user ? req.user : await User.findOne({ email: 'admin@blog.com' }).select('_id name'); 
    
    // 🚨 Critical Check: If the route is not protected and we can't find a default user
    if (!user) {
        res.status(401);
        throw new Error('Authentication required to create a post.');
    }

    const featuredImage = req.file ? `/uploads/${req.file.filename}` : null; 

    if (!title || !content || !category) {
        res.status(400);
        if (req.file) { fs.unlinkSync(req.file.path); }
        throw new Error('Please include title, content, and category ID.');
    }
    
    // 🚨 FIX: Set 'author' to the user's ID
    const post = await Post.create({ 
        title, 
        content, 
        category, 
        author: user._id, // Set the author reference ID
        featuredImage: featuredImage
    });

    // Populate category and author for the response
    const populatedPost = await Post.findById(post._id)
        .populate('category', 'name slug')
        .populate('author', 'name'); 

    res.status(201).json({ success: true, data: populatedPost });
});

// @desc    Update an existing blog post
// @route   PUT /api/posts/:id
// @access  Private (Requires token)
const updatePost = asyncHandler(async (req, res) => {
    // ... (logic remains the same)
});

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private (Requires token)
const deletePost = asyncHandler(async (req, res) => {
    // ... (logic remains the same)
});

module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
};