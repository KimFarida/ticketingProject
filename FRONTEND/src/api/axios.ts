import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? 'https://profitplay9ja.com.ng/api'  // Production URL
        : '',                              // Development URL (for Vite proxy)
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;