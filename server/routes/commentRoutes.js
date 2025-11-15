// server/routes/commentRoutes.js

const express = require('express');
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Use the mergeParams option to access the postId from the parent route
const router = express.Router({ mergeParams: true }); 

// GET comments (Public) and POST comment (Private/Protected)
router.route('/').get(getComments).post(protect, addComment);

module.exports = router;