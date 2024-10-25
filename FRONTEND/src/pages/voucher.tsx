import { useEffect, useState } from "react";
import axios from "axios";
import SidebarComponent from "../components/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faHouse, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

interface Merchant {
    id: string;
    user: User;
}

interface Voucher {
    id: string;
    voucher_code: string;
    amount: string;
    created_at: string;
    processed: boolean;
    owner: {
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        gender: string;
    };
}

function CreateVoucher() {
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [voucherLoading, setVoucherLoading] = useState<boolean>(true);
    const [voucherError, setVoucherError] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    const menuItems = [
        { id: 1, name: "Dashboard", link: "/agent", icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 2, name: "Create Vouchers", link: "/create-voucher", icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 3, name: "Profits", link: "/profits", icon: <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 4, name: "Profile", link: "/profile", icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Token ${token}`;
        }

        const fetchMerchants = async () => {
            try {
                const response = await axios.get<Merchant[]>("/api/admin/merchants/");
                setMerchants(response.data);
            } catch (err) {
                console.error("Error fetching merchants:", err);
                setError("Failed to load merchants. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const fetchUserRole = async () => {
            try {
                const response = await axios.get("/api/account/get-user/", {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("token")}`,
                    },
                });
                
                // Extract role from response and store it
                const userRole = response.data.role; 
                console.log(userRole)
                setRole(userRole);
                localStorage.setItem("userRole", userRole); 
            } catch (err) {
                console.error("Error fetching user role:", err);
                setError("Failed to load user role.");
            }
        };

        const fetchBoughtVouchers = async () => {
            setVoucherLoading(true);
            try {
                const response = await axios.get<Voucher[]>("/api/voucher/sold_vouchers/", {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("token")}`,
                    },
                });
                setVouchers(response.data);
            } catch (err) {
                console.error("Error fetching vouchers:", err);
                setVoucherError("Failed to load vouchers.");
            } finally {
                setVoucherLoading(false);
            }
        };

        fetchUserRole();
        fetchMerchants();
        fetchBoughtVouchers();
    }, []);

    const handleCreateVoucher = async () => {
        if (!amount || !selectedMerchantId) {
            alert("Please enter an amount and select a merchant.");
            return;
        }

        try {
            const voucherData = {
                amount,
                seller: selectedMerchantId,
            };
            console.log("Creating voucher with data:", voucherData); 

            const response = await axios.post("/api/voucher/create_voucher/", voucherData);
            if (response.status === 201) {
                alert(`Voucher of $${amount} created successfully for merchant ID: ${selectedMerchantId}`);
                setSelectedMerchantId(null);
                setAmount("");
            } else {
                alert("Failed to create voucher. Please try again.");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error creating voucher:", error.response?.data || error.message);
                alert(`Error: ${error.response?.data?.detail || "An error occurred while creating the voucher."}`);
            } else {
                console.error("Unexpected error:", error);
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    };

    const handleProcessVoucher = async (voucherCode: string) => {
        try {
            const response = await axios.post("/api/voucher/process_voucher/", {
                voucher_code: voucherCode,
            }, {
                headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                },
            });

            if (response.status === 200) {
                alert("Voucher processed successfully.");
                setVouchers(prev => prev.map(voucher =>
                    voucher.voucher_code === voucherCode ? { ...voucher, processed: true } : voucher
                ));
            } else {
                alert("Failed to process the voucher.");
            }
        } catch (err) {
            console.error("Error processing voucher:", err);
            alert("An error occurred while processing the voucher.");
        }
    };

    return (
        <div className="flex h-screen">
            <SidebarComponent menu={menuItems} />
            <div className="flex-grow p-8">
                <h1 className="text-2xl mb-4">Create Voucher</h1>

                {loading ? (
                    <p>Loading merchants...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {merchants.map((merchant) => (
                            <div
                                key={merchant.id}
                                onClick={() => setSelectedMerchantId(merchant.user.id)}
                                className={`p-6 ${selectedMerchantId === merchant.user.id ? "bg-blue-700" : "bg-gray-800"} text-white rounded-lg shadow-md cursor-pointer`}
                            >
                                <h2 className="text-xl font-bold">{merchant.user.first_name} {merchant.user.last_name}</h2>
                                <p>Email: {merchant.user.email}</p>
                                <p>Phone: {merchant.user.phone_number}</p>
                                <p>Click to select this merchant</p>
                            </div>
                        ))}
                    </div>
                )}

                {selectedMerchantId && (
                    <div className="mt-8 p-4 bg-gray-700 text-white rounded-lg">
                        <h2 className="text-xl mb-2">Create Voucher</h2>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full p-2 mb-2 text-black rounded"
                        />
                        <button
                            onClick={handleCreateVoucher}
                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        >
                            Create Voucher
                        </button>
                    </div>
                )}

                {role === "Merchant" || role === "Admin" ? (
                    <div className="mt-12">
                        <h1>Bought Vouchers</h1>
                        {voucherLoading ? (
                            <p>Loading vouchers...</p>
                        ) : voucherError ? (
                            <p className="text-red-500">{voucherError}</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {vouchers.map(voucher => (
                                    <div key={voucher.id} className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
                                        <h3>Voucher Code: {voucher.voucher_code}</h3>
                                        <p>Amount: ${voucher.amount}</p>
                                        <p>Created At: {new Date(voucher.created_at).toLocaleString()}</p>
                                        <p>Processed: {voucher.processed ? "Yes" : "No"}</p>
                                        <button
                                            onClick={() => handleProcessVoucher(voucher.voucher_code)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4"
                                            disabled={voucher.processed}
                                        >
                                            Process Voucher
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="mt-8 text-red-500">You do not have permission to view this page.</p>
                )}
            </div>
        </div>
    );
}

export default CreateVoucher;
