import api from "@/api/axios.ts";
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/account/logout/"); // Call the logout API
            localStorage.clear(); // Clear all auth data
            navigate('/signin', { replace: true }); // Redirect to sign-in
        } catch (error) {
            console.error("Logout error:", error);
            localStorage.clear();
            navigate('/signin', { replace: true });
        }
    };

    return handleLogout;
};

export default useLogout;
