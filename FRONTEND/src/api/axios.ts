import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? 'https://profitplay9ja.com.ng/'  // Changed this to include /api
        : '/',  // Changed this for local development
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.clear(); // Clear all auth data
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export default api;
