import {useState} from 'react';
import { Link } from 'react-router-dom';
import AppLogo from '../images/profitplay-black.png';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faTimes} from "@fortawesome/free-solid-svg-icons";
import useLogout from "@/hooks/logOut.ts";

const NavBar = ()=> {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const loggedIn = localStorage.getItem('loggedIn');
    const userRole = localStorage.getItem('userRole');


    const onToggleMenu = () => {
        console.log('Menu toggled');

        setIsMenuOpen(!isMenuOpen);
    };
    const handleLogout = useLogout();

    return (
        <nav className="flex justify-between items-center w-[92%] mx-auto">
            <div>
                <Link to='/'>
                    <a>
                        <img src={AppLogo} alt="App Logo" className="w-24 "/>
                    </a>
                </Link>
            </div>
            <div
                className={`md:static absolute md:min-h-fit min-h-[60vh] left-0 ${isMenuOpen ? 'top-[9%] w-full bg-[#000000] z-50' : 'top-[-100%] w-full'} md:w-auto w-full flex items-center px-5`}>
                <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 text-white">
                    <li><Link to={'/'}>Home</Link></li>
                    {/*<li><a href="#"></a>Become an Agent</li>*/}
                    <li><a href="#">Contact Us</a></li>
                    <li><Link to={'/about-us'}>About Us</Link></li>
                </ul>

            </div>
            {loggedIn !== 'true' && (
                <div className='flex items-center gap-3 py-2'>
                    <Link to={"/signin"}>
                        <button className='border-2 px-2 border-[#6AE803] ml-2 rounded text-white whitespace-nowrap'>
                            LOG IN
                        </button>
                    </Link>
                    <button><Link to={"/signup"}
                                  className="bg-[#6AE803] text-white px-5 py-2 rounded-full hover:bg-[#58D106] whitespace-nowrap"> Sign
                        Up</Link></button>
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars}
                                     className='text-3xl text-white cursor-pointer md:hidden' onClick={onToggleMenu}/>
                </div>
            )}

            {
                loggedIn === 'true' && (
                    <div className='flex items-center gap-3 py-2'>
                        <button><Link to={userRole === 'Admin' ? '/admin' : '/agent'}
                                      className="bg-[#6AE803] text-white px-5 py-2 rounded-full hover:bg-[#58D106] whitespace-nowrap"> Dashboard
                        </Link></button>

                        <Link to={"/signin"}
                              className='border-2 px-2 border-[#6AE803] ml-2 rounded text-white whitespace-nowrap'>
                            <button onClick={handleLogout}>LOGOUT</button>
                        </Link>
                        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars}
                                         className='text-3xl text-white cursor-pointer md:hidden'
                                         onClick={onToggleMenu}/>
                    </div>
                )
            }
        </nav>
    )
}

export default NavBar;


