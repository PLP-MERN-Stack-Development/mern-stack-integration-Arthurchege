// server/controllers/commentController.js

const Comment = require('../models/Comment');
const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');

// @desc    Get comments for a single post
// @route   GET /api/posts/:postId/comments
// @access  Public
const getComments = asyncHandler(async (req, res) => {
    // Find all comments belonging to the postId from the URL params
    const comments = await Comment.find({ post: req.params.postId })
        // Populate the author's name and ID
        .populate('author', 'name') 
        .sort({ createdAt: 1 }); // Show oldest comments first

    res.status(200).json({
        success: true,
        count: comments.length,
        data: comments,
    });
});

// @desc    Add a comment to a specific post
// @route   POST /api/posts/:postId/comments
// @access  Private (Requires token)
const addComment = asyncHandler(async (req, res) => {
    // req.params.postId is from the URL; req.user is from the JWT token
    const postId = req.params.postId;
    const { text } = req.body;

    // 1. Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error(`Post with ID ${postId} not found.`);
    }
    
    // Ensure text is provided
    if (!text) {
        res.status(400);
        throw new Error('Comment text cannot be empty.');
    }

    // 2. Create the comment
    const comment = await Comment.create({
        text,
        post: postId,
        author: req.user._id // Use the authenticated user's ID
    });

    // 3. Populate the author for the response
    const populatedComment = await Comment.findById(comment._id)
        .populate('author', 'name');

    res.status(201).json({
        success: true,
        data: populatedComment,
    });
});


module.exports = {
    getComments,
    addComment,
};