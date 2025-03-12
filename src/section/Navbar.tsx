import React from 'react';
import { FaSearch, FaBell, FaUser, FaCog } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="h-14 min-[375px]:h-16 bg-white border-b flex items-center justify-between px-2 min-[375px]:px-4 md:px-6 lg:px-8 shadow-sm">
      <div className="flex-1 max-w-[200px] min-[375px]:max-w-[280px] sm:max-w-[320px] md:max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-100 text-gray-800 rounded-lg 
                     py-1.5 min-[375px]:py-2 
                     px-3 min-[375px]:px-4 
                     pl-8 min-[375px]:pl-10
                     text-sm min-[375px]:text-base
                     border border-gray-200 
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                     hover:border-gray-300
                     outline-none shadow-sm"
          />
          <FaSearch className="absolute left-2.5 min-[375px]:left-3 top-2 min-[375px]:top-3 text-gray-500 
                              w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 min-[375px]:gap-4">
        <button className="hidden sm:flex p-1.5 min-[375px]:p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <FaBell className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" />
        </button>
        <button className="hidden sm:flex p-1.5 min-[375px]:p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <FaCog className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" />
        </button>
        <button className="p-1.5 min-[375px]:p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <FaUser className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;