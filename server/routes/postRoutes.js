// server/routes/postRoutes.js (TEMPORARY VERSION FOR TESTING)

const express = require('express');
const { 
    getPosts, 
    getPost, 
    createPost, 
    updatePost, 
    deletePost 
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware'); 
const { upload } = require('../middleware/uploadMiddleware');
const commentRouter = require('./commentRoutes');

const router = express.Router();

// Reroute requests like /api/posts/:postId/comments to the commentRouter
router.use('/:postId/comments', commentRouter); 

// Public: GET all posts
// 🚨 TEMPORARY FIX: 'protect' middleware is REMOVED so the client form can POST.
router.route('/').get(getPosts).post(upload, createPost); 

// Public: GET one post
// Protected: PUT and DELETE still require a valid token
router.route('/:id').get(getPost).put(protect, updatePost).delete(protect, deletePost); 

module.exports = router;