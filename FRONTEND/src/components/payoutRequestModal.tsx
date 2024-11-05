import React from 'react';
import Modal from './modal';
import { PayoutResponse } from '../types/types';


interface PayoutRequestModalProps {
    isVisible: boolean;
    onClose: () => void;
    payoutRequest: PayoutResponse | null;
}

const PayoutRequestModal: React.FC<PayoutRequestModalProps> = ({
    isVisible,
    onClose,
    payoutRequest,
}) => {
    if (!isVisible || !payoutRequest) return null;

    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div className="p-6">
                <h2 className='text-xl font-semibold mb-4'> Payout Details</h2>

                <div className="space-y-2">
                    <p><strong>Payment ID:</strong> {payoutRequest.payment_id}</p>
                    <p><strong>Amount Requested:</strong> &#8358;{payoutRequest.payout_details.amount}</p>
                    <p><strong>Status:</strong> {payoutRequest.status}</p>
                    <p><strong>Requested At:</strong> {new Date(payoutRequest.requested_at).toLocaleString()}</p>

                    <h3 className="text-lg font-semibold ">Salary Details</h3>
                    <p><strong>Salary:</strong> &#8358;{payoutRequest.payout_details.salary}</p>
                    <p><strong>Tickets Sold:</strong> {payoutRequest.payout_details.tickets_sold}</p>
                    <p><strong>Monthly Ticket Quota:</strong> {payoutRequest.payout_details.monthly_quota}</p>
                    <em className="mt-4 text-sm">You get full salary on meeting the ticket quota, 20% of your salary if you meet half the ticket quota and no salary otherwise.</em>
                </div>

            </div>
        </Modal>
    )
}

export default PayoutRequestModal;