import { useEffect, useState } from "react";
import api from "../api/axios";
import { isAxiosError } from "axios";
import SidebarComponent from "../components/sidebar";
import { menuAdmin, menuMerchant, menuAgent } from "../components/sidebar";
import Modal from "../components/modal";

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

interface UserDetails  extends User {
    gender: string;
}

interface FetchedVoucher  {
    id: string;
    voucher_code: string;
    amount: string;
    created_at: string;
    processed: boolean;
    owner: UserDetails;

}
interface VoucherDetail extends FetchedVoucher {
    updated_at: string;
    seller?: UserDetails;  // Optional, as it may sometimes be "ADMIN" instead of a User object
}




interface CreatedVoucher extends FetchedVoucher {
    seller: User;
    updated_at: string;
}

const CreateVoucher: React.FC = () => {
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [role, setRole] = useState<string | null>(null);

    const [soldVouchers, setSoldVouchers] = useState<FetchedVoucher[]>([]);
    const [boughtVouchers, setBoughtVouchers] = useState<FetchedVoucher[]>([])
    const [voucherLoading, setVoucherLoading] = useState<boolean>(true);
    const [soldVoucherError, setSoldVoucherError] = useState<string | null>(null);
    const [boughtVoucherError, setBoughtVoucherError] = useState<string | null>(null);


    const [selectedVoucher, setSelectedVoucher] = useState<VoucherDetail | null> (null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

    // const [showModal, setShowModal] = useState<boolean>(false);
    // const [createdVoucher, setCreatedVoucher] = useState<FetchedVoucher| null>(null);

    const menuItems = (userRole: string | null) => {
        if (userRole === "Admin")
            return menuAdmin;
        else if (userRole === "Merchant")
            return menuMerchant;
        else
            return menuAgent;
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Token ${token}`;
        }

        const fetchMerchants = async () => {
            if (role === "Agent") {
                try {
                    const response = await api.get<Merchant[]>("/api/admin/merchants/");
                    setMerchants(response.data);
                } catch (err) {
                    console.error("Error fetching merchants:", err);
                    setError("Failed to load merchants. Please try again.");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        const fetchUserRole = async () => {
            try {
                const response = await api.get("/api/account/get-user/");
                const userRole = response.data.role;
                setRole(userRole);
                localStorage.setItem("userRole", userRole);
            } catch (err) {
                console.error("Error fetching user role:", err);
                setError("Failed to load user role.");
            }
        };

        const fetchSoldVouchers = async () => {
            setVoucherLoading(true);
            try {
                const response = await api.get<FetchedVoucher[]>("/api/voucher/sold_vouchers/");
                setSoldVouchers(response.data);
            } catch (err) {
                console.error("Error fetching vouchers:", err);
                setSoldVoucherError("Failed to load vouchers.");
            } finally {
                setVoucherLoading(false);
            }
        };

        const fetchBoughtVouchers = async () => {
            setVoucherLoading(true); //
            try {
                const response = await api.get<FetchedVoucher[]>("/api/voucher/bought_vouchers/");
                setBoughtVouchers(response.data);
            } catch (err) {
                console.error("Error fetching bought vouchers:", err);
                setBoughtVoucherError("Failed to load bought vouchers."); // Assume you have a state for errors
            } finally {
                setVoucherLoading(false);
            }
        };


        fetchUserRole();
        fetchMerchants();
        fetchSoldVouchers();
        fetchBoughtVouchers()
    }, [role]);

    const handleCreateVoucher = async () => {
        if (!amount || (role === "Agent" && !selectedMerchantId)) {
            alert("Please enter an amount" + (role === "Agent" ? " and select a merchant." : "."));
            return;
        }

        try {
            const voucherData = {
                amount,
                //TO DO: CONFIGURE API SO IF ADMIN NO NEED FOR ID
                seller: role === "Agent" ? selectedMerchantId : "151f20d0-da64-4d97-a2e0-b0454011e147",
            };

            const response = await api.post("/api/voucher/create_voucher/", voucherData);
            if (response.status === 201) {
                alert(`Voucher of $${amount} created successfully.`);
                setSelectedMerchantId(null);
                setAmount("");
            } else {
                alert("Failed to create voucher. Please try again.");
            }
        } catch (error) {
            if (isAxiosError(error)) {
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
            const response = await api.post("/api/voucher/process_voucher/", {
                voucher_code: voucherCode,
            });

            if (response.status === 200) {
                alert("Voucher processed successfully.");
                setSoldVouchers(prev => prev.map(voucher =>
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

    const renderMerchantSection = () => {
        if (loading) return <p>Loading merchants...</p>;
        if (error) return <p className="text-red-500">{error}</p>;
        if (role === "Agent") {
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {merchants.map((merchant) => (
                        <div
                            key={merchant.id}
                            onClick={() => setSelectedMerchantId(merchant.user.id)}
                            className={`p-6 ${selectedMerchantId === merchant.user.id ? "bg-blue-700" : "bg-gray-800"} text-white rounded-lg shadow-md cursor-pointer`}
                        >
                            <h2 className="text-xl font-bold">
                                {merchant.user.first_name} {merchant.user.last_name}
                            </h2>
                            <p>Email: {merchant.user.email}</p>
                            <p>Phone: {merchant.user.phone_number}</p>
                            <p>Click to select this merchant</p>
                        </div>
                    ))}
                </div>
            );
        }
        return <p className="text-gray-500">Only agents can select merchants to buy from.</p>;
    };

    const renderVoucherCreation = () => {
        if (!selectedMerchantId && role === "Agent" || role == "Admin") return null;

        return (
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
        );
    };

    const handleViewDetails = async (voucherCode:string) => {
        setIsLoadingDetails(true);
        try {
            const response = await api.get(`/api/voucher/get_voucher/?voucher_code=${voucherCode}`);
            setSelectedVoucher(response.data);
            setIsModalOpen(true);
        } catch (err) {
            console.error("Failed to fetch voucher details:", err);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const renderSoldVoucherList = () => {
        if (role !== "Merchant" && role !== "Admin") {
            return <p className="mt-8 text-gray-500">You do not have permission to view this section.</p>;
        }

        if (voucherLoading) return <p>Loading vouchers...</p>;
        if (soldVoucherError) return <p className="text-red-500">{soldVoucherError}</p>;

        return (
            <div className="mt-12">
                <h1>SOLD VOUCHERS</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {soldVouchers.map(voucher => (
                        <div key={voucher.id} className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
                            <h3>Voucher Code: {voucher.voucher_code}</h3>
                            <p>Amount: ${voucher.amount}</p>
                            <p>Created At: {new Date(voucher.created_at).toLocaleString()}</p>
                            <p>Processed: {voucher.processed ? "Yes" : "No"}</p>
                            <div className="mt-2">
                                <h4 className="font-semibold">Owner Details:</h4>
                                <p>Name: {voucher.owner.first_name} {voucher.owner.last_name}</p>
                            </div>
                            {!voucher.processed && (
                                <button
                                    onClick={() => handleProcessVoucher(voucher.voucher_code)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4"
                                    disabled={false}
                                >
                                    Process Voucher
                                </button>
                            )}
                            <button
                                onClick={() => handleViewDetails(voucher.voucher_code)}
                                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4 ml-2"
                            >
                                {isLoadingDetails ? "Loading..." : "View Details"}
                            </button>
                        </div>
                    ))}
                </div>
                {/* Modal for full voucher details */}
                <Modal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    {selectedVoucher && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Voucher Details</h2>
                            <p><strong>Voucher Code:</strong> {selectedVoucher.voucher_code}</p>
                            <p><strong>Amount:</strong> ${selectedVoucher.amount}</p>
                            <p><strong>Processed:</strong> {selectedVoucher.processed ? "Yes" : "No"}</p>
                            <p><strong>Created At:</strong> {new Date(selectedVoucher.created_at).toLocaleString()}</p>
                            <p><strong>Updated At:</strong> {new Date(selectedVoucher.updated_at).toLocaleString()}</p>

                            <h3 className="font-semibold mt-4">Owner Details</h3>
                            <p>Name: {selectedVoucher.owner.first_name} {selectedVoucher.owner.last_name}</p>
                            <p>Email: {selectedVoucher.owner.email}</p>
                            <p>Phone: {selectedVoucher.owner.phone_number}</p>
                            <p>Gender: {selectedVoucher.owner.gender}</p>

                            <h3 className="font-semibold mt-4">Seller Details</h3>
                            {selectedVoucher.seller ? (
                                <>
                                    <p>Name: {selectedVoucher.seller.first_name ? `${selectedVoucher.seller.first_name} ${selectedVoucher.owner.last_name}` : "ADMIN"}</p>
                                    <p>Email: {selectedVoucher.seller.email}</p>
                                    {selectedVoucher.seller.phone_number && <p>Phone: {selectedVoucher.seller.phone_number}</p>}
                                    {selectedVoucher.seller.gender && <p>Gender: {selectedVoucher.seller.gender}</p>}
                                        </>
                            ) : (
                                <p>Seller: ADMIN</p>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        );
    };

    const renderBoughtVoucherList = () => {
        if (role === "Admin") {
            return <p className="mt-8 text-gray-500">You do not have permission to view this section.</p>;
        }

        if (voucherLoading) return <p>Loading bought vouchers...</p>;
        if (boughtVoucherError) return <p className="text-red-500">{boughtVoucherError}</p>;

        return (
            <div className="mt-12">
                <h1>BOUGHT VOUCHERS</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {boughtVouchers.map(voucher => (
                        <div key={voucher.id} className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
                            <h3>Voucher Code: {voucher.voucher_code}</h3>
                            <p>Amount: ${voucher.amount}</p>
                            <p>Created At: {new Date(voucher.created_at).toLocaleString()}</p>
                            <p>Processed: {voucher.processed ? "Yes" : "No"}</p>
                            <div className="mt-2">
                            </div>
                            <button
                                onClick={() => handleViewDetails(voucher.voucher_code)}
                                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4"
                            >
                                {isLoadingDetails ? "Loading..." : "View Details"}
                            </button>
                        </div>
                    ))}
                </div>
                 {/* Modal for full voucher details */}
                <Modal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    {selectedVoucher && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Voucher Details</h2>
                            <p><strong>Voucher Code:</strong> {selectedVoucher.voucher_code}</p>
                            <p><strong>Amount:</strong> ${selectedVoucher.amount}</p>
                            <p><strong>Processed:</strong> {selectedVoucher.processed ? "Yes" : "No"}</p>
                            <p><strong>Created At:</strong> {new Date(selectedVoucher.created_at).toLocaleString()}</p>
                            <p><strong>Updated At:</strong> {new Date(selectedVoucher.updated_at).toLocaleString()}</p>

                            <h3 className="font-semibold mt-4">Owner Details</h3>
                            <p>Name: {selectedVoucher.owner.first_name} {selectedVoucher.owner.last_name}</p>
                            <p>Email: {selectedVoucher.owner.email}</p>
                            <p>Phone: {selectedVoucher.owner.phone_number}</p>
                            <p>Gender: {selectedVoucher.owner.gender}</p>

                            <h3 className="font-semibold mt-4">Seller Details</h3>
                            {selectedVoucher.seller ? (
                                <>
                                    <p>Name: {selectedVoucher.seller.first_name ? `${selectedVoucher.seller.first_name} ${selectedVoucher.seller.last_name}` : "ADMIN"}</p>
                                    <p>Email: {selectedVoucher.seller.email}</p>
                                    {selectedVoucher.seller.phone_number && <p>Phone: {selectedVoucher.seller.phone_number}</p>}
                                    {selectedVoucher.seller.gender && <p>Gender: {selectedVoucher.seller.gender}</p>}
                                </>
                            ) : (
                                <p>Seller: ADMIN</p>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        );
    };


    return (
        <div className="flex h-screen">
            <SidebarComponent menu={menuItems(role)}/>
            <div className="flex-grow p-8">
                <h1 className="text-2xl mb-4">Create Voucher</h1>
                {renderMerchantSection()}
                {renderVoucherCreation()}
                {renderSoldVoucherList()}
                {renderBoughtVoucherList()}
            </div>
        </div>
    );
};

export default CreateVoucher;

