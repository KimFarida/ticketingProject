import { useState, useEffect } from 'react';
import open from '../images/greater-than.png';
import AppLogo from '../images/profitplaylogo.png';
import LogoutButton from '../pages/logOut';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCreditCard,
  faHouse,
  faMoneyBill1,
  faPlus,
  faShop,
  faTicket, faUser,
  faUsers
} from "@fortawesome/free-solid-svg-icons";

interface Menus {
  id: number;
  name: string;
  link: string;
  icon: JSX.Element;
}

interface SidebarProps {
  menu: Menus[];
}

export const menuAdmin = [
    { id: 1, name: 'Dashboard', link: '/admin', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 2, name: 'Agent', link: '/view-all-agents', icon: <FontAwesomeIcon icon={faUsers} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 3, name: 'Merchant', link: '/view-all-merchants', icon: <FontAwesomeIcon icon={faShop} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 4, name: 'Ticket', link: '/ticket', icon: <FontAwesomeIcon icon={faTicket} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 5, name: 'Voucher', link: '/create-voucher', icon: <FontAwesomeIcon icon={faMoneyBill1} className="w-7 h-7 object-contain text-gray-300" /> },
    { id: 6, name: 'Payout', link: '/adminPayout', icon: <FontAwesomeIcon icon={faCreditCard} className="w-7 h-7 object-contain text-gray-300" /> },

  ]

export  const menuMerchant  = [
        { id: 1, name: 'Dashboard', link: '/dashboard', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 2, name: 'Create Vouchers', link: '/create-voucher', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 5, name: 'Profile', link: '/profile', icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> }

]

export const menuAgent = [
        { id: 1, name: 'Dashboard', link: '/agent', icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 2, name: 'Create Vouchers', link: '/create-voucher', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 3, name: 'Create Tickets', link: '/ticket', icon: <FontAwesomeIcon icon={faPlus} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 4, name: 'Payout', link: '/payout',icon: <FontAwesomeIcon icon={faCreditCard} className="w-7 h-7 object-contain text-gray-300" /> },
        { id: 5, name: 'Profile', link: '/profile', icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7 object-contain text-gray-300" /> }
    ];

const SidebarComponent: React.FC<SidebarProps> = ({ menu }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShow(false);
      } else {
        setShow(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarClasses = `
    ${show ? 'w-44' : 'w-16'} 
    duration-300 h-screen p-0.2 bg-[#000000] relative transition-all ease-in-out
  `;

  return (
    <div className="flex flex-shrink-0">
      <div className={sidebarClasses}>
        <img
          src={open}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-2 bg-[#214F02] border-white rounded-full ${!show && 'rotate-180'}`}
          onClick={() => setShow(!show)}
        />
        <div className="flex gap-x-4 ml-2 items-center">
          <div>
            <img src={AppLogo} alt="App Logo" className="w-24 mt-4" />
          </div>
        </div>
        <ul className="pt-6">
          {menu.map((menuItem) => (
            <li
              key={menuItem.id}
              className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-6 hover:bg-white hover:text-black rounded-md hover:border hover:border-gray-400"
            >
              <a href={menuItem.link} className="flex items-center gap-x-4 w-full">
                <div className="min-w-[40px]">
                  {menuItem.icon}
                </div>
                <span className={`${!show ? 'hidden' : ''} origin-left duration-200`}>
                  {menuItem.name}
                </span>
              </a>
            </li>
          ))}
          {/* Logout button */}
          <li className="text-gray-300 text-sm flex items-center gap-x-4 p-6 mt-4">
            <LogoutButton />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarComponent;
