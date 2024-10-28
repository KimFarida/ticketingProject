import { useEffect, useState } from "react";
import SidebarComponent from "../components/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faHouse,
  faPlus,
  faUser,
  faShop,
  faCreditCard
} from "@fortawesome/free-solid-svg-icons";
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
    ticket_type: string | null;
    created_at: string;
    updated_at: string;
    valid_until: string;
    valid: boolean;
}

function UnifiedTicketPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [agentTickets, setAgentTickets] = useState<AgentTicket[]>([]);
    const [showCreateTicketPopup, setShowCreateTicketPopup] = useState(false);
    const [showCreateTypePopup, setShowCreateTypePopup] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [ticketFormData, setTicketFormData] = useState({
        buyer_name: "",
        buyer_contact: "",
        quantity: 1,
    });

    const [typeFormData, setTypeFormData] = useState({
        name: "",
        unit_price: "",
        description: "",
        expiration_date: "",
        date: "",
        time: ""
    });

    // Different menu items based on user role
    const adminMenuItems = [
        { id: 1, name: 'Dashboard', link: '/admin', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 2, name: 'Merchant', link: '/view-all-merchants', icon: <FontAwesomeIcon icon={faShop} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 3, name: 'Transactions', link: '/admin_ticket', icon: <FontAwesomeIcon icon={faCreditCard} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 4, name: 'Payout', link: '/adminPayout', icon: <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 5, name: 'Profile', link: '/profile', icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> }
    ];

    const agentMenuItems = [
        { id: 1, name: 'Dashboard', link: '/agent', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 2, name: 'Create Vouchers', link: '/create-voucher', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 3, name: 'Create Tickets', link: '/ticket', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 4, name: 'Payout', link: '/payout', icon: <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 5, name: 'Profile', link: '/profile', icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> }
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        setIsAdmin(role === 'Admin');

        if (token) {
            api.defaults.headers.common["Authorization"] = `Token ${token}`;
            fetchTicketTypes();
            if (!isAdmin) {
                fetchAgentTickets();
            }
        }
    }, [isAdmin]);

    const fetchTicketTypes = async () => {
        try {
            const response = await api.get("/api/ticket/ticket-types/list/");
            setTickets(response.data);
        } catch (error) {
            console.error("Error fetching ticket types:", error);
            setErrorMessage("Failed to load ticket types");
        }
    };

    const fetchAgentTickets = async () => {
        try {
            const response = await api.get("/api/ticket/get-agent-tickets/");
            setAgentTickets(response.data.tickets);
        } catch (error) {
            if (error.response) {
                // The request was made, but the server responded with a status code
                console.error("Error response:", error.response.data);
                console.error("Error status:", error.response.status);
                console.error("Error headers:", error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("Error request:", error.request);
            } else {
                // Something happened in setting up the request
                console.error("Error message:", error.message);
            }
            console.error("Error fetching agent tickets:", error);
            setErrorMessage("Failed to load agent tickets");
        }
    };

    const handleCreateTicket = async () => {
        try {
            if (selectedTicket) {
                await api.post("/api/ticket/create-ticket/", {
                    ...ticketFormData,
                    ticket_type: selectedTicket.id,
                });
                alert("Ticket created successfully!");
                setShowCreateTicketPopup(false);
                setTicketFormData({ buyer_name: "", buyer_contact: "", quantity: 1 });
                fetchAgentTickets();
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || "Failed to create ticket");
        }
    };

    const handleCreateTicketType = async () => {
        try {
            await api.post("/api/ticket/ticket-type/", {
                ...typeFormData,
                expiration_date: typeFormData.expiration_date
            });
            alert("Ticket type created successfully!");
            setShowCreateTypePopup(false);
            setTypeFormData({ name: "", unit_price: "", description: "", expiration_date: "", date: "", time: "" });
            fetchTicketTypes();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || "Failed to create ticket type");
        }
    };

    const handleDeleteTicketType = async (id: string) => {
        try {
            await api.delete(`/api/ticket/ticket-type/${id}/delete/`);
            fetchTicketTypes();
        } catch (error) {
            setErrorMessage("Failed to delete ticket type");
        }
    };

    const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "date" || name === "time") {
            const date = name === "date" ? value : typeFormData.date;
            const time = name === "time" ? value : typeFormData.time;
            const isoString = new Date(`${date}T${time}`).toISOString();

            setTypeFormData(prev => ({
                ...prev,
                [name]: value,
                expiration_date: isoString
            }));
        }
    };

    return (
        <div className="flex h-screen">
            <SidebarComponent menu={isAdmin ? adminMenuItems : agentMenuItems} />
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        {isAdmin ? "Ticket Type Management" : "Available Ticket Types"}
                    </h1>
                    {isAdmin && (
                        <button
                            onClick={() => setShowCreateTypePopup(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                        >
                            Create New Ticket Type
                        </button>
                    )}
                </div>

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {errorMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="bg-[#0c1d55] text-white shadow-md p-4 rounded-md"
                            onClick={() => !isAdmin && (setSelectedTicket(ticket), setShowCreateTicketPopup(true))}
                        >
                            <h2 className="text-xl font-semibold">{ticket.name}</h2>
                            <p>{ticket.description}</p>
                            <p>Price: {ticket.unit_price}</p>
                            {isAdmin && (
                                <button
                                    onClick={() => handleDeleteTicketType(ticket.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded mt-2 w-full"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {!isAdmin && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">My Tickets</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {agentTickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="bg-[#0c1d55] text-white shadow-md p-4 rounded-md"
                                >
                                    <h3 className="text-xl font-semibold">
                                        Ticket Code: {ticket.ticket_code}
                                    </h3>
                                    <p>Buyer: {ticket.buyer_name}</p>
                                    <p>Contact: {ticket.buyer_contact}</p>
                                    <p>Created: {new Date(ticket.created_at).toLocaleString()}</p>
                                    <p>Valid Until: {new Date(ticket.valid_until).toLocaleString()}</p>
                                    <p className={ticket.valid ? "text-green-400" : "text-red-400"}>
                                        Status: {ticket.valid ? "Valid" : "Expired"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Create Ticket Popup (Agent Only) */}
                {showCreateTicketPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">
                                Create Ticket for {selectedTicket?.name}
                            </h2>
                            <form onSubmit={(e) => { e.preventDefault(); handleCreateTicket(); }}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Buyer Name
                                    </label>
                                    <input
                                        type="text"
                                        name="buyer_name"
                                        value={ticketFormData.buyer_name}
                                        onChange={(e) => setTicketFormData(prev => ({
                                            ...prev,
                                            buyer_name: e.target.value
                                        }))}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Buyer Contact
                                    </label>
                                    <input
                                        type="text"
                                        name="buyer_contact"
                                        value={ticketFormData.buyer_contact}
                                        onChange={(e) => setTicketFormData(prev => ({
                                            ...prev,
                                            buyer_contact: e.target.value
                                        }))}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={ticketFormData.quantity}
                                        onChange={(e) => setTicketFormData(prev => ({
                                            ...prev,
                                            quantity: parseInt(e.target.value)
                                        }))}
                                        min="1"
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateTicketPopup(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Create Ticket Type Popup (Admin Only) */}
                {showCreateTypePopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Create New Ticket Type</h2>
                            <form onSubmit={(e) => { e.preventDefault(); handleCreateTicketType(); }}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Ticket Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={typeFormData.name}
                                        onChange={(e) => setTypeFormData(prev => ({
                                            ...prev,
                                            name: e.target.value
                                        }))}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Price
                                    </label>
                                    <input
                                        type="text"
                                        name="unit_price"
                                        value={typeFormData.unit_price}
                                        onChange={(e) => setTypeFormData(prev => ({
                                            ...prev,
                                            unit_price: e.target.value
                                        }))}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={typeFormData.description}
                                        onChange={(e) => setTypeFormData(prev => ({
                                            ...prev,
                                            description: e.target.value
                                        }))}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Expiration Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={typeFormData.date}
                                        onChange={handleDateTimeChange}
                                        className="w-full p-2 border rounded mb-2"
                                        required
                                    />
                                    <input
                                        type="time"
                                        name="time"
                                        value={typeFormData.time}
                                        onChange={handleDateTimeChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateTypePopup(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UnifiedTicketPage;