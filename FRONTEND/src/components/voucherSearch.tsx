import React, { useState } from 'react';
import { voucherApi } from '../api/voucherApi';
import {VoucherDetail} from "../types/types.ts";
import VoucherDetailsModal from "./voucherDetailsModal.tsx";

interface VoucherSearchProps {
    role?: string | null;
    onVoucherProcess?: (code: string) => Promise<void>;
}


const VoucherSearch: React.FC<VoucherSearchProps> = ({ role, onVoucherProcess }) => {
    const [voucherCode, setVoucherCode] = useState<string>('');
    const [voucherDetails, setVoucherDetails] = useState<VoucherDetail | null>(null);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!voucherCode.trim()) {
            setError('Please enter a voucher code');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const details = await voucherApi.getVoucherDetails(voucherCode.trim());
            setVoucherDetails(details);
            setModalVisible(true);
        } catch (error) {
            console.error('Error searching voucher:', error);
            setError('Voucher not found. Please check the code and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter voucher code"
                    className="flex-1 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className={`bg-[#000000] hover:bg-gray-700 text-white py-2 px-4 rounded
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && (
                <p className="text-red-500 mt-2 text-sm">{error}</p>
            )}

            {voucherDetails && (
                <VoucherDetailsModal
                    isVisible={isModalVisible}
                    onClose={() => {
                        setModalVisible(false);
                        setVoucherDetails(null);
                        setVoucherCode('');
                    }}
                    voucher={voucherDetails}
                    onProcess={onVoucherProcess}
                    showProcessButton={role === 'Merchant' || role === 'Admin'}
                />
            )}
        </div>
    );
};

export default VoucherSearch;