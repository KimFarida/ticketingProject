// src/components/LogoutButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';

const LogoutButton: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await api.post("/account/logout/"); // Remove the starting /api
            localStorage.clear(); // Clear all auth data
            navigate('/signin', { replace: true });
        } catch (error) {
            console.error("Logout error:", error);
            // Even if the logout request fails, clear local storage and redirect
            localStorage.clear();
            navigate('/signin', { replace: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={`bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
        >
            {loading ? "Logging out..." : "Logout"}
        </button>
    );
};

export default LogoutButton;
