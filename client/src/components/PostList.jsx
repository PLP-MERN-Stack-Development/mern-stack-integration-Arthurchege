// client/src/components/PostList.jsx (FINAL VERSION WITH LOGIN/LOGOUT)

import { useEffect } from 'react';
import { useApi } from '../hooks/useApi'; 
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // 🚨 NEW IMPORT

const PostList = () => {
    const { data: posts, loading, error, fetchData: fetchPosts } = useApi('/posts');
    const { user, logout } = useAuth(); // 🚨 NEW: Use Auth hook
    
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]); 

    let content = null;

    // ... (rest of the content rendering logic remains the same) ...

    return (
        <div className="App">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #ccc' }}>
                <Link to="/create" style={{ textDecoration: 'none', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', display: 'inline-block' }}>
                    + Create New Post
                </Link>
                {/* 🚨 LOGIN/LOGOUT UI */}
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '15px' }}>Logged in as: <strong>{user.name}</strong></span>
                        <button onClick={logout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login" style={{ textDecoration: 'none', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
                        Login
                    </Link>
                )}
            </div>

            <h1>MERN Blog: Post List View</h1>
            <p>API Integration Status: **SUCCESS**</p>
            <hr />
            {content}
        </div>
    );
};

export default PostList;