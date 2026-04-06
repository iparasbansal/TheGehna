import axios from 'axios';

const API = axios.create({
    // This tells the app: "Use the live Render URL, otherwise use localhost"
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
});

export default API;