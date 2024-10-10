import { useState, useEffect } from "react";
import SidebarComponent from "../components/sidebar";
import Card from "../components/card";
import LineChart from "../components/lineChart";
import { faChartLine, faCreditCard, faHouse, faShop, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AdminPage() {
  const [transactions, setTransactions] = useState([
    { date: '2024-10-20', amount: 5000 },
    { date: '2024-10-21', amount: 10000 },
    { date: '2024-10-22', amount: 15000 },
    { date: '2024-10-23', amount: 20000 }
  ]);

  const menuItems = [
    { id: 1, name: 'Dashboard', link: '/dashboard', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 2, name: 'Merchant', link: '/merchant', icon: <FontAwesomeIcon icon={faShop} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 3, name: 'Transactions', link: '/transactions', icon: <FontAwesomeIcon icon={faCreditCard} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 4, name: 'Profits', link: '/profits',icon: <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 5, name: 'Profile', link: '/profile', icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> }
  ];
  


  useEffect(() => {
    const newTransaction = { date: '2024-10-24', amount: 18000 };
    const interval = setTimeout(() => {
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
    }, 5000);

    return () => clearTimeout(interval);
  }, []);

  return (    
    <>
      <div className="flex h-screen"> {/* Flex container with full height */}
        {/* Sidebar */}
        <SidebarComponent menu={menuItems} />

        {/* Main Content */}
        <div className="flex flex-col flex-1 h-screen overflow-auto p-7">
          <h1 className="text-2xl font-semibold mb-6 ">ADMIN</h1>

          {/* Card Section */}
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center md:items-start">
            <Card
              totalAgents={12}
              title="Total Agents"
              onClick={() => console.log('View All clicked')}
            />
            <Card
              totalAgents={15}
              title="Total Merchants"
              onClick={() => console.log('View All clicked')}
            />
            <Card
              totalAgents={20}
              title="Total Tickets"
              onClick={() => console.log('View All clicked')}
            />
          </div>
          <div className="p-7 text-xl">
            <h2>Daily Transaction Report</h2>
            <LineChart transactions={transactions} />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
