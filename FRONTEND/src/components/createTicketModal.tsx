import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { CreateTicketFormData, TicketType } from '../types/types';

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTicket: TicketType | null;
    formData: CreateTicketFormData;
    setFormData: React.Dispatch<React.SetStateAction<CreateTicketFormData>>;
    onSubmit: () => Promise<void>;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
    isOpen,
    onClose,
    selectedTicket,
    formData,
    setFormData,
    onSubmit,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">
                        Create Ticket for {selectedTicket?.name}
                    </h2>
                    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Buyer Name
                            </label>
                            <input
                                type="text"
                                value={formData.buyer_name}
                                onChange={(e) => setFormData(prev => ({
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
                                value={formData.buyer_contact}
                                onChange={(e) => setFormData(prev => ({
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
                                value={formData.quantity}
                                onChange={(e) => setFormData(prev => ({
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
                                onClick={onClose}
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
        </Dialog>
    );
};
