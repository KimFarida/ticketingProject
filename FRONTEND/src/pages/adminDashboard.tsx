import SidebarComponent from "../components/sidebar";
import Card from "../components/card";
import LineChart from "../components/lineChart";
import useCounts  from "../hooks/useCounts.ts";
import { useNavigate } from "react-router-dom";
import { menuAdmin } from "../components/sidebar.tsx"


function AdminPage() {

  const navigate = useNavigate();

  const menuItems = menuAdmin;
  

  const handleViewAllAgent = () => {   
    navigate("/view-all-agents");
  };

  const handleViewAllMerchant = () => {
    navigate("/view-all-merchants");
  };

  const handleViewAllTicket = () => {
    navigate("/ticket");
  }

  const apiEndpoints = [
    '/api/admin/agents/',
    '/api/admin/merchants/',
    '/api/ticket/get-agent-tickets/',
  ];

  const { counts, loading, error } = useCounts(apiEndpoints); // Use the custom hook

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

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
              totalCount={counts[0] || 0} // Total Agents count
              title="Total Agents"
              onClick={handleViewAllAgent}
              text="View All"
            />
            <Card
              totalCount={counts[1] || 0} // Total Merchants count
              title="Total Merchants"
              onClick={handleViewAllMerchant}
              text="View All"
            />
            <Card
              totalCount={counts[2] || 0} // Total Tickets count
              title="Total Tickets"
              onClick={handleViewAllTicket}
              text="View All"
            />
          </div>
          <div className="p-7 text-xl">
            <h2>Daily Transaction Report</h2>
            <LineChart period="month" />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
