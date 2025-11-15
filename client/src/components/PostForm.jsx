// client/src/components/PostForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

const PostForm = ({ postToEdit }) => {
    // --- 1. State Management ---
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '', 
        featuredImage: null, // 🚨 NEW STATE: File management
    });
    const [categories, setCategories] = useState([]);
    const [formMessage, setFormMessage] = useState('');
    
    // --- 2. API Hooks ---
    const { data: catData, fetchData: fetchCats } = useApi('/categories');
    const { loading, error, fetchData: postRequest } = useApi('/posts'); 
    
    const navigate = useNavigate();

    // --- 3. Initial Load (Categories and Edit Data) ---
    useEffect(() => {
        fetchCats();
    }, [fetchCats]);

    useEffect(() => {
        if (catData && Array.isArray(catData)) {
            setCategories(catData);
        }
    }, [catData]);

    useEffect(() => {
        if (postToEdit) {
            setFormData({
                title: postToEdit.title || '',
                content: postToEdit.content || '',
                category: postToEdit.category?._id || '', 
                // Note: We don't populate featuredImage state with the URL for edits
                featuredImage: null, 
            });
        }
    }, [postToEdit]);

    // --- 4. Form Handlers ---
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    
    // 🚨 NEW HANDLER: For file input
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            featuredImage: e.target.files[0], // Only take the first file
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormMessage('');

        if (!formData.title || !formData.content || !formData.category) {
            setFormMessage('Please fill in all required fields.');
            return;
        }

        try {
            const method = postToEdit ? 'PUT' : 'POST';
            const postId = postToEdit ? postToEdit._id : '';

            // 🚨 CRITICAL: Use FormData object for file uploads
            const dataToSend = new FormData();
            dataToSend.append('title', formData.title);
            dataToSend.append('content', formData.content);
            dataToSend.append('category', formData.category);
            
            if (formData.featuredImage) {
                // 'featuredImage' must match the Multer field name in the backend
                dataToSend.append('featuredImage', formData.featuredImage); 
            }
            
            // Execute the API request. Axios automatically handles the headers for FormData
            const result = await postRequest(method, dataToSend, postId); 
            
            if (result) {
                setFormMessage(`Post successfully ${postToEdit ? 'updated' : 'created'}!`);
                navigate(`/posts/${result._id}`); 
            }
        } catch (err) {
            // Note: The error is in the scope of useApi, we display the external error variable
            setFormMessage(error || 'An error occurred during submission.');
        }
    };

    // --- 5. Render Logic ---
    const titleText = postToEdit ? 'Edit Post' : 'Create New Post';

    return (
        <div className="post-form">
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '15px', display: 'block' }}>
                &larr; Back to all posts
            </Link>
            <h1>{titleText}</h1>
            {/* Form is ready to handle file uploads */}
            <form onSubmit={handleSubmit}> 
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        disabled={loading}
                        rows="10"
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={loading || categories.length === 0}
                    >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 🚨 NEW FORM GROUP: Image Upload */}
                <div className="form-group">
                    <label htmlFor="featuredImage">Featured Image (Max 1MB)</label>
                    <input
                        type="file"
                        name="featuredImage"
                        onChange={handleFileChange}
                        disabled={loading}
                        accept="image/*" 
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : titleText}
                </button>
            </form>

            {formMessage && <p className={`message ${error ? 'error' : 'success'}`}>{formMessage}</p>}
            {error && <p className="error">Submission Error: {error}</p>}
        </div>
    );
};

export default PostForm;