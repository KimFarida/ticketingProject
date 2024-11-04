import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import SidebarComponent, { menuMerchant } from '../components/sidebar';
import { menuAdmin, menuAgent } from '../components/sidebar';
import { CreateTicketModal } from '../components/createTicketModal';
import { TicketTypeModal } from '../components/ticketTypeModal';
import { TicketTypeCard } from '../components/ticketTypeCard';
import TicketValidator from '../components/ticketValidator';
import TicketCreationModal from "@/components/createdTicketModal.tsx";
import api from '../api/axios';
import {TicketType, Ticket, CreateTicketFormData, TicketTypeFormData, TicketCreationResponse} from '../types/types';

const menuItems = (userRole: string | null) => {
    if (userRole === "Admin") return menuAdmin;
    if (userRole === "Merchant") return menuMerchant;
    return menuAgent;
};

function UnifiedTicketPage() {
    const [tickets, setTickets] = useState<TicketType[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
    const [agentTickets, setAgentTickets] = useState<Ticket[]>([]);
    const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
    const [showTicketTypeModal, setShowTicketTypeModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
    const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
    const [ticketData, setTicketData] = useState<TicketCreationResponse | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    const [ticketFormData, setTicketFormData] = useState<CreateTicketFormData>({
        buyer_name: '',
        buyer_contact: '',
        quantity: 1,
        ticket_type: '',
    });

    const [typeFormData, setTypeFormData] = useState<TicketTypeFormData>({
        name: '',
        unit_price: '',
        description: '',
        expiration_date: '',
        date: '',
        time: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        setRole(role)
        setIsAdmin(role === 'Admin');

        if (token) {
            api.defaults.headers.common['Authorization'] = `Token ${token}`;
            fetchTicketTypes();
            if (role !== 'Merchant') {
                fetchAgentTickets();
            }
        }
    }, []);

    useEffect(() => {
        const filtered = tickets.filter(ticket =>
            ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTickets(filtered);
    }, [searchQuery, tickets]);

    const fetchTicketTypes = async () => {
        try {
            const response = await api.get('/api/ticket/ticket-types/list/');
            setTickets(response.data);
            setFilteredTickets(response.data);
        } catch (error) {
            console.error('Error fetching ticket types:', error);
            setErrorMessage('Failed to load ticket types');
        }
    };

    const fetchAgentTickets = async () => {
        try {
            const response = await api.get('/api/ticket/get-agent-tickets/');
            setAgentTickets(response.data.tickets);
        } catch (error) {
            console.error('Error fetching agent tickets:', error);
            setErrorMessage('Failed to load agent tickets');
        }
    };


    const handleCreateTicket = async () => {
        try {
            if (selectedTicket) {
                const apiPayload = {
                    buyer_name: ticketFormData.buyer_name,
                    buyer_contact: ticketFormData.buyer_contact,
                    quantity: ticketFormData.quantity,
                    ticket_type : selectedTicket.id
                }
                const response = await api.post('/api/ticket/create-ticket/', apiPayload);
                const data: TicketCreationResponse = await response.data

                setShowCreateTicketModal(false);
                setTicketData(data);
                setShowTicketModal(true);

                setTicketFormData({
                    buyer_name: '',
                    buyer_contact: '',
                    quantity: 1,
                    ticket_type: '',
                });
                fetchAgentTickets();
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Failed to create ticket');
        }
    };

    const handleCreateTicketType = async () => {
        const apiPayload = {
            name: typeFormData.name,
            unit_price: typeFormData.unit_price,
            description: typeFormData.description,
            expiration_date: typeFormData.expiration_date,
        };

        try {
            if (isEditing && selectedTicket) {
                await api.put(`/api/ticket/ticket_type/${selectedTicket.id}/`, apiPayload);
            } else {
                await api.post('/api/ticket/ticket-type/', apiPayload);
            }
            setShowTicketTypeModal(false);
            resetTypeFormData();
            fetchTicketTypes();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.error || 'Failed to manage ticket type');
        }
    };

    const handleDeleteTicketType = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this ticket type?')) {
            try {
                await api.delete(`/api/ticket/ticket-type/${id}/delete/`);
                fetchTicketTypes();
            } catch (error) {
                setErrorMessage('Failed to delete ticket type');
            }
        }
    };

    const handleEditTicketType = (ticket: TicketType) => {
        setSelectedTicket(ticket);
        setIsEditing(true);
        const expirationDate = new Date(ticket.expiration_date!);

        setTypeFormData({
            name: ticket.name,
            unit_price: ticket.unit_price!,
            description: ticket.description,
            expiration_date: ticket.expiration_date!,
            date: expirationDate.toISOString().split('T')[0],
            time: expirationDate.toTimeString().slice(0, 5),
        });

        setShowTicketTypeModal(true);
    };

    const resetTypeFormData = () => {
        setTypeFormData({
            name: '',
            unit_price: '',
            description: '',
            expiration_date: '',
            date: '',
            time: '',
        });
        setSelectedTicket(null);
        setIsEditing(false);
    };

    const handleTicketTypeClick = (ticket: TicketType) => {
        if (!isAdmin && new Date(ticket.expiration_date!) > new Date()) {
            setSelectedTicket(ticket);
            setShowCreateTicketModal(true);
        }
    };

    return (
        <div className="flex h-screen">
            <SidebarComponent menu={menuItems(localStorage.getItem('userRole'))} />
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        {isAdmin ? "Ticket Type Management" : "Available Ticket Types"}
                    </h1>
                    {isAdmin && (
                        <button
                            onClick={() => {
                                resetTypeFormData();
                                setShowTicketTypeModal(true);
                            }}
                            className="bg-[#000000] text-white px-4 py-2 rounded"
                        >
                            Create New Ticket Type
                        </button>
                    )}
                      <TicketCreationModal
                        isOpen={showTicketModal}
                        onClose={() => setShowTicketModal(false)}
                        ticketData={ticketData}
                      />

                </div>

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
                        <span>{errorMessage}</span>
                        <button
                            onClick={() => setErrorMessage(null)}
                            className="text-red-700 hover:text-red-900"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search ticket types..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTickets.map((ticket) => (
                        <TicketTypeCard
                            key={ticket.id}
                            ticket={ticket}
                            isAdmin={isAdmin}
                            onEdit={handleEditTicketType}
                            onDelete={handleDeleteTicketType}
                            onClick={handleTicketTypeClick}
                        />
                    ))}
                </div>

                {role != 'Merchant' && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">My Tickets</h2>
                       <TicketValidator/>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {agentTickets.map((ticket) => (
                                <div
                                    key={ticket.ticket_code}
                                    className="bg-[#214F02] text-white shadow-md p-4 rounded-md"
                                >
                                    <h3 className="text-xl font-semibold">
                                        Ticket Code: {ticket.ticket_code}
                                    </h3>
                                    <p>Buyer: {ticket.buyer_name}</p>
                                    <p>Contact: {ticket.buyer_contact}</p>
                                    {/*<p>Type: {ticket.ticket_type.name}</p>*/}
                                    <p>Created: {new Date(ticket.created_at).toLocaleString()}</p>
                                    <p>Valid Until: {new Date(ticket.valid_until).toLocaleString()}</p>
                                    {/*
                                    <p className={ticket.valid ? "text-green-400" : "text-red-400"}>
                                        Status: {ticket.valid ? "Valid" : "Expired"}
                                    </p>
                                    */}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {showCreateTicketModal && (
                    <CreateTicketModal
                        isOpen={showCreateTicketModal}
                        onClose={() => setShowCreateTicketModal(false)}
                        selectedTicket={selectedTicket}
                        formData={ticketFormData}
                        setFormData={setTicketFormData}
                        onSubmit={handleCreateTicket}
                    />
                )}

                {showTicketTypeModal && (
                    <TicketTypeModal
                        isOpen={showTicketTypeModal}
                        onClose={() => {
                            setShowTicketTypeModal(false);
                            resetTypeFormData();
                        }}
                        formData={typeFormData}
                        setFormData={setTypeFormData}
                        onSubmit={handleCreateTicketType}
                        isEditing={isEditing}
                        ticketType={selectedTicket}
                    />
                )}
            </div>
        </div>
    );
}

export default UnifiedTicketPage;