import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? 'https://profitplay9ja.com.ng/'  // Production URL
        : 'http://localhost:5173',        // Development URL (for Vite proxy)
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;