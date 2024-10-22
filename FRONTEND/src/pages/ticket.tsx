import { useEffect, useState } from "react";
import axios from "axios";
import SidebarComponent from "../components/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faHouse, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";

interface Ticket {
    id: string;
    name: string;
    unit_price: string;
    description: string;
    expiration_date: string;
}

function TicketPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [formData, setFormData] = useState({
        buyer_name: "",
        buyer_contact: "",
        quantity: 1,
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const menuItems = [
        { id: 1, name: "Dashboard", link: "/agent", icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 2, name: "Create Vouchers", link: "/create-voucher", icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 3, name: "Profits", link: "/profits", icon: <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 4, name: "Profile", link: "/profile", icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Token ${token}`;
            fetchTickets();
        }
    }, []);

    const fetchTickets = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Token ${token}`;
            const response = await axios.get("/api/ticket/ticket-types/list/");
            setTickets(response.data);
        }
    };

    const handleCreateTicket = async () => {
        try {
            if (selectedTicket) {
                const token = localStorage.getItem("token");
                axios.defaults.headers.common["Authorization"] = `Token ${token}`;

                console.log("Request data:", {
                    ...formData,
                    ticket_type: selectedTicket.id,
                });

                await axios.post("/api/ticket/create-ticket/", {
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

    return (
        <div className="flex h-screen">
            <SidebarComponent menu={menuItems} />
            <div className="flex-1 p-4">
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
            </div>
        </div>
    );
}

export default TicketPage;
