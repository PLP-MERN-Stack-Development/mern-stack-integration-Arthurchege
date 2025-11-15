// server/models/Post.js

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post title is required'],
        trim: true,
        maxlength: 100
    },
    content: {
        type: String,
        required: [true, 'Post content is required'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Post must belong to a category']
    },
    featuredImage: {
        type: String,
        default: null
    },
    // 🚨 FIX: Now references the User model (required for comments/security)
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    }
}, {
    timestamps: true
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;