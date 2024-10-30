import React, { useState } from 'react';
import Modal from './modal';
import { PayoutDetails } from '../types/types';

interface PayOutDetailsModalProps {
    isVisible: boolean;
    onClose: () => void;
    payoutRequest : PayoutDetails | null;
    onProcess?: (code: string) => Promise<void>;
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

    const handleProcess = async () => {
        if (!payoutRequest || !onProcess) return;

        setIsProcessing(true);
        try {
            await onProcess(payoutRequest.payment_id);
            onClose();
        } catch (error) {
            console.error('Error processing payout request:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    console.log('isVisible:', isVisible, 'payoutRequest:', payoutRequest);

    if (!isVisible || !payoutRequest) return null;

    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Voucher Details</h2>

                <div className="space-y-2">
                    <p><strong>Payment ID:</strong> {payoutRequest.payment_id}</p>
                    <p><strong>Amount:</strong> ${payoutRequest.amount}</p>
                    <p><strong>Status</strong> {payoutRequest.status}</p>
                    <p><strong>Requested At:</strong> {new Date(payoutRequest.requested_at).toLocaleString()}</p>
                    {/*<p><strong>Updated At:</strong> {new Date(payoutRequest.updated_at).toLocaleString()}</p>*/}

                    <div className="mt-4">
                        <h3 className="font-semibold">User Details</h3>
                        <p>Name: {payoutRequest.user.first_name} {payoutRequest.user.last_name}</p>
                        <p>Email: {payoutRequest.user.email}</p>
                        <p>Phone: {payoutRequest.user.phone_number}</p>
                        <p>Gender: {payoutRequest.user.role}</p>
                    </div>


                    {showProcessButton && payoutRequest.status !== 'approved' && (
                        <button
                            onClick={handleProcess}
                            disabled={isProcessing}
                            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:bg-blue-300"
                        >
                            {isProcessing ? 'Processing...' : 'Process Voucher'}
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default PayOutDetailsModal;