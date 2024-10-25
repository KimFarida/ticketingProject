import { useEffect, useState } from "react";
import SidebarComponent from "../components/sidebar";
import { faHouse, faShop, faCreditCard, faChartLine, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

interface Ticket {
    id: string;
    name: string;
    unit_price: string;
    description: string;
    expiration_date: string;
}

export function AdminTicketPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        unit_price: "",
        description: "",
        expiration_date: "",
        date: "",
        time: ""
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Token ${token}`;
            fetchTickets();
        }
        console.log("Tickets state updated:", tickets);
    }, []);

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                axios.defaults.headers.common["Authorization"] = `Token ${token}`;
                const response = await axios.get("/api/ticket/ticket-types/list/");
                setTickets(response.data);
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    const handleCreateTicketType = async () => {
        try {
            const token = localStorage.getItem("token");
            axios.defaults.headers.common["Authorization"] = `Token ${token}`;

            console.log("Request data:", {
                ...formData
            });

            await axios.post("/api/ticket/ticket-type/", {
                ...formData,
                expiration_date: formData.expiration_date
            });
            alert("Ticket created successfully!");
            setFormData({ name: "", unit_price: "", description: "", expiration_date: "", date: "", time: "" });
            fetchTickets(); // Fetch tickets again to update the list
        } catch (error: any) {
            console.log("Error creating ticket:", error.response?.data || error.message);
            setErrorMessage(error.response?.data?.error || "Please check your input and try again.");
        }
    };

    // Handle changes for both date and time inputs
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        const time = formData.time || "00:00";
        updateExpirationDate(date, time);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = e.target.value;
        const date = formData.date || new Date().toISOString().split("T")[0];
        updateExpirationDate(date, time);
    };

    const updateExpirationDate = (date: string, time: string) => {
        const isoString = new Date(`${date}T${time}`).toISOString();
        setFormData({
            ...formData,
            expiration_date: isoString,
            date,
            time
        });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleClick = () => {
        setShowPopup(true);
    };

    const menuItems = [
        { id: 1, name: 'Dashboard', link: '/admin', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 2, name: 'Merchant', link: '/view-all-merchants', icon: <FontAwesomeIcon icon={faShop} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 3, name: 'Transactions', link: '/admin_ticket', icon: <FontAwesomeIcon icon={faCreditCard} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 4, name: 'Payout', link: '/adminPayout', icon: <FontAwesomeIcon icon={faChartLine} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 5, name: 'Profile', link: '/profile', icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> }
    ];

    async function deleteTicket(id: string) {
        setErrorMessage(null);
        
        try {
          await axios.delete(`/api/ticket/ticket-type/${id}/delete/`);
          fetchTickets();
        } catch (err) {
          console.error(err);
          setErrorMessage("Failed to process the payment. Please try again.");
        } 
    }

    return (
        <div className="flex">
            <SidebarComponent menu={menuItems} />
            <div className="flex-1 p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="bg-[#0c1d55] shadow-md p-4 rounded-md cursor-pointer"
                        >
                            <h2 className="text-xl font-semibold">{ticket.name}</h2>
                            <p>{ticket.description}</p>
                            <p>Price: {ticket.unit_price}</p>
                            <button
                                onClick={() => deleteTicket(ticket.id)}
                                className="bg-blue-500 text-white text-sm px-2 py-1 rounded-md mt-2 hover:bg-blue-600 w-full sm:w-auto"
                            >
                                Delete Ticket Type
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <button
                        onClick={handleClick}
                        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                    >
                        Create new Ticket Type
                    </button>
                </div>
            </div>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                        <h2 className="text-2xl font-bold mb-4">Create Ticket Type</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateTicketType();
                        }}>
                             <div className="mb-4">
                                <label className="block text-sm font-medium">Ticket Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Ticket Price</label>
                                <input
                                    type="text"
                                    name="unit_price"
                                    value={formData.unit_price}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Expiration Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleDateChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleTimeChange}
                                    className="w-full p-2 border border-gray-300 rounded mt-2"
                                    required
                                />
                            </div>
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
                                Create
                            </button>
                            <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminTicketPage;
