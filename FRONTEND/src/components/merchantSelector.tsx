import React from 'react';
import { Merchant } from '../types/types';

interface MerchantSelectorProps {
    merchants: Merchant[];
    selectedMerchantId: string | null;
    onSelectMerchant: (id: string) => void;
    loading: boolean;
    error: string | null;
    role: string | null;
}

const MerchantSelector: React.FC<MerchantSelectorProps> = ({
    merchants,
    selectedMerchantId,
    onSelectMerchant,
    loading,
    error,
    role
}) => {
    if (loading) return <p>Loading merchants...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (role !== "Agent") return <p className="text-gray-500">Only agents can select merchants to buy from.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {merchants.map((merchant) => (
                <div
                    key={merchant.id}
                    onClick={() => onSelectMerchant(merchant.user.id)}
                    className={`p-6 ${selectedMerchantId === merchant.user.id ? "bg-[#214F02]" : "bg-[#214F02]"}
                        text-white rounded-lg shadow-md cursor-pointer`}
                >
                    <h2 className="text-xl font-bold">
                        {merchant.user.first_name} {merchant.user.last_name}
                    </h2>
                    <p>Email: {merchant.user.email}</p>
                    <p>Phone: {merchant.user.phone_number}</p>
                    <p>Click to select this merchant</p>
                </div>
            ))}
        </div>
    );
};

export default MerchantSelector;