import React, { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import SidebarComponent from '../components/sidebar.tsx';
import { menuAdmin, menuMerchant, menuAgent } from '../components/sidebar.tsx';
import { voucherApi } from '../api/voucherApi.ts';
import MerchantSelector from '../components/merchantSelector.tsx';
import VoucherCreationForm from '../components/voucherCreationForm.tsx';
import VoucherList from '../components/voucherList.tsx';
import VoucherDetailsModal from '../components/voucherDetailsModal.tsx';
import VoucherSearch from "../components/voucherSearch.tsx";
import { Merchant, FetchedVoucher, VoucherDetail } from '../types/types.ts';

const CreateVoucher: React.FC = () => {
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    const [soldVouchers, setSoldVouchers] = useState<FetchedVoucher[]>([]);
    const [boughtVouchers, setBoughtVouchers] = useState<FetchedVoucher[]>([]);
    const [voucherLoading, setVoucherLoading] = useState<boolean>(true);
    const [soldVoucherError, setSoldVoucherError] = useState<string | null>(null);
    const [boughtVoucherError, setBoughtVoucherError] = useState<string | null>(null);

    const [selectedVoucher, setSelectedVoucher] = useState<VoucherDetail | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

    const menuItems = (userRole: string | null) => {
        if (userRole === "Admin") return menuAdmin;
        if (userRole === "Merchant") return menuMerchant;
        return menuAgent;
    };

    useEffect(() => {
        const initializeData = async () => {
            try {
                // First get and set user role
                const userRole = await voucherApi.fetchUserRole();
                console.log('Fetched user role:', userRole); // Debug log
                setRole(userRole);
                localStorage.setItem("userRole", userRole);

                // Fetch data based on role
                const fetchData = async () => {
                    try {
                        // For Agent role, fetch merchants first
                        if (userRole === "Agent") {
                            const merchantsData = await voucherApi.fetchMerchants();
                            setMerchants(merchantsData);
                        }

                        // Then fetch vouchers based on role permissions
                        const promises = [];

                        // Only fetch sold vouchers for Merchant and Admin
                        if (["Merchant", "Admin"].includes(userRole)) {
                            promises.push(voucherApi.fetchSoldVouchers());
                        } else {
                            promises.push(Promise.resolve([]));
                        }

                        // Only fetch bought vouchers for Merchant and Agent
                        if (["Merchant", "Agent"].includes(userRole)) {
                            promises.push(voucherApi.fetchBoughtVouchers());
                        } else {
                            promises.push(Promise.resolve([]));
                        }

                        const [soldVouchersData, boughtVouchersData] = await Promise.all(promises);

                        setSoldVouchers(soldVouchersData);
                        setBoughtVouchers(boughtVouchersData);
                    } catch (err) {
                        console.error("Error fetching role-specific data:", err);
                        setError("Failed to load data for your role");
                    }
                };

                await fetchData();
            } catch (err) {
                console.error("Error in initialization:", err);
                setError("Failed to initialize application");
            } finally {
                setLoading(false);
                setVoucherLoading(false);
            }
        };

        initializeData();
    }, []);

    const handleCreateVoucher = async () => {
        if (!amount || (role === "Agent" && !selectedMerchantId)) {
            alert("Please enter an amount" + (role === "Agent" ? " and select a merchant." : "."));
            return;
        }

        try {
            if (role === "Agent" && !selectedMerchantId) {
                throw new Error("selectedMerchantId is required for Agents");
            }

            const voucherData = {
                amount,
                seller: role === "Agent" ? selectedMerchantId! : "151f20d0-da64-4d97-a2e0-b0454011e147",
            };

            const response = await voucherApi.createVoucher(voucherData);

            if (response.status === 201) {
                alert(`Voucher of ₦${amount} created successfully.`);
                setSelectedMerchantId(null);
                setAmount("");

                const newBoughtVouchers = await  voucherApi.fetchBoughtVouchers()
                setBoughtVouchers(newBoughtVouchers);

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
            const response = await voucherApi.processVoucher(voucherCode);

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

    const handleViewDetails = async (voucherCode: string) => {
        setIsLoadingDetails(true);
        try {
            const voucherDetails = await voucherApi.getVoucherDetails(voucherCode);
            setSelectedVoucher(voucherDetails);
            setIsModalOpen(true);
        } catch (err) {
            console.error("Failed to fetch voucher details:", err);
            alert("Failed to load voucher details. Please try again.");
        } finally {
            setIsLoadingDetails(false);
        }
    };

    return (
    <div className="flex h-screen">
        <SidebarComponent menu={menuItems(role)} />
        <div className="flex-1 overflow-y-auto p-4">
            <h1 className="text-2xl mb-4">Create Voucher</h1>
            {/* Only show merchant selector for Agent role */}
            {role === "Agent" && (
                <MerchantSelector
                    merchants={merchants}
                    selectedMerchantId={selectedMerchantId}
                    onSelectMerchant={setSelectedMerchantId}
                    loading={loading}
                    error={error}
                    role={role}
                />
            )}

            <VoucherCreationForm
                amount={amount}
                onAmountChange={setAmount}
                onCreateVoucher={handleCreateVoucher}
                selectedMerchantId={selectedMerchantId}
                role={role}
            />

            {/*Search Voucher */}
            <div className="mb-8">
                <h2 className="text-xl mb-4">Search Voucher</h2>
                <VoucherSearch
                    role={role}
                    onVoucherProcess={handleProcessVoucher}
                />
            </div>

            {/* Only show sold vouchers for Merchant and Admin */}
            {["Merchant", "Admin"].includes(role || "") && (
                <VoucherList
                    title="SOLD VOUCHERS"
                    vouchers={soldVouchers}
                    loading={voucherLoading}
                    error={soldVoucherError}
                    onProcess={handleProcessVoucher}
                    onViewDetails={handleViewDetails}
                    isLoadingDetails={isLoadingDetails}
                    showProcessButton={true}
                    role={role}
                    allowedRoles={["Merchant", "Admin"]}
                />
            )}

            {/* Only show bought vouchers for Merchant and Agent */}
            {["Merchant", "Agent"].includes(role || "") && (
                <VoucherList
                    title="BOUGHT VOUCHERS"
                    vouchers={boughtVouchers}
                    loading={voucherLoading}
                    error={boughtVoucherError}
                    onViewDetails={handleViewDetails}
                    isLoadingDetails={isLoadingDetails}
                    role={role}
                    allowedRoles={["Merchant", "Agent"]}
                />
            )}

            <VoucherDetailsModal
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                voucher={selectedVoucher}
            />
        </div>
    </div>
    );
};

export default CreateVoucher;