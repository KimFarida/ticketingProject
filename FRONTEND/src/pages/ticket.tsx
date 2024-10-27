import { useEffect, useState } from "react";
import SidebarComponent from "../components/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faHouse, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import api from "../api/axios";

interface Ticket {
    id: string;
    name: string;
    unit_price: string;
    description: string;
    expiration_date: string;
}

interface AgentTicket {
    id: string;
    ticket_code: string;
    buyer_name: string;
    buyer_contact: string;
    agent: string;
    ticket_type: string;
    created_at: string;
    updated_at: string;
    valid_until: string;
    valid: boolean;
}

function TicketPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [agentTickets, setAgentTickets] = useState<AgentTicket[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [formData, setFormData] = useState({
        buyer_name: "",
        buyer_contact: "",
        quantity: 1,
    });
    const [title, setTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const menuItems = [
        { id: 1, name: 'Dashboard', link: '/agent', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 2, name: 'Create Vouchers', link: '/create-voucher', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 3, name: 'Create Tickets', link: '/ticket', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 4, name: 'Payout', link: '/payout', icon: <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 5, name: 'Profile', link: '/profile', icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> }
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole")

        if (role == 'Admin'){
            setTitle("All Tickets")
        }
        else{
            setTitle("Agent Tickets")
        }
        if (token) {
            api.defaults.headers.common["Authorization"] = `Token ${token}`;
            fetchTickets();
            fetchAgentTickets();
        }
    }, []);

    const fetchTickets = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            api.defaults.headers.common["Authorization"] = `Token ${token}`;
            const response = await api.get("/api/ticket/ticket-types/list/");
            setTickets(response.data);
        }
    };

    const handleCreateTicket = async () => {
        try {
            if (selectedTicket) {
                const token = localStorage.getItem("token");
                api.defaults.headers.common["Authorization"] = `Token ${token}`;

                console.log("Request data:", {
                    ...formData,
                    ticket_type: selectedTicket.id,
                });

                await api.post("/api/ticket/create-ticket/", {
                    ...formData,
                    ticket_type: selectedTicket.id,
                });
                alert("Ticket created successfully!");
                setShowPopup(false);
                setFormData({ buyer_name: "", buyer_contact: "", quantity: 1 });
            }
        } catch (error: any) {
            console.log("Error creating ticket:" , error.response?.data || error.message);
            console.error("Error creating ticket:", error);
            setErrorMessage(error.response?.data?.error || "Please check your input and try again.");
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleCardClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setShowPopup(true);
    };

    const fetchAgentTickets = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                api.defaults.headers.common["Authorization"] = `Token ${token}`;
                const response = await api.get("/api/ticket/get-agent-tickets/");
                setAgentTickets(response.data.tickets);
            }
        } catch (error) {
            console.error("Error fetching agent tickets:", error);
            setErrorMessage("Failed to load tickets. Please try again later.");
        }
    };

    return (
        <div className="flex h-screen">
            <SidebarComponent menu={menuItems} /> 
            <div className="flex-1 p-2 overflow-y-auto"> 
                <h1 className="text-2xl font-bold mb-4">Available Tickets</h1>
                <div className="grid grid-cols-3 gap-4">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="bg-[#0c1d55] shadow-md p-4 rounded-md cursor-pointer"
                            onClick={() => handleCardClick(ticket)}
                        >
                            <h2 className="text-xl font-semibold">{ticket.name}</h2>
                            <p>{ticket.description}</p>
                            <p>Price: {ticket.unit_price}</p>
                        </div>
                    ))}
                </div>
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                            <h2 className="text-2xl font-bold mb-4">Create Ticket for {selectedTicket?.name}</h2>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleCreateTicket();
                            }}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Buyer Name</label>
                                    <input
                                        type="text"
                                        name="buyer_name"
                                        value={formData.buyer_name}
                                        onChange={handleFormChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Buyer Contact</label>
                                    <input
                                        type="text"
                                        name="buyer_contact"
                                        value={formData.buyer_contact}
                                        onChange={handleFormChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleFormChange}
                                        min="1"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowPopup(false)}
                                        className="mr-4 px-2 py-2 bg-gray-500 text-white rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-2 py-2 bg-blue-600 text-white rounded"
                                    >
                                        Create Ticket
                                    </button>
                                </div>
                                <p>{errorMessage}</p>
                            </form>
                        </div>
                    </div>
                )}
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{title}</h2>
                    {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                    <div className="grid grid-cols-3 gap-4">
                        {agentTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="bg-[#0c1d55] text-white shadow-md p-4 rounded-md"
                            >
                                <h3 className="text-xl font-semibold">Ticket Code: {ticket.ticket_code}</h3>
                                <p>Buyer: {ticket.buyer_name}</p>
                                <p>Contact: {ticket.buyer_contact}</p>
                                <p>Created At: {new Date(ticket.created_at).toLocaleString()}</p>
                                <p>Valid Until: {new Date(ticket.valid_until).toLocaleString()}</p>
                                <p>Status: {ticket.valid ? "Valid" : "Expired"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketPage;
