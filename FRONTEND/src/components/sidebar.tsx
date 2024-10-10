import { useState, useEffect } from 'react';
import open from '../images/greater-than.png';


interface Menus {
  id: number;
  name: string;
  link: string;
  icon: JSX.Element;
}

interface SidebarProps {
  menu: Menus[]; 
}

const SidebarComponent: React.FC<SidebarProps> = ({menu}) => {
  const [show, setShow] = useState(true);

  // Automatically close sidebar on mobile view (width < 768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShow(false); // Collapse sidebar for mobile screens
      } else {
        setShow(true); // Expand sidebar for larger screens
      }
    };

    // Initial check when component mounts
    handleResize();

    // Add event listener for window resizing
    window.addEventListener('resize', handleResize);

    // Cleanup event listener when component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Sidebar classes refactored for readability
  const sidebarClasses = `
    ${show ? 'w-44' : 'w-16'} 
    duration-300 h-screen p-0.2 pt-4 bg-[#0c1d55] relative transition-all ease-in-out
  `;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Sidebar toggle button */}
        <img 
          src={open}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-2 bg-[#0c1d55] border-white rounded-full ${!show && 'rotate-180'}`}
          onClick={() => setShow(!show)}
        />
        <div className="flex gap-x-4 ml-2 items-center">
          <h1 className="cursor-pointer  text-xl font-bold text-white duration-500">X</h1>
          <h1 className={`text-white text-xl font-medium origin-left duration-300 ${!show && 'scale-0'}`}>
            CASH
          </h1>
        </div>
        {/* Menu items */}
        <ul className="pt-6">
         {menu.map((menuItem) => (
            <li
              key={menuItem.id}
              className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-6 hover:bg-white hover:text-black rounded-md hover:border hover:border-gray-400"
            >
              <div className="min-w-[40px]">
                {menuItem.icon}
              </div>
              <span className={`${!show ? 'hidden' : ''} origin-left duration-200`}>
                {menuItem.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarComponent;
