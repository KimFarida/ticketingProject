import { useState } from 'react';
import open from '../images/greater-than.png';
import dashboardImg from '../images/dashboard.png';  // Import images directly
import shopImg from '../images/shop.png';
import transactionImg from '../images/transaction.png';
import profitImg from '../images/profit.png';
import userImg from '../images/user.png';

const SidebarComponent = () => {
  const [show, setShow] = useState(true);
  const Menus = [
    { id: 1, name: 'Dashboard', link: '/dashboard', src: dashboardImg },  // Use imported images
    { id: 2, name: 'Merchant', link: '/', src: shopImg },
    { id: 3, name: 'Transactions', link: '/', src: transactionImg },
    { id: 4, name: 'Profits', link: '/', src: profitImg },
    { id: 5, name: 'Profile', link: '/', src: userImg },
  ];

  return (
    <div className="flex">
      <div className={`${show ? "w-56" : "w-20"} duration-300 h-screen p-2 pt-8 bg-[#0c1d55] relative`}>
        <img 
          src={open}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-2 bg-[#0c1d55] border-white rounded-full ${!show && "rotate-180"}`} 
          onClick={() => setShow(!show)}
        />
        <div className="flex gap-x-4 items-center">
          <h1 className="cursor-pointer text-xl font-bold text-white duration-500">X</h1>
          <h1 className={`text-white text-xl font-medium origin-left duration-300 ${!show && "scale-0"}`}>CASH</h1>
        </div>
        <ul className="pt-6">
          {Menus.map((menu, index) => (
            <li 
              key={index} 
              className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-6 hover:bg-white hover:text-black rounded-md hover:border hover:border-gray-400" // Fixed hover color
            >
              <div className="min-w-[40px]"> {/* Ensure a fixed width for the image container */}
                <img
                  src={menu.src}
                  className="w-7 h-7 object-contain" // Ensure image size remains fixed
                />
              </div>
              <span className={`${!show && "hidden"} origin-left duration-200`}>
                {menu.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-7 text-2xl font-semibold flex-1 h-screen">
        <h1>ADMIN</h1>
      </div>
    </div>
  );
};

export default SidebarComponent;
