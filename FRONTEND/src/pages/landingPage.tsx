import { useState } from 'react';
import { Link } from 'react-router-dom';
import './signUp.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faTimes} from '@fortawesome/free-solid-svg-icons'
import petImage from '../images/pet.jpg'
import TextCarousel from '../components/textCarousel';
import ScrollAnimation from '../components/logoAnimation';



function LandingPage(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const onToggleMenu = () => {
        console.log('Menu toggled');
        // Toggle the menu state
        setIsMenuOpen(!isMenuOpen);
    };

    return(
        <>
            <header className="bg-gray-500">
                <nav className="flex justify-between items-center w-[92%]  mx-auto">
                    <div>
                        <h1 className="w-16">X CASH</h1>
                    </div>
                    <div className={`md:static absolute md:min-h-fit min-h-[60vh] left-0 ${ isMenuOpen ? 'top-[9%] w-full bg-gray-500 z-50' : 'top-[-100%] w-full'} md:w-auto w-full flex items-center px-5`}>
                        <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 text-white">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Home</a></li>
                        </ul>
                        
                    </div>
                    <div className='flex items-center gap-3 py-2'>
                        <Link to="/signin">
                            <button>LOG IN</button>
                        </Link>
                        <button><Link to="/signup" className="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]"> Sign Up</Link></button>
                        <FontAwesomeIcon icon= {isMenuOpen ? faTimes : faBars} className='text-3xl cursor-pointer md:hidden' onClick={onToggleMenu} />
                    </div>
                </nav>

                {/* HERO SECTION */}
                <div className="m-20 flex flex-col justify-center items-center text-center px-4 ">
                    <div className="relative z-10 text-white px-4">
                        {/* Main Heading */}
                        <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold mb-4 max-w-full overflow-hidden ">
                            Bringing you closer to all the events you love
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base md:text-lg lg:text-xl mb-8 mt-8 max-w-full overflow-hidden">
                            Find events and make memories that last a lifetime. Your next great experience is just a click away.
                        </p>

                        {/* CTA Button */}
                        <button className="m-4 bg-orange-500 text-white py-3 px-8 rounded-full hover:bg-orange-600 transition duration-300">
                        Discover events
                        </button>
                    </div>    
                </div>
            </header> 

            {/* EVENTS SECTION */}
            <div className="m-15 container mx-auto py-10 flex flex-col justify-center items-center text-center px-4">
                <div className="relative z-10 px-4">
                    {/* Main Heading */}
                    <h2 className="text-2xl md:text-3xl lg:text-3xl italic mb-4 max-w-full">
                    There is something here for everyone
                    </h2>

                    {/* Subtitle */}
                    <h6 className="text-sm text-gray-700 italic md:text-xl lg:text-xl mb-8 mt-8 max-w-full overflow-hidden">
                    Find events and make memories that last a lifetime. Your next great experience is just a click away.
                    </h6>

                    <div className="flex flex-col md:flex-row items-center justify-between m-10">  
                        <div className="md:w-1/2 text-left p-4">
                            <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                            Planning an event? Selling tickets has never been easier
                            </h4>

                            <p className="text-base md:text-lg lg:text-xl mb-8">
                                Sell tickets online, promote your event, and  manage your sales all in one place. 
                            </p>
                            <Link to="/signin">
                                <button className="bg-orange-500 text-white py-2 px-4 sm:py-3 sm:px-8 rounded-full hover:bg-orange-600 transition duration-300">
                                Get started today!
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
                    <h2>X cash is an event ticketing platform for memorable experiences in Africa</h2>
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