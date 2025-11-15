// server/models/Comment.js

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Comment text is required'],
        maxlength: 500
    },
    // Reference to the Post Model
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    // Reference to the User Model (the author of the comment)
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;