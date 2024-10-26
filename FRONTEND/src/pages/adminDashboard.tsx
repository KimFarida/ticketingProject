import SidebarComponent from "../components/sidebar";
import Card from "../components/card";
import LineChart from "../components/lineChart";
import LogoutButton from "./logOut";
import { faChartLine, faCreditCard, faHouse, faShop} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

function AdminPage() {

  const navigate = useNavigate();

  const menuItems = [
    { id: 1, name: 'Dashboard', link: '/admin', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 2, name: 'Merchant', link: '/view-all-merchants', icon: <FontAwesomeIcon icon={faShop} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 3, name: 'Transactions', link: '/admin_ticket', icon: <FontAwesomeIcon icon={faCreditCard} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 4, name: 'Payout', link: '/adminPayout', icon: <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 object-contain text-gray-300" /> },
  ]
  

  const handleViewAllAgent = () => {   
    navigate("/view-all-agents");
  };

  const handleViewAllMerchant = () => {
    navigate("/view-all-merchants");
  };


  return (    
    <>
      <div className="flex h-screen"> {/* Flex container with full height */}
        {/* Sidebar */}
        <SidebarComponent menu={menuItems} />

        {/* Main Content */}
        <div className="flex flex-col flex-1 p-4 h-screen overflow-auto">
          <h1 className="text-2xl font-semibold mb-6 ">ADMIN</h1>

          {/* Card Section */}
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center md:items-start">
            <Card
              totalAgents={12}
              title="Total Agents"
              onClick={handleViewAllAgent}
              text = "View All"
            />
            <Card
              totalAgents={15}
              title="Total Merchants"
              onClick={handleViewAllMerchant}
              text = "View All"
            />
            <Card
              totalAgents={20}
              title="Total Tickets"
              onClick={() => console.log('View All clicked')}
              text = "View All"
            />
          </div>
          <div className="p-7 text-xl">
            <h2>Daily Transaction Report</h2>
            <LineChart period="month" />
          </div>
          <LogoutButton/>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
