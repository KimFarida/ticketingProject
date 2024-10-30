import React, { useState } from 'react';
import api from '../api/axios';
import {PayoutDetails, PayoutResponse} from "../types/types.ts";
import PayoutDetailsModal from "./payoutDetailsModal";

interface PayOutSearchProps {
    role?: string | null;
    onPayOutProcess?: (code: string) => Promise<void>;
}


const PayOutSearch: React.FC<PayOutSearchProps> = ({ role, onPayOutProcess }) => {
    const [payoutId, setPayoutId] = useState<string>('');
    const [payoutDetails, setPayoutDetails] = useState<PayoutDetails | null>(null);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!payoutId.trim()) {
            setError('Please enter a PAYMENT ID');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.get<PayoutResponse>(`/api/payout/get_payout_by_id/${payoutId.trim()}`);
            setPayoutDetails(response.data.data);
            setModalVisible(true);
        } catch (error) {
            console.error('Error searching payout request:', error);
            setError('Request not found. Please check the code and try again.');
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
                    value={payoutId}
                    onChange={(e) => setPayoutId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a payment ID"
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

            {payoutDetails && (
                <PayoutDetailsModal
                    isVisible={isModalVisible}
                    onClose={() => {
                        setModalVisible(false);
                        setPayoutDetails(null);
                        setPayoutId('');
                    }}
                    payoutRequest={payoutDetails}
                    onProcess={onPayOutProcess}
                    showProcessButton={role === 'Admin'}
                />
            )}
        </div>
    );
};

export default PayOutSearch;