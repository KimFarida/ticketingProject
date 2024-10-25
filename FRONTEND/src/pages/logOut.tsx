import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import  api from '../api/axios';

const LogoutButton: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Utility function to get the token
    const getToken = () => localStorage.getItem("token");

    // Function to clear token and navigate
    const Navigate = () => {
        console.log("Token has been removed.");
        //localStorage.removeItem("token");
        navigate("/");
    };

    const handleLogout = async () => {
        setLoading(true);
        setError(null); // Reset error state
    
        try {
            // Perform the logout request using the fetch API
            const response = await api.post("/api/account/logout", {
                method: "POST", // Explicitly set POST method
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Token ${getToken()}`, // Authorization header with token
                },
            });
    
            // Log the request method and response status for debugging
            console.log("Request Method:", "POST");
            console.log("Response Status:", response.status);
    
            // Check if the response status indicates a successful logout
            if (response.status === 204) {
                console.log("Logout successful.");
                Navigate();
            } else if (response.status === 401) {
                throw new Error("Unauthorized: Invalid token.");
            } else if (response.status === 405) {
                throw new Error("Method not allowed. Please contact support.");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to log out. Please try again.");
            }
        } catch (err: any) {
            console.error("Error logging out:", err.message);
            setError(err.message);
        } finally {
            setLoading(false); // Reset loading state
        }
    };
    

    useEffect(() => {
        // Log the token value on component mount
        const token = getToken();
        if (token) {
            console.log("Token on page load:", token);
        } else {
            console.log("No token found on page load.");
        }
    }, []);

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            <button
                onClick={handleLogout}
                className={`bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
            >
                {loading ? "Logging out..." : "Logout"}
            </button>
        </div>
    );
};

export default LogoutButton;
