import { faHouse, faPlus, faChartLine, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import  api from '../api/axios';
import { useEffect, useState } from "react";
import SidebarComponent from "../components/sidebar";

interface PayoutList {
    amount: string;
    requested_at: string;
    status: string;
    payment_id: string;
    user: {
        role: string;
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
    };
}

export function Payout() {
    const [payoutList, setPayoutList] = useState<PayoutList[]>([]);
    const [amount, setAmount] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const menuItems = [
        { id: 1, name: 'Dashboard', link: '/agent', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 2, name: 'Create Vouchers', link: '/create-voucher', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 3, name: 'Create Tickets', link: '/ticket', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 4, name: 'Payout', link: '/payout', icon: <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 5, name: 'Profile', link: '/profile', icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> }
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Token ${token}`;
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
            const response = await api.post('/api/payout/request/', {
                amount: amount 
            });
            console.log('Payout Request Response:', response.data);
            fetchPayoutList(); 
            setAmount(""); 
        } catch (err) {
            console.error('Error requesting payout:', err);
            setError("Failed to request payout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen">
            <SidebarComponent menu={menuItems} />
            <div className="flex-grow p-4">
                <div className="mb-4">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="border rounded px-3 py-2 mr-2"
                    />
                    <button
                        onClick={requestPayout}
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Request Payout"}
                    </button>
                    {error && <span className="text-red-500 ml-2">{error}</span>}
                </div>
                
                <h2 className="text-lg font-semibold mb-2">Payout List</h2>
                <ul>
                    {payoutList.map((payout) => (
                        <li key={payout.payment_id} className="flex justify-between border-b py-2">
                            <span>{payout.amount}</span>
                            <span>{payout.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
