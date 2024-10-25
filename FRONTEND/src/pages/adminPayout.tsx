import { useState, useEffect } from "react";
import SidebarComponent from "../components/sidebar";
import { faChartLine, faCreditCard, faHouse, faShop, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  api from '../api/axios';

interface PayoutList {
  amount: string;
  requested_at: string;
  status: string;
  payment_id: string;
  user: {
    role: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
}

export function AdminPayout() {
  const [payoutList, setPayoutList] = useState<PayoutList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      fetchPayoutList();
    }
  }, []);

  const fetchPayoutList = async () => {
    try {
      const response = await api.get("/api/payout/list/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const payoutData = response.data?.data || [];
      setPayoutList(Array.isArray(payoutData) ? payoutData : []);
      console.log('Payout List Response:', payoutData);
    } catch (err) {
      console.error(err);
    }
  };


  const processPayment = async (payment_Id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.put(`/api/payout/process/${payment_Id}`, {
        status: "approved",
      });
      
      await fetchPayoutList();
    } catch (err) {
      console.error(err);
      setError("Failed to process the payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 1, name: 'Dashboard', link: '/admin', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 2, name: 'Merchant', link: '/view-all-merchants', icon: <FontAwesomeIcon icon={faShop} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 3, name: 'Transactions', link: '/admin_ticket', icon: <FontAwesomeIcon icon={faCreditCard} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 4, name: 'Payout', link: '/adminPayout', icon: <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 5, name: 'Profile', link: '/profile', icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> }
  ];

  return (
    <div className="flex h-screen">
      <SidebarComponent menu={menuItems} />
      <div className="flex-1 p-4">
        {loading && <p>Processing payment...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.isArray(payoutList) && payoutList.map((payout) => (
            <div
            key={payout.payment_id}
            className="bg-[#214F02] shadow-md p-4 rounded-md text-white flex flex-col space-y-2"
          >
            <h2 className="text-lg">
              {payout.user.first_name} {payout.user.last_name}
            </h2>
            <p className="text-sm">{payout.user.email}</p>
            <p className="text-sm ">{payout.user.phone_number}</p>
            <p className="text-sm">Amount: {payout.amount}</p>
            <p className="text-sm">Status: {payout.status}</p>
            {payout.status === "pending" && (
              <button
                onClick={() => processPayment(payout.payment_id)}
                className="bg-[#000000] text-white text-sm px-2 py-1 rounded-md mt-2 hover:bg-gray-600 w-full sm:w-auto"
              >
                Process Payment
              </button>
            )}
          </div>          
          ))}
        </div>
      </div>
    </div>
  );
}
