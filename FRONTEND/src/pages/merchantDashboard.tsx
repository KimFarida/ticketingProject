import SidebarComponent from "../components/sidebar";
import { faChartLine,faHouse, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function MerchantPage() {

    const menuItems = [
        { id: 1, name: 'Dashboard', link: '/dashboard', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 2, name: 'Create Vouchers', link: '/merchant', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 3, name: 'Create Tickets', link: '/transactions', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 4, name: 'Profits', link: '/profits',icon: <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 5, name: 'Profile', link: '/profile', icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> }
      ];

    return (
        <>
            <div className="flex h-screen">
                <SidebarComponent menu={menuItems} />

                <div className="flex flex-col flex-1 h-screen overflow-auto p-7">
                    <h1 className="text-2xl font-semibold mb-6 ">MERCHANT</h1>
                </div>
            </div>

        </>
    )
}

export default MerchantPage;