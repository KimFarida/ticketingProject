import SidebarComponent from "../components/sidebar";
import {menuMerchant, menuAgent} from "../components/sidebar";
import Card from "../components/card";
import useCounts from "@/hooks/useCounts";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {useState} from 'react';



function AgentPage() {
    // Get the role from local storage
    const userRole = localStorage.getItem("userRole") || "AGENT";

    const [balance, setBalance] = useState<number | null>(null)

    const menuItems = userRole === "Agent" ? menuAgent : menuMerchant;

    const navigate = useNavigate();


    const getBalance = async ()=>{
        const response = await api.get('/api/account/get-user/');
        const balance= response.data.wallet.voucher_balance as number;
        setBalance(balance);


    }
    getBalance();

        const apiEndpoints = userRole === 'Agent' ? [
        '/api/ticket/get-agent-tickets/',
        '/api/voucher/bought_vouchers/',
        ] : [
            '/api/voucher/bought_vouchers/',
            '/api/voucher/sold_vouchers/',
        ]

    const { counts} = useCounts(apiEndpoints);

    return (
        <>
            <div className="flex h-screen">
                <SidebarComponent menu={menuItems} />

                <div className="flex flex-col flex-1 h-screen overflow-auto p-7">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-semibold">{userRole}</h1>
                        <p className="text-right text-sm">Balance: &#8358;{balance}</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center md:items-start">
                        <Card
                            totalCount={counts[0] || 0}
                            title={userRole === "Merchant" ? "Total Vouchers Bought" : "Total Tickets Sold"}
                            onClick={userRole === 'Merchant' ? ()=>navigate('/create-voucher') : ()=>navigate('/ticket')}
                            text="View All"
                        />
                        <Card
                            totalCount={counts[1] || 0}
                            title={userRole === "Merchant" ? "Total Vouchers sold" : "Total Vouchers Bought"}
                            onClick={()=>navigate('/create-voucher')}
                            text='View All'
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AgentPage;
