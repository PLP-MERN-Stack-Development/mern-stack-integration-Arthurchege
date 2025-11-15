// client/src/components/Auth.jsx

import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // 🚨 NEW: Import axios for direct registration post

const API_BASE_URL = '/api/auth';

const Auth = ({ isRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login, logout, authLoading, authError } = useAuth();
    const [formError, setFormError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        const credentials = { name, email, password };

        if (isRegister) {
            // --- 🚨 Handle Registration Submission via AXIOS/JSON ---
            if (!name || !email || !password) {
                setFormError("Please fill in all fields.");
                return;
            }

            try {
                // Send data directly as JSON to the registration endpoint
                const response = await axios.post(`${API_BASE_URL}/register`, credentials);
                
                if (response.data.token) {
                    alert("Registration successful! Please login.");
                    // After successful register, navigate to login page
                    navigate('/login'); 
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Registration failed. Check server logs.";
                setFormError(errorMessage);
                // 🚨 Log the full error to the console for deep debugging
                console.error("Registration Submission Error:", error); 
            }
            return;
        }

        // --- Handle Login Submission ---
        const success = await login(email, password);

        if (success) {
            navigate('/');
        }
    };

    const titleText = isRegister ? 'Register' : 'Login';
    const linkText = isRegister ? 'Login here' : 'Register here';
    const linkPath = isRegister ? '/login' : '/register';

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>{titleText}</h2>
            {/* 🚨 Form is now a wrapper for the axios submission */}
            <form onSubmit={handleSubmit}>
                {isRegister && (
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                )}
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" disabled={authLoading}>
                    {authLoading ? 'Loading...' : titleText}
                </button>
            </form>
            
            {(authError || formError) && <p className="error" style={{ color: 'red' }}>{authError || formError}</p>}
            
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                {isRegister ? 'Already have an account?' : 'Don\'t have an account?'} <Link to={linkPath}>{linkText}</Link>
            </p>
        </div>
    );
};

export default Auth;