import { ArrowLeft } from 'lucide-react';

const BackButton = ({ show = true }) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className={`
        flex items-center gap-x-4 
        px-6 py-3 w-full
        text-gray-300 
        hover:bg-white hover:text-black 
        rounded-md
        transition-colors duration-200
        ${!show ? 'justify-center' : ''}
      `}
    >
      <ArrowLeft className="w-5 h-5" />
      {show && <span>Back</span>}
    </button>
  );
};

export default BackButton;