import { useEffect, useState } from "react";
import  api from '../api/axios';
import SidebarComponent, {menuAgent, menuMerchant} from "../components/sidebar";


interface Wallet {
    id: string;
    voucher_balance: string;
    bonus_balance: string;
}

interface User {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    wallet: Wallet;
    role: string;
}

function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const userRole = localStorage.getItem("userRole") || "AGENT";

    const menuItems = userRole === "Agent" ? menuAgent : menuMerchant;

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                api.defaults.headers.common["Authorization"] = `Token ${token}`;
            }

            try {
                const response = await api.get<User>("/api/account/get-user/");
                setUser(response.data);
            } catch (err) {
                console.error("Error fetching user details:", err);
                setError("Failed to load user details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div className="flex h-screen">
            <SidebarComponent menu={menuItems} />
            <div className="flex-grow p-8">
                <h1 className="text-2xl mb-4">Profile</h1>

                {loading ? (
                    <p>Loading user details...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    user && (
                        <div className="bg-[#214F02] text-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold">User Details</h2>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>First Name:</strong> {user.first_name}</p>
                            <p><strong>Last Name:</strong> {user.last_name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone Number:</strong> {user.phone_number}</p>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Wallet Details</h3>
                                <p><strong>Voucher Balance:</strong> &#8358;{user.wallet.voucher_balance!}</p>
                                <p><strong>Bonus Balance:</strong> &#8358;{user.wallet.bonus_balance!}</p>
                            </div>
                            <p><strong>Role:</strong> {user.role}</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default ProfilePage;

