import React, { useState } from 'react';
import Modal from './modal';
import { PayoutDetails } from '../types/types';

interface PayOutDetailsModalProps {
    isVisible: boolean;
    onClose: () => void;
    payoutRequest : PayoutDetails | null;
    onProcess?: (code: string, newStatus:string) => Promise<void>;
    showProcessButton?: boolean;
}

const PayOutDetailsModal: React.FC<PayOutDetailsModalProps> = ({
    isVisible,
    onClose,
    payoutRequest,
    onProcess,
    showProcessButton
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showStatusOptions, setShowStatusOptions] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(payoutRequest?.status || "");

    const handleProcess = async () => {
        if (!payoutRequest || !onProcess || !selectedStatus) return;

        setIsProcessing(true);
        try {
            await onProcess(payoutRequest.payment_id, selectedStatus);
            setSelectedStatus(selectedStatus);
            onClose();
        } catch (error) {
            console.error('Error processing payout request:', error);
        } finally {
            setIsProcessing(false);
            setShowStatusOptions(false);
        }
    };

    if (!isVisible || !payoutRequest) return null;

return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payout Details</h2>

                <div className="space-y-2">
                    <p><strong>Payment ID:</strong> {payoutRequest.payment_id}</p>
                    <p><strong>Amount:</strong> ${payoutRequest.amount}</p>
                    <p><strong>Status:</strong> {selectedStatus}</p>
                    <p><strong>Requested At:</strong> {new Date(payoutRequest.requested_at).toLocaleString()}</p>

                    <div className="mt-4">
                        <h3 className="font-semibold">User Details</h3>
                        <p>Name: {payoutRequest.user.first_name} {payoutRequest.user.last_name}</p>
                        <p>Email: {payoutRequest.user.email}</p>
                        <p>Phone: {payoutRequest.user.phone_number}</p>
                        <p>Gender: {payoutRequest.user.role}</p>
                    </div>

                    {showProcessButton && (
                        <>
                            <button
                                onClick={() => setShowStatusOptions(!showStatusOptions)}
                                disabled={isProcessing}
                                className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:bg-blue-300"
                            >
                                {isProcessing ? 'Processing...' : 'Process Payout'}
                            </button>

                            {showStatusOptions && (
                                <div className="mt-4">
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full p-2 border rounded bg-white"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>

                                    <button
                                        onClick={handleProcess}
                                        disabled={isProcessing}
                                        className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded disabled:bg-green-300"
                                    >
                                        Confirm Status Change
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default PayOutDetailsModal;