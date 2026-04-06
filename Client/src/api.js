import axios from 'axios';

const API = axios.create({
    // Fallback to localhost if the Vercel variable isn't set
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    timeout: 10000, // 10 seconds timeout for slower Render free-tier wake-ups
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auto-attach JWT Token from LocalStorage if it exists
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;