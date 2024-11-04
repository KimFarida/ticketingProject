import { ReactNode } from 'react';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> =  ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-700 text-lg p-2 rounded-md shadow-md transition duration-200"
                >
                    &times;
                </button>
                {children}
            </div>

        </div>
    );
};

export default Modal;