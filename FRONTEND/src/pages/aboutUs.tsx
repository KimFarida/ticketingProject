import { useState } from 'react';
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faTimes, faBriefcase, faChartLine, faBullseye, faCreditCard} from '@fortawesome/free-solid-svg-icons'
import AppLogo from '../images/profitplaylogo.png'
import Image from '../images/img.png'

function AboutUs(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const onToggleMenu = () => {
        console.log('Menu toggled');
        
        setIsMenuOpen(!isMenuOpen);
    };
    return (
        <>
            <div className='bg-[#000000]'>
                <nav className="flex justify-between items-center w-[92%] mx-auto">
                        <div>
                        <img src={AppLogo} alt="App Logo" className="w-24 " />
                        </div>
                        <div className={`md:static absolute md:min-h-fit min-h-[60vh] left-0 ${ isMenuOpen ? 'top-[9%] w-full bg-[#000000] z-50' : 'top-[-100%] w-full'} md:w-auto w-full flex items-center px-5`}>
                            <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 text-white">
                                <li><Link to='/'><a>Home</a></Link></li>
                                {/*<li><a href="#"></a>Become an Agent</li>*/}
                                <li><a href="#">Contact Us</a></li>
                                <li><Link to='/about-us'><a>About Us</a></Link></li>
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
                    <div className="flex flex-col md:flex-row items-center justify-between m-10 text-white">
                        <div className="md:w-1/2 text-left p-4">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
                                --About Us--
                            </h2>
                            <p className="text-base md:text-lg lg:text-xl mb-8">About Profit Play Profit Play, subscription funding has introduced a new construct to the way that people and businesses control finance. Our unique model merges domain proficiency, state of the art technology and customisable delivery to ensure maximum financial outcome.</p>
                        </div>
                        <div className="md:w-1/2 flex justify-center md:justify-end mt-4 md:mt-0 p-4">
                                <img src={Image} alt="Description" className="w-full h-auto rounded-lg" />
                        </div>
                        
                    </div>
            </div>
            <div className='mb-4'>
                <div className="flex flex-col justify-center items-center">
                    <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl mb-4">--Our Mission--</h1>
                    <p className="md:text-sm lg:text-lg mb-4">
                    The primary goal of Profit Play is to assist our customers to attain a billion-dollar revenue by providing them with the following services:
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6 max-w-screen-md mx-auto">
                    <div className="border rounded-lg p-6 shadow-custom-lg flex items-start space-x-4  m-2">
                    <div>
                        <FontAwesomeIcon icon={faBriefcase} className='text-2xl'/>
                        <h3 className="font-bold text-lg">Professional Advice</h3>
                        <p className="text-sm text-gray-600">Our experts provide personalized advice to help you make informed business decisions.</p>
                    </div>
                    </div>

                    <div className="border rounded-lg p-6 shadow-custom-lg flex items-start space-x-4 m-2">
                    <div>
                        <FontAwesomeIcon icon={faChartLine} className='text-2xl'/>
                        <h3 className="font-bold text-lg">Analytics</h3>
                        <p className="text-sm text-gray-600">Gain insights from data analytics to optimize your strategies and maximize profits.</p>
                    </div>
                    </div>

                    <div className="border rounded-lg p-6 shadow-custom-lg flex items-start space-x-4 m-2">
                    <div>
                        <FontAwesomeIcon icon={faBullseye} className='text-2xl'/>
                        <h3 className="font-bold text-lg">Strategic Planning</h3>
                        <p className="text-sm text-gray-600">Our team helps design strategic plans to accelerate your business growth.</p>
                    </div>
                    </div>

                    <div className="border rounded-lg p-6 shadow-custom-lg flex items-start space-x-4 m-2">
                    <div>
                        <FontAwesomeIcon icon={faCreditCard} className='text-2xl'/>
                        <h3 className="font-bold text-lg">Easy Payments</h3>
                        <p className="text-sm text-gray-600">Enjoy seamless and secure payment options for your convenience.</p>
                    </div>
                    </div>
                </div>

                <hr className='mt-10  border-t-2 border-green-500'/>

                {/* VAlUES SECTION */}

                <div className="max-w-screen-lg text-black mx-auto mt-6">
                    <h1 className="text-3xl font-semibold text-center mb-10">Our Values</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">

                        <div className="relative shadow-lg transform transition duration-500 hover:scale-105 bg-white rounded-lg m-2">
                            <img src={Image} alt="Transparency and Integrity" className="w-full h-48 object-cover rounded-md mb-4" />
                            <h3 className="text-xl font-bold mb-2 p-2">Transparency and Integrity</h3>
                            <p className='p-2'>Be honest and straightforward in communicating and providing recommendations.</p>
                        </div>

                        <div className="relative shadow-lg transform transition duration-500 hover:scale-105 bg-white rounded-lg m-2">
                            <img src={Image} alt="Innovation" className="w-full h-48 object-cover rounded-md mb-4" />
                            <h3 className="text-xl font-bold mb-2 p-2">Innovation</h3>
                            <p className='p-2'>He is always aware of the newest trends and advances in the market and is ahead of the competition.</p>
                        </div>

                        <div className="relative shadow-lg transform transition duration-500 hover:scale-105 bg-white rounded-lg m-2">
                            <img src={Image} alt="Integrity" className="w-full h-48 object-cover rounded-md mb-4" />
                            <h3 className="text-xl font-bold mb-2 p-2">Integrity</h3>
                            <p className='p-2'>Commitment to honesty and compliance with corporate ethics.</p>
                        </div>

                        <div className="relative shadow-lg transform transition duration-500 hover:scale-105 bg-white rounded-lg m-2">
                            <img src={Image} alt="Customer Oriented" className="w-full h-48 object-cover rounded-md mb-4" />
                            <h3 className="text-xl font-bold mb-2 p-2">Customer Oriented</h3>
                            <p className='p-2'>All proceeds, irrespective of sources, are meant to benefit the client.</p>
                        </div>

                        <div className="relative shadow-lg transform transition duration-500 hover:scale-105 bg-white rounded-lg mx-auto md:col-span-2 m-2">
                            <img src={Image} alt="Collaboration" className="w-full h-48 object-cover rounded-md mb-4" />
                            <h3 className="text-xl font-bold mb-2 p-2">Collaboration</h3>
                            <p className='p-2'>Maintain fruitful relationships with agents and partners.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer className="mt-20 text-white bg-[#000000]">
                <div className="m-2">
                    <h2>Join the Profit Play Community to explore new ways of perfecting how you manage your finances while immersing yourself in exciting gameplay, expertly crafted for ultimate enjoyment and designed for maximum rewards.</h2>
                </div>
                <div className=" w-full flex justify-center">
                    <div className="w-full md:w-3/4 lg:w-2/3 p-2 flex flex-start justify-between">
                    <Link to="/signup">
                                <button className="bg-[#607714] text-white py-2 px-4 sm:py-3 sm:px-8 rounded-full hover:bg-orange-600 transition duration-300">
                                Join the Profit Play family!
                                </button>
                    </Link>
                    </div>
                </div>
            </footer>
            

        </>
    )
}

export default AboutUs;