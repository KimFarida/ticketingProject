import React from 'react';

interface StatusToggleProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const StatusToggle: React.FC<StatusToggleProps> = ({ selectedStatus, onStatusChange }) => {
  const statuses = ["pending", "approved", "rejected"];

  return (
    <div className="flex space-x-4 mb-4">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onStatusChange(status)}
          className={`px-4 py-2 rounded-md ${
            selectedStatus === status ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default StatusToggle;