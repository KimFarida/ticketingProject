import {useEffect, useState} from "react";
import SidebarComponent, {menuAdmin} from "../components/sidebar";
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '../api/axios';
import {PayoutDetails, PayoutSettings} from "@/types/types.ts";
import PayoutSearch from "@/components/payoutSearch";
import StatusToggle from "@/components/statusToggle";
import PayOutDetailsModal from "@/components/payoutDetailsModal";
import PayoutSettingsModal from "@/components/payoutSettingsModal.tsx";

export function AdminPayout() {
  const [payoutList, setPayoutList] = useState<PayoutDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutDetails | null>(null);
  const [showPayoutSettings, setShowPayoutSettings] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<PayoutSettings | null>(null);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      fetchPayoutList(selectedStatus);
    }
  }, [selectedStatus]);

  const fetchPayoutList = async (status: string) => {
    try {
      const response = await api.get(`/api/payout/list/?status=${status}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const payoutData = response.data?.data || [];
      setPayoutList(Array.isArray(payoutData) ? payoutData : []);
      console.log('Payout List Response:', payoutData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch payout list. Please try again.");
    }
  };

  const processPayment = async (payment_Id: string, status: string = "approved") => {
    setLoading(true);
    setError(null);

    try {
      await api.put(`/api/payout/process/${payment_Id}`, {status});
      await fetchPayoutList(selectedStatus);
    } catch (err) {
      console.error(err);
      setError("Failed to process the payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (payout: PayoutDetails) => {
    setSelectedPayout(payout);
    setIsModalVisible(true);
  };

  const handleProcessInModal = async (paymentId: string, newStatus: string) => {
    await processPayment(paymentId, newStatus);
    setIsModalVisible(false);
  };

  const handleUpdateSettings = async (settings: PayoutSettings) => {
      try {
          const response = await api.post('/api/admin/update-payout-settings/', null, {
            params: {
                monthly_quota: settings.monthly_quota,
                full_salary: settings.full_salary,
                partial_salary_percentage: settings.partial_salary_percentage
            }
        });
        setCurrentSettings(response.data.settings);
      } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Failed to update settings');
      }
};


  return (
    <div className="flex h-screen">
      <SidebarComponent menu={menuAdmin} />
      <div className="flex-1 p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Payout Management</h1>

        <section className="mb-8">
          <Button
                onClick={() => setShowPayoutSettings(true)}
                className="bg-[#000000] text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
                Update Payout Settings
          </Button>

          <h2 className="text-xl font-semibold mb-2">Search Payout</h2>
          <PayoutSearch />
          {loading && <p>Processing payment...</p>}
          {error && <p className="text-red-500">{error}</p>}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Payout List</h2>
          <StatusToggle selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
          {Array.isArray(payoutList) && payoutList.length === 0 ? (
            <p>No {selectedStatus} requests available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {payoutList.map((payout) => (
                <div
                  key={payout.payment_id}
                  className="bg-[#214F02] shadow-md p-4 rounded-md text-white flex flex-col space-y-2"
                >
                  <h2 className="text-lg">
                    {payout.user.first_name} {payout.user.last_name}
                  </h2>
                  <p className="text-sm">{payout.user.email}</p>
                  <p className="text-sm">{payout.user.phone_number}</p>
                  <p className="text-sm">Amount: &#8358;{payout.amount}</p>
                  <p className="text-sm">Status: {payout.status}</p>
                  {payout.status === "pending" && (
                    <button
                      onClick={() => processPayment(payout.payment_id)}
                      className="bg-[#000000] text-white text-sm px-2 py-1 rounded-md mt-2 hover:bg-gray-600 w-full sm:w-auto"
                    >
                      Process Payment
                    </button>
                  )}
                  <button
                    onClick={() => handleViewDetails(payout)}
                    className="bg-blue-500 text-white text-sm px-2 py-1 rounded-md mt-2 hover:bg-blue-600 w-full sm:w-auto"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedPayout && (
          <PayOutDetailsModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            payoutRequest={selectedPayout}
            onProcess={handleProcessInModal}
            showProcessButton
          />
        )}
      </div>
        <PayoutSettingsModal
          isOpen={showPayoutSettings}
          onClose={() => setShowPayoutSettings(false)}
          onSubmit={handleUpdateSettings}
          currentSettings={currentSettings}
        />
    </div>
  );
}
