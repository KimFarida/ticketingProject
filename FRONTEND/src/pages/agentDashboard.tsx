import SidebarComponent from "../components/sidebar";
import {menuMerchant, menuAgent} from "../components/sidebar";
import Card from "../components/card";
import useCounts from "@/hooks/useCounts";



function AgentPage() {
    // Get the role from local storage
    const userRole = localStorage.getItem("userRole") || "AGENT";

    const menuItems = userRole === "Agent" ? menuAgent : menuMerchant;

    const apiEndpoints = [
        '/api/admin/agents/',
        '/api/admin/merchants/',
        '/api/ticket/get-agent-tickets/',
        '/api/voucher/bought_vouchers/',
    ];

    const { counts} = useCounts(apiEndpoints);

    return (
        <>
            <div className="flex h-screen">
                <SidebarComponent menu={menuItems} />

                <div className="flex flex-col flex-1 h-screen overflow-auto p-7">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-semibold">{userRole}</h1>
                        <p className="text-right text-sm">Balance: 0.00</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center md:items-start">
                        <Card
                            totalCount={counts[1] || 0}
                            title="Total Vouchers sold"
                            onClick={() => console.log('View All clicked')}
                            text="View All"
                        />
                        <Card
                            totalCount={counts[1] || 0}
                            title="Total Tickets"
                            onClick={() => console.log('View All clicked')}
                            text='View All'
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AgentPage;
