import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? 'https://profitplay9ja.com.ng/'  // Production URL
        : 'http://localhost:5173',        // Development URL (for Vite proxy)
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
