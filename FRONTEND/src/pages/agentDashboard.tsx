import SidebarComponent from "../components/sidebar";
import { faChartLine,faHouse, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "../components/card";


function AgentPage() {
    // Get the role from local storage
    const userRole = localStorage.getItem("userRole") || "AGENT";

    const menuItems = [
        { id: 1, name: 'Dashboard', link: '/agent', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 2, name: 'Create Vouchers', link: '/create-voucher', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 3, name: 'Create Tickets', link: '/ticket', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 4, name: 'Payout', link: '/payout',icon: <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 5, name: 'Profile', link: '/profile', icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> }
    ];

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
