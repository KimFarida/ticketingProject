import React from 'react';

interface VoucherCreationFormProps {
    amount: string;
    onAmountChange: (amount: string) => void;
    onCreateVoucher: () => void;
    selectedMerchantId: string | null;
    role: string | null;
}

const VoucherCreationForm: React.FC<VoucherCreationFormProps> = ({
    amount,
    onAmountChange,
    onCreateVoucher,
    selectedMerchantId,
    role
}) => {
    if (!selectedMerchantId && role === "Agent" || role === "Admin") return null;

    return (
        <div className="mt-8 p-4 bg-gray-700 text-white rounded-lg">
            <h2 className="text-xl mb-2">Create Voucher</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-2 mb-2 text-black rounded"
            />
            <button
                onClick={onCreateVoucher}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
                Create Voucher
            </button>
        </div>
    );
};

export default VoucherCreationForm;