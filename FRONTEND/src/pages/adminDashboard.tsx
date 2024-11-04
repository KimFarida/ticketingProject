import { useState, useEffect } from 'react';
import SidebarComponent from "../components/sidebar";
import Card from "../components/card";
import LineChart from "../components/lineChart";
import useCounts from "../hooks/useCounts";
import { menuAdmin } from "../components/sidebar";

function AdminPage() {
  const [isVisible, setIsVisible] = useState(true);
  const menuItems = menuAdmin;

  const apiEndpoints = [
    '/api/admin/agents/',
    '/api/admin/merchants/',
    '/api/ticket/get-agent-tickets/',
  ];

  // Use the improved hook with refresh capability
  const { counts, loading, error, refresh } = useCounts(apiEndpoints);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsVisible(true);
        refresh();
      } else {
        setIsVisible(false);
      }
    };

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refresh]);

  // Handle window focus
  useEffect(() => {
    const handleFocus = () => {
      if (isVisible) {
        refresh();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isVisible, refresh]);

  // Navigation handlers with proper state management
  const handleNavigation = (path: string) => {
    // Using window.location instead of navigate to ensure full page refresh
    // This helps prevent stale data issues
    window.location.href = path;
  };

  const handleViewAllAgent = () => handleNavigation("/view-all-agents");
  const handleViewAllMerchant = () => handleNavigation("/view-all-merchants");
  const handleViewAllTicket = () => handleNavigation("/ticket");

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="flex h-screen">
        <SidebarComponent menu={menuItems} />
        <div className="flex flex-col flex-1 p-4 h-screen overflow-auto">
          <h1 className="text-2xl font-semibold mb-6">ADMIN</h1>
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center md:items-start">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-64 h-32 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="flex h-screen">
        <SidebarComponent menu={menuItems} />
        <div className="flex flex-col flex-1 p-4 h-screen overflow-auto">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <SidebarComponent menu={menuItems} />
      <div className="flex flex-col flex-1 p-4 h-screen overflow-auto">
        <h1 className="text-2xl font-semibold mb-6">ADMIN</h1>

        <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center md:items-start">
          <Card
            totalCount={counts[0] || 0}
            title="Total Agents"
            onClick={handleViewAllAgent}
            text="View All"
          />
          <Card
            totalCount={counts[1] || 0}
            title="Total Merchants"
            onClick={handleViewAllMerchant}
            text="View All"
          />
          <Card
            totalCount={counts[2] || 0}
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
  );
}

export default AdminPage;
