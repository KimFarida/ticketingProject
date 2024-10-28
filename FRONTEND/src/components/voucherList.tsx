import React from 'react';
import { FetchedVoucher } from '../types/types';
import VoucherCard from './voucherCard';

interface VoucherListProps {
    title: string;
    vouchers: FetchedVoucher[];
    loading: boolean;
    error: string | null;
    onProcess?: (code: string) => void;
    onViewDetails: (code: string) => void;
    isLoadingDetails: boolean;
    showProcessButton?: boolean;
    role: string | null;
    allowedRoles: string[];
}

const VoucherList: React.FC<VoucherListProps> = ({
    title,
    vouchers,
    loading,
    error,
    onProcess,
    onViewDetails,
    isLoadingDetails,
    showProcessButton = false,
    role,
    allowedRoles
}) => {
    if (!allowedRoles.includes(role || '')) {
        return <p className="mt-8 text-gray-500">You do not have permission to view this section.</p>;
    }

    if (loading) return <p>Loading vouchers...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="mt-12">
            <h1>{title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vouchers.map(voucher => (
                    <VoucherCard
                        key={voucher.id}
                        voucher={voucher}
                        onProcess={onProcess}
                        onViewDetails={onViewDetails}
                        isLoadingDetails={isLoadingDetails}
                        showProcessButton={showProcessButton}
                    />
                ))}
            </div>
        </div>
    );
};

export default VoucherList;