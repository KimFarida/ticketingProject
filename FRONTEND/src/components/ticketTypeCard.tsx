import React from 'react';
import { TicketType } from '../types/types';

interface TicketTypeCardProps {
    ticket: TicketType;
    isAdmin: boolean;
    onEdit?: (ticket: TicketType) => void;
    onDelete?: (id: string) => void;
    onClick?: (ticket: TicketType) => void;
}

export const TicketTypeCard: React.FC<TicketTypeCardProps> = ({
    ticket,
    isAdmin,
    onEdit,
    onDelete,
    onClick,
}) => {
    const isExpired = new Date(ticket.expiration_date) < new Date();

    return (
        <div
            className={`bg-[#0c1d55] text-white shadow-md p-4 rounded-md ${
                !isAdmin && !isExpired ? 'cursor-pointer' : ''
            }`}
            onClick={() => !isAdmin && !isExpired && onClick?.(ticket)}
        >
            <h2 className="text-xl font-semibold">{ticket.name}</h2>
            <p>{ticket.description}</p>
            <p>Price: {ticket.unit_price}</p>
            <p className={isExpired ? 'text-red-400' : 'text-green-400'}>
                {isExpired ? 'Expired' : 'Valid'}
            </p>
            {isAdmin && (
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => onEdit?.(ticket)}
                        className="bg-blue-600 text-white px-3 py-1 rounded flex-1"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete?.(ticket.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded flex-1"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};