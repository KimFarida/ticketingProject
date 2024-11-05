import { Link } from 'react-router-dom';
import './signUp.css'
import petImage from '../images/profit play.png'
import NavBar from "@/components/navBar.tsx";
import ScrollAnimation from '../components/logoAnimation';
import TicketValidator from '../components/ticketValidator'



function LandingPage(){

    return(
        <>
            <header className="bg-[#000000]">
                <NavBar></NavBar>
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
                            <Link to={"/signup"}>
                                <button
                                    className="bg-[#607714] text-white py-2 px-4 sm:py-3 sm:px-8 rounded-full hover:bg-orange-600 transition duration-300">
                                    Join the Profit Play family!
                                </button>
                            </Link>

                        </div>
                        <div className="md:w-1/2 flex justify-center md:justify-end mt-4 md:mt-0 p-4">
                            <img src={petImage} alt="Description" className="w-full h-auto rounded-lg"/>
                        </div>
                    </div>

                </div>
            </div>
            <ScrollAnimation/>

            {/* FOOTER */}

            <footer className="mt-20 bg-black text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Company Section */}
                        <div className="col-span-1">
                            <h3 className="font-semibold text-lg mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li className="hover:text-gray-300 cursor-pointer transition-colors">
                                    About Us
                                </li>
                                <li className="hover:text-gray-300 cursor-pointer transition-colors">
                                    How it works
                                </li>
                                <li className="hover:text-gray-300 cursor-pointer transition-colors">
                                    Blog
                                </li>
                            </ul>
                        </div>

                        {/* Follow Us Section */}
                        <div className="col-span-1">
                            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
                            <ul className="space-y-2">
                                <li className="hover:text-gray-300 cursor-pointer transition-colors">
                                    <a href={'https://www.facebook.com/profile.php?id=61567109963352'}
                                       target={'_blank'}>
                                        Facebook
                                    </a>
                                </li>
                                <li className="hover:text-gray-300 cursor-pointer transition-colors">
                                    <a href={'https://x.com/Profitplay9ja'} target={'_blank'}>
                                        X (Twitter)
                                    </a>
                                </li>
                                <li className="hover:text-gray-300 cursor-pointer transition-colors">
                                    <a href={'https://www.instagram.com/profitplay9ja/'} target={'_blank'}>
                                        Instagram
                                    </a>
                                </li>
                                <li className="hover:text-gray-300 cursor-pointer transition-colors">
                                    <a href={'https://t.me/profitplay9ja'} target={'_blank'}>
                                        Telegram
                                    </a>
                                </li>
                                <li className="hover:text-gray-300 cursor-pointer transition-colors">
                                    <a href={'https://www.tiktok.com/@profitplay9ja'} target={'_blank'}>
                                        TikTok
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    )
}


export default LandingPage;