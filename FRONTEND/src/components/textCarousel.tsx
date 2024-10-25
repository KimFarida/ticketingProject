import { useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faGreaterThan, faLessThan } from '@fortawesome/free-solid-svg-icons';

const texts = [
    "Playing on Profit play has really been great because games and checki-ins have become the easiest parts of betting",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
];

function TextCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        // Increment index, reset if it exceeds the array length
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    };

    return (
        <div>
            <div className='text-center'>
                <h2 className='text-2xl font-semibold
                '>Real people, real reviews!</h2>
            </div>
            <div className="text-center m-10">
                <p className="text-lg mb-12 text-grey-700 italic mb-4">{texts[currentIndex]}</p>
                <div className="flex justify-center justify-between">
                    <button 
                        onClick={handleNext} 
                        className="bg-gray-200 text-2xl text-gray-600 py-2 px-3 rounded-full border border-gray-400 hover:bg-gray-300 transition duration-300 flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faLessThan} />
                    </button>
                    <button 
                        onClick={handleNext} 
                        className="bg-gray-200 text-2xl text-gray-600 py-2 px-3 rounded-full border border-gray-400 hover:bg-gray-300 transition duration-300 flex items-center justify-center"
                    >
                        <FontAwesomeIcon icon={faGreaterThan} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TextCarousel;
