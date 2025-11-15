// client/src/components/SinglePost.jsx (FINAL VERSION WITH COMMENTS)

import React, { useEffect, useState } from 'react'; // 🚨 NEW: Import useState
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import CommentForm from './CommentForm'; // 🚨 NEW: Import CommentForm

const API_BASE_URL = ''; 

// Helper component to display a single comment
const CommentItem = ({ comment }) => (
    <div className="comment-item" style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{comment.author?.name || 'Deleted User'}</p>
        <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{comment.text}</p>
        <small style={{ color: '#888' }}>{new Date(comment.createdAt).toLocaleDateString()}</small>
    </div>
);


const SinglePost = () => {
    const { id } = useParams();
    // Post data state
    const { data: post, loading, error, fetchData: fetchPost } = useApi('/posts');
    
    // 🚨 NEW STATE: Comment data state
    const [comments, setComments] = useState(null);
    const { data: commentData, loading: commentsLoading, fetchData: fetchComments } = useApi(`/posts/${id}/comments`);

    // --- 1. Fetch Post and Comments on Load ---
    useEffect(() => {
        if (id) {
            fetchPost('GET', null, id);
            fetchComments(); // Fetch comments for this specific post ID
        }
    }, [id, fetchPost, fetchComments]);

    // --- 2. Update Comments State when API Data Arrives ---
    useEffect(() => {
        if (commentData && Array.isArray(commentData)) {
            setComments(commentData);
        }
    }, [commentData]);
    
    // --- 3. Handle New Comment Submission ---
    const handleCommentAdded = (newComment) => {
        // Optimistic UI Update: Add the new comment to the list instantly
        setComments(prevComments => [...(prevComments || []), newComment]);
    };


    if (loading) { return <div className="post-detail">⏳ Loading post details...</div>; }
    if (error) { return <div className="post-detail error">❌ Error loading post: {error}</div>; }
    if (!post) { return <div className="post-detail">404 - Post not found.</div>; }

    // Render logic
    return (
        <div className="post-detail">
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '15px', display: 'block' }}>
                &larr; Back to all posts
            </Link>
            
            {/* 🖼️ IMAGE AND POST INFO */}
            <h1>{post.title}</h1>
            {post.featuredImage && (
                <div style={{ marginBottom: '20px' }}>
                    <img 
                        src={`${API_BASE_URL}${post.featuredImage}`} 
                        alt={post.title} 
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }} 
                    />
                </div>
            )}
            <p className="category">
                **Category:** <strong>{post.category?.name || 'Uncategorized'}</strong> | 
                **Author:** <strong>{post.author?.name || 'Unknown'}</strong>
            </p>
            <div className="post-content">
                <p>{post.content}</p>
            </div>
            
            {/* --- COMMENTS SECTION --- */}
            <div className="comments-section" style={{ marginTop: '50px' }}>
                <h2>Comments ({comments?.length || 0})</h2>
                {commentsLoading && <p>Loading comments...</p>}
                
                {comments && comments.length > 0 ? (
                    comments.map(comment => <CommentItem key={comment._id} comment={comment} />)
                ) : (
                    !commentsLoading && <p>No comments yet. Be the first!</p>
                )}

                {/* --- COMMENT SUBMISSION FORM --- */}
                <CommentForm 
                    postId={id} 
                    onCommentAdded={handleCommentAdded} 
                />
            </div>
        </div>
    );
};

export default SinglePost;