import axios from 'axios';

const API = axios.create({
    // REPLACE the URL below with your ACTUAL Render URL
    baseURL: 'https://thegehna.onrender.com/api/v1', 
    timeout: 30000, // 30 seconds to allow Render to wake up
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auto-attach JWT Token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;