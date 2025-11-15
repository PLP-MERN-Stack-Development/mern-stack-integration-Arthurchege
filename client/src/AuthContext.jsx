// client/src/AuthContext.jsx

import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios'; // 🚨 Imported axios here

const AuthContext = createContext();

// Base API URL is just /api, relying on Vite proxy
const API_BASE_URL = '/api/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [authError, setAuthError] = useState(null);
    const [authLoading, setAuthLoading] = useState(false);

    // --- 1. Login Function ---
    const login = useCallback(async (email, password) => {
        setAuthLoading(true);
        setAuthError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
            
            const { token, user } = response.data;
            
            // Store data in state
            setToken(token);
            setUser(user);
            
            // Store data in local storage for persistence
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Set default header for axios instance (essential for protected routes)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 

            setAuthLoading(false);
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed.";
            setAuthError(errorMessage);
            setAuthLoading(false);
            return false;
        }
    }, []);

    // --- 2. Logout Function ---
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization']; // Remove the header
    }, []);

    // Set default auth header when context initializes (for page refreshes)
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return (
        <AuthContext.Provider value={{ user, token, authError, authLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);