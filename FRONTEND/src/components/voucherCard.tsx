import React from 'react';
import { FetchedVoucher } from '../types/types';

interface VoucherCardProps {
    voucher: FetchedVoucher;
    onProcess?: (code: string) => void;
    onViewDetails: (code: string) => void;
    isLoadingDetails: boolean;
    showProcessButton?: boolean;
}

const VoucherCard: React.FC<VoucherCardProps> = ({
    voucher,
    onProcess,
    onViewDetails,
    isLoadingDetails,
    showProcessButton = false
}) => {
    return (
        <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md">
            <h3>Voucher Code: {voucher.voucher_code}</h3>
            <p>Amount: ${voucher.amount}</p>
            <p>Created At: {new Date(voucher.created_at).toLocaleString()}</p>
            <p>Processed: {voucher.processed ? "Yes" : "No"}</p>

            {voucher.owner && (
                <div className="mt-2">
                    <h4 className="font-semibold">Owner Details:</h4>
                    <p>Name: {voucher.owner.first_name} {voucher.owner.last_name}</p>
                </div>
            )}

            <div className="mt-4 space-x-2">
                {showProcessButton && !voucher.processed && onProcess && (
                    <button
                        onClick={() => onProcess(voucher.voucher_code)}
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                        Process Voucher
                    </button>
                )}

                <button
                    onClick={() => onViewDetails(voucher.voucher_code)}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                    {isLoadingDetails ? "Loading..." : "View Details"}
                </button>
            </div>
        </div>
    );
};

export default VoucherCard;