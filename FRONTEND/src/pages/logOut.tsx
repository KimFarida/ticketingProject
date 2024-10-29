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
            className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-6 hover:bg-white hover:text-black rounded-md hover:border hover:border-gray-400 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
        >
            <div className="min-w-[40px]">
                {/* Replace with an icon if desired */}
            </div>
            <span className={`origin-left duration-200`}>
                {loading ? "Logging out..." : "Logout"}
            </span>
        </button>
    );
};

export default LogoutButton;
