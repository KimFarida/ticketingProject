import  api from '../api/axios';
import { AxiosError } from 'axios';
import { useEffect, useState } from "react";
import SidebarComponent, {menuAgent} from "../components/sidebar";
import PayoutSearch from "@/components/payoutSearch";
import PayoutRequestModal from "@/components/payoutRequestModal.tsx";
import {PayoutResponse, PayoutDetails} from "@/types/types.ts";


export function Payout() {
    const [payoutList, setPayoutList] = useState<PayoutDetails[]>([]);
    const [amount, setAmount] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isRequestModalVisible, setRequestModalVisible] = useState<boolean>(false);
    const [payoutRequest, setPayoutRequest] = useState<PayoutResponse | any>(null);
    const [error, setError] = useState<string>("");

    const menuItems = menuAgent

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Token ${token}`;
            fetchPayoutList();
        }
    }, []);

    const fetchPayoutList = async () => {
        try {
            const response = await api.get("/api/payout/list/", {
                headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                },
            });
            const payoutData = response.data?.data || [];
            setPayoutList(Array.isArray(payoutData) ? payoutData : []);
            console.log('Payout List Response:', payoutData);
        } catch (err) {
            console.error(err);
        }
    };

    const requestPayout = async () => {
        if (!amount) {
            setError("Please enter an amount.");
            return;
        }
        
        setError("");
        setLoading(true);
            try {
                const response = await api.post<PayoutResponse>('/api/payout/request/', {
                    amount: amount
            });

            setPayoutRequest(response.data);
            setRequestModalVisible(true);
            await fetchPayoutList();
            setAmount("");
        } catch (err) {
            const error = err as AxiosError;
            console.log(error)

            // Use optional chaining to safely access the error response
            const reason = (error.response?.data as any)?.amount?.[0]|| (error.response?.data as any)?.non_field_errors?.[0];
            if (reason) {
                setError(reason);
            } else {
                setError("Failed to request payout.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex h-screen">
            <SidebarComponent menu={menuItems} />
            <div className="flex-grow p-4">
                <h2 className="text-xl font-bold mb-6">Request Payout</h2>
                <h4 className="text-xl font-medium mb-6">Current Bonus Balance : {localStorage.getItem("bonus_balance")}</h4>
                <div className="mb-4">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Check for negative values
                            if (value === '' || Number(value) >= 0) {
                                setAmount(value);
                            }
                        }}
                        placeholder="Enter amount"
                        className="border rounded px-3 py-2 mr-2"
                    />
                    <button
                        onClick={requestPayout}
                        className={`bg-[#000000] text-white px-4 py-2 rounded ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Request Payout"}
                    </button>
                    {error && <span className="text-red-500 ml-2">{error}</span>}
                </div>

                <PayoutRequestModal
                    isVisible={isRequestModalVisible}
                    onClose={() => setRequestModalVisible(false)}
                    payoutRequest = {payoutRequest}

                />

                <h2 className="text-xl font-bold mb-4">Search</h2>
                <div className="mb-4">
                    <PayoutSearch/>
                </div>
                <div className="payout-history">
                    <h2 className="text-xl font-bold mb-4">Payout History</h2>
                    <ul className="border rounded-lg shadow-md">
                        <li className="flex justify-between border-b bg-gray-200 py-2 font-semibold">
                            <span>Payment ID</span>
                            <span>Requested At</span>
                            <span>Amount</span>
                            <span>Status</span>
                        </li>
                        {payoutList.map((payout) => (
                            <li key={payout.payment_id} className="flex justify-between border-b py-2">
                                <span>{payout.payment_id}</span>
                                <span>{new Date(payout.requested_at).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                })}</span>
                                <span>&#8358;{payout.amount}</span>
                                <span>{payout.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
}
