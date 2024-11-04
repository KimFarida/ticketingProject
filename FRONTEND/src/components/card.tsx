import React from 'react';

interface CardProps {
  totalCount: number;
  title: string;
  onClick: () => void;
  text: string;
}

const Card: React.FC<CardProps> = ({ totalCount, title, onClick, text }) => {
  return (
    <div className="bg-[#214F02] text-white text-sm  text-right rounded-lg p-5 w-full sm:w-60 text-center shadow-lg">
      <h3 className="sm:text-sm" >{totalCount}</h3>
      <p className="mt-2 ">{title}</p>
      <button
        className="bg-[#000000] text-white mt-4 py-1 px-2 rounded-xl hover:bg-gray-400 transition text-sm sm:text-base"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default Card;
