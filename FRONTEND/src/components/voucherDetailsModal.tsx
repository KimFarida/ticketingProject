import React, { useState } from 'react';
import Modal from './modal';
import { VoucherDetail } from '../types/types';

interface VoucherDetailsModalProps {
    isVisible: boolean;
    onClose: () => void;
    voucher: VoucherDetail | null;
    onProcess?: (code: string) => Promise<void>;
    showProcessButton?: boolean;
}

const VoucherDetailsModal: React.FC<VoucherDetailsModalProps> = ({
    isVisible,
    onClose,
    voucher,
    onProcess,
    showProcessButton
}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleProcess = async () => {
        if (!voucher || !onProcess) return;

        setIsProcessing(true);
        try {
            await onProcess(voucher.voucher_code);
            onClose();
        } catch (error) {
            console.error('Error processing voucher:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isVisible || !voucher) return null;

    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Voucher Details</h2>

                <div className="space-y-2">
                    <p><strong>Voucher Code:</strong> {voucher.voucher_code}</p>
                    <p><strong>Amount:</strong> ${voucher.amount}</p>
                    <p><strong>Processed:</strong> {voucher.processed ? "Yes" : "No"}</p>
                    <p><strong>Created At:</strong> {new Date(voucher.created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(voucher.updated_at).toLocaleString()}</p>

                    <div className="mt-4">
                        <h3 className="font-semibold">Owner Details</h3>
                        <p>Name: {voucher.owner.first_name} {voucher.owner.last_name}</p>
                        <p>Email: {voucher.owner.email}</p>
                        <p>Phone: {voucher.owner.phone_number}</p>
                        <p>Gender: {voucher.owner.gender}</p>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-semibold">Seller Details</h3>
                        {voucher.seller ? (
                            <div>
                                <p>Name: {voucher.seller.first_name ? `${voucher.seller.first_name} ${voucher.seller.last_name}` : "ADMIN"}</p>
                                <p>Email: {voucher.seller.email}</p>
                                {voucher.seller.phone_number && <p>Phone: {voucher.seller.phone_number}</p>}
                                {voucher.seller.gender && <p>Gender: {voucher.seller.gender}</p>}
                            </div>
                        ) : (
                            <p>Seller: ADMIN</p>
                        )}
                    </div>

                    {showProcessButton && !voucher.processed && (
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

export default VoucherDetailsModal;