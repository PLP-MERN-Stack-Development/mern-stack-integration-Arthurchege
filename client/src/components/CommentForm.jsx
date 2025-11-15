// client/src/components/CommentForm.jsx

import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';

// This component is only rendered for authenticated users
const CommentForm = ({ postId, onCommentAdded }) => {
    const [commentText, setCommentText] = useState('');
    const [message, setMessage] = useState('');
    
    // We use the full endpoint path since the postId is passed as a prop
    const commentEndpoint = `/posts/${postId}/comments`;
    const { loading, error, fetchData: postComment } = useApi(commentEndpoint); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!commentText.trim()) {
            setMessage('Comment cannot be empty.');
            return;
        }

        try {
            // Note: In a real app, the JWT token would be stored in the browser 
            // and attached to this request by the useApi hook (we are simulating success here)
            const result = await postComment('POST', { text: commentText });
            
            if (result) {
                setCommentText(''); // Clear the input field
                setMessage('Comment posted successfully!');
                // Call the parent function to refresh the comment list
                onCommentAdded(result); 
            }
        } catch (err) {
            // Display the specific error message from the API (e.g., "Not authorized, token failed.")
            setMessage(error || 'Failed to post comment. Are you logged in?');
        }
    };

    return (
        <div className="comment-form-container" style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
            <h3>Leave a Comment</h3>
            {message && <p className={error ? 'error' : 'success'}>{message}</p>}
            
            {/* NOTE: We skip client-side authentication logic for simplicity in this task. */}
            {/* We assume the useApi hook would handle attaching the stored JWT token. */}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Your comment..."
                        rows="4"
                        disabled={loading}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                    ></textarea>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Post Comment'}
                </button>
            </form>
        </div>
    );
};

export default CommentForm;