import SidebarComponent from "../components/sidebar";
import {menuMerchant, menuAgent} from "../components/sidebar";
import Card from "../components/card";



function AgentPage() {
    // Get the role from local storage
    const userRole = localStorage.getItem("userRole") || "AGENT";

    const menuItems = userRole === "Agent" ? menuAgent : menuMerchant;

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
                            totalAgents={12}
                            title="Total Vouchers sold"
                            onClick={() => console.log('View All clicked')}
                            text="View All"
                        />
                        <Card
                            totalAgents={20}
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
