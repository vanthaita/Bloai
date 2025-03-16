'use client'
import { useCurrentUser } from '@/hook/use-current-user';
import Link from 'next/link';
import { FaSearch, FaBell, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hook/use-mobile';
import { cn } from '@/lib/utils';
import { useOpenAppSidebar } from '@/hook/use-app-sidebar';

const Navbar = () => {
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {isOpenAppSidebar} = useOpenAppSidebar();
  const isMobile = useIsMobile();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    console.log(isOpenAppSidebar)
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, []);
  return (
    <nav className={cn(
      "h-14 min-[375px]:h-16 bg-white border-b-2 border-black/70 flex items-center justify-between px-2 min-[375px]:px-4 md:px-6 lg:px-8 shadow-sm fixed z-20",
      isOpenAppSidebar ? 'w-[calc(100%-16rem)]' : 'w-[calc(100%-5rem)]', 
      isMobile && (isOpenAppSidebar ? 'left-0' : 'left-20'),
      !isMobile && (isOpenAppSidebar ? 'left-64' : 'left-20') 
    )}>
      <div className="flex-1" />
      
      {!isMobile && (
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative w-full">
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
                       outline-none shadow-sm transition-all"
            />
            <FaSearch className="absolute left-2.5 min-[375px]:left-3 top-1/2 -translate-y-1/2 
                                w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 text-gray-500" />
            <div className='absolute right-2 min-[375px]:right-3 top-1/2 -translate-y-1/2 
                          flex items-center justify-center 
                          px-2 py-0.5 
                          bg-gray-100 rounded-md 
                          text-gray-500 text-sm 
                          shadow-sm border border-gray-200 
                          hover:bg-gray-200 transition-colors
                          space-x-1'>
              <p className="text-xs">Ctrl</p>
              <p className="text-xs">+</p>
              <p className="text-xs">K</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-end gap-2 min-[375px]:gap-4">
        <button className="hidden sm:flex p-1.5 min-[375px]:p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <FaBell className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" />
        </button>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 p-1.5 hover:text-blue-600 transition-colors"
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="p-2 bg-gray-100 rounded-full">
                  <FaUser className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 divide-y divide-gray-100">
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUser className="w-4 h-4 mr-3 text-gray-400" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaCog className="w-4 h-4 mr-3 text-gray-400" />
                    Settings
                  </Link>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-3 text-gray-400" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="p-1.5 min-[375px]:p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaUser className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;