import { useEffect, useState } from "react";
import  api from '../api/axios';

interface User {
    id: string; 
    login_id: string; 
    role: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

interface Merchant {
    id: string; 
    user: User;
}

function ViewAllMerchants() {
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMerchants = async () => {
            try {
                const response = await api.get<Merchant[]>("/api/admin/merchants/");
                if (Array.isArray(response.data)) {
                    setMerchants(response.data);
                } else {
                    throw new Error("Unexpected response format");
                }
            } catch (err) {
                console.error("Error fetching merchants:", err);
                setError("Failed to load merchants. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchMerchants();
    }, []);

    return (
        <div className="flex h-screen">
            <div className="flex-grow p-8">
                <h1 className="text-2xl mb-4">All Merchants</h1>

                {loading ? (
                    <p>Loading merchants...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : merchants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {merchants.map((merchant) => (
                            <div
                                key={merchant.id}
                                className="p-6 bg-[#6AE803] text-white rounded-lg shadow-md"
                            >
                                <h2 className="text-xl font-bold">
                                    {merchant.user.first_name} {merchant.user.last_name}
                                </h2>
                                <p><strong>Email:</strong> {merchant.user.email}</p>
                                <p><strong>Phone:</strong> {merchant.user.phone_number}</p>
                                <p><strong>Role:</strong> {merchant.user.role}</p>
                                <p><strong>Login ID:</strong> {merchant.user.login_id}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No merchants found.</p>
                )}
            </div>
        </div>
    );
}

export default ViewAllMerchants;
