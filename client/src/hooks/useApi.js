// client/src/hooks/useApi.js (FINAL CORRECTED VERSION FOR OBJECT/ARRAY)

import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = '/api';

export const useApi = (endpoint) => {
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (method = 'GET', body = null, id = '') => {
        setLoading(true);
        setError(null);

        try {
            const url = `${API_BASE_URL}${endpoint}${id ? '/' + id : ''}`;
            
            // This is the correct way to make the request
            const response = await axios({ method, url, data: body });
            
            // Log the full response object for debugging
            console.log("HOOK DEBUG: Full Axios Response:", response); 
            
            // Extract the data array/object from the server's nested 'data' property
            const responseData = response.data.data; 
            
            // 🚨 FIX: Allow the response to be either an Array (for list) or an Object (for single item)
            if (responseData !== undefined && responseData !== null) {
                setData(responseData); 
            } else {
                // For a successful call that returns no body (like a DELETE), set data to null
                setData(null); 
            }
            
            setLoading(false);
            
            return responseData; 

        } catch (err) {
            console.error("API Call Failed:", err);
            const errorMessage = err.response?.data?.message || err.message || "Unknown error.";
            setError(errorMessage);
            setLoading(false);
            setData(null); 
            throw new Error(errorMessage);
        }
    }, [endpoint]); 

    return { data, loading, error, fetchData };
};