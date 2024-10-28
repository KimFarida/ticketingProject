import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { TicketTypeFormData, TicketType } from '../types/types';

interface TicketTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: TicketTypeFormData;
    setFormData: React.Dispatch<React.SetStateAction<TicketTypeFormData>>;
    onSubmit: () => Promise<void>;
    isEditing?: boolean;
    ticketType?: TicketType | null;
}

export const TicketTypeModal: React.FC<TicketTypeModalProps> = ({
    isOpen,
    onClose,
    formData,
    setFormData,
    onSubmit,
    isEditing = false,
    ticketType,
}) => {
    const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const updatedFormData = { ...formData, [name]: value };

        // Check if both date and time are set
        if (updatedFormData.date && updatedFormData.time) {
            // Construct a combined date-time string
            const combinedDateTime = new Date(`${updatedFormData.date}T${updatedFormData.time}`);

            // Only set expiration_date if we have a valid Date object
            if (!isNaN(combinedDateTime.getTime())) {
                updatedFormData.expiration_date = combinedDateTime.toISOString();
            }
        }

        setFormData(updatedFormData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">
                        {isEditing ? 'Edit Ticket Type' : 'Create New Ticket Type'}
                    </h2>
                    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Ticket Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({
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
                                value={formData.unit_price}
                                onChange={(e) => setFormData(prev => ({
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
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({
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
                                value={formData.date}
                                onChange={handleDateTimeChange}
                                className="w-full p-2 border rounded mb-2"
                                required
                            />
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleDateTimeChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                {isEditing ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    );
};