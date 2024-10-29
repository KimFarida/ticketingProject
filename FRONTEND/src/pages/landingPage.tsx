import { useState } from 'react';
import { Link } from 'react-router-dom';
import './signUp.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faTimes} from '@fortawesome/free-solid-svg-icons'
import petImage from '../images/profit play.png'
import AppLogo from '../images/profitplaylogo.png'
import TextCarousel from '../components/textCarousel';
import ScrollAnimation from '../components/logoAnimation';
import TicketValidator from '../components/ticketValidator'



function LandingPage(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const onToggleMenu = () => {
        console.log('Menu toggled');
        
        setIsMenuOpen(!isMenuOpen);
    };

    return(
        <>
            <header className="bg-[#000000]">
                <nav className="flex justify-between items-center w-[92%]  mx-auto">
                    <div>
                    <img src={AppLogo} alt="App Logo" className="w-24 " />
                    </div>
                    <div className={`md:static absolute md:min-h-fit min-h-[60vh] left-0 ${ isMenuOpen ? 'top-[9%] w-full bg-gray-500 z-50' : 'top-[-100%] w-full'} md:w-auto w-full flex items-center px-5`}>
                        <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 text-white">
                            <li><a href="#">Home</a></li>
                            {/*<li><a href="#"></a>Become an Agent</li>*/}
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">About Us</a></li>
                        </ul>
                        
                    </div>
                    <div className='flex items-center gap-3 py-2'>
                        <Link to="/signin" className='border-2 px-2 border-[#6AE803] ml-2 rounded text-white whitespace-nowrap'>
                            <button>LOG IN</button>
                        </Link>
                        <button><Link to="/signup" className="bg-[#6AE803] text-white px-5 py-2 rounded-full hover:bg-[#58D106] whitespace-nowrap"> Sign Up</Link></button>
                        <FontAwesomeIcon icon= {isMenuOpen ? faTimes : faBars} className='text-3xl text-white cursor-pointer md:hidden' onClick={onToggleMenu} />
                    </div>
                </nav>

                {/* HERO SECTION */}
                <div className="m-20 flex flex-col justify-center items-center text-center px-4 ">
                    <div className="relative z-10 text-white px-4">

                        <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold mb-4 max-w-full overflow-hidden ">
                            Where Luck meets rewards
                        </h1>


                        <p className="text-base md:text-lg lg:text-xl mb-8 mt-8 max-w-full overflow-hidden">
                            Unlock the reward of luck
                        </p>


                        <button
                            className="m-4 bg-[#607714] text-white py-2 px-4 rounded-md md:py-3 md:px-8 md:rounded-full transition duration-300 whitespace-nowrap">
                            Get Lucky, Get Reward!
                        </button>
                        {(TicketValidator())}
                    </div>
                </div>
            </header>

            {/* EVENTS SECTION */}
            <div className="m-15 container mx-auto py-10 flex flex-col justify-center items-center text-center px-4">
                <div className="relative z-10 px-4">
                    
                    <h2 className="text-2xl md:text-3xl lg:text-3xl italic mb-4 max-w-full">
                    There is something here for everyone
                    </h2>

                    
                    <h6 className="text-sm text-gray-700 italic md:text-xl lg:text-xl mb-8 mt-8 max-w-full overflow-hidden">
                        Play with purpose, win with passion
                    </h6>

                    <div className="flex flex-col md:flex-row items-center justify-between m-10">  
                        <div className="md:w-1/2 text-left p-4">
                            <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                            Immerse yourself in exciting gameplay, expertly crafted for ultimate enjoyment.
                            </h4>

                            <p className="text-base md:text-lg lg:text-xl mb-8">
                                Experience thrilling games, expertly designed for maximum reward
                            </p>
                            <Link to="/signup">
                                <button className="bg-[#607714] text-white py-2 px-4 sm:py-3 sm:px-8 rounded-full hover:bg-orange-600 transition duration-300">
                                Join the Profit Play family!
                                </button>
                            </Link>
                            
                        </div>
                        <div className="md:w-1/2 flex justify-center md:justify-end mt-4 md:mt-0 p-4">
                                <img src={petImage} alt="Description" className="w-full h-auto rounded-lg" />
                        </div>
                    </div>

                </div>
            </div>
            <TextCarousel/>
            <ScrollAnimation/>

            {/* FOOTER */}
            
            <footer className="mt-20 text-gray-700 m-2">
                <div className="">
                    <h2>Profit Play is an event ticketing platform for memorable experiences in Africa</h2>
                </div>
                <div className="md:w-1/2 text-left p-4">
                    <div className="flex justify-content justify-between ml-10 mr-10">

                        <div>
                            <p>Company</p>
                            <ul className="text-sm italic">
                                <li>About Us</li>
                                <li>How  it works</li>
                                <li>Blog</li>
                            </ul>
                        </div>
                        <div>
                            <p>Follow Us</p>
                            <ul  className="text-sm italic">
                                <li>Facebook</li>
                                <li>X(Twitter)</li>
                                <li>Instagram</li>
                                <li>Tiktok</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
            
        </>
    )
}


export default LandingPage;