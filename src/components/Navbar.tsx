'use client';

import { useCurrentUser } from '@/hook/use-current-user';
import Link from 'next/link';
import { FaSearch, FaBell, FaUser, FaSignOutAlt, FaPenAlt, FaRobot } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hook/use-mobile';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Logo from '@/components/logo'; 
import { Button } from './ui/button';
import Search from './Search';

const Navbar = () => {
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className={cn(
        "h-14 min-[375px]:h-16 bg-white border-b border-black/10 flex items-center justify-between",
        "px-2 min-[375px]:px-4 md:px-6 lg:px-8 shadow-sm",
        "fixed top-0 left-0 w-full z-20" 
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center flex-shrink-0 md:max-w-6xl md:w-full">
          <Logo />
        {!isMobile && (
          <div className="flex-1 max-w-2xl mx-4">
            <Search />
          </div>
      )}
      </div>
      
      <div className="flex items-center justify-end gap-2 min-[375px]:gap-4 flex-shrink-0">
        {/* <Link href="/ai-tools" className="p-1.5 min-[375px]:p-2 text-gray-600 hover:text-purple-600 transition-colors">
          <FaRobot className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" aria-label="AI Tools" />
        </Link> */}
        <button
          className="hidden sm:flex p-1.5 min-[375px]:p-2 text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="Notifications"
        >
          <FaBell className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" />
        </button>

        {user ? (
          <div className="relative flex gap-x-4" ref={dropdownRef}>
            <Link href='/new-post'>
              <Button className='bg-[#3A6B4C] text-white hover:bg-[#3A6B4C]/90 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="none" viewBox="0 0 24 24" aria-label="Write"><path fill="currentColor" d="M14 4a.5.5 0 0 0 0-1zm7 6a.5.5 0 0 0-1 0zm-7-7H4v1h10zM3 4v16h1V4zm1 17h16v-1H4zm17-1V10h-1v10zm-1 1a1 1 0 0 0 1-1h-1zM3 20a1 1 0 0 0 1 1v-1zM4 3a1 1 0 0 0-1 1h1z"></path><path stroke="currentColor" d="m17.5 4.5-8.458 8.458a.25.25 0 0 0-.06.098l-.824 2.47a.25.25 0 0 0 .316.316l2.47-.823a.25.25 0 0 0 .098-.06L19.5 6.5m-2-2 2.323-2.323a.25.25 0 0 1 .354 0l1.646 1.646a.25.25 0 0 1 0 .354L19.5 6.5m-2-2 2 2"></path></svg>
                <span>Viết Blog</span>
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.name}'s avatar`}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border border-gray-300" 
                  priority
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full border border-gray-300">
                  <FaUser className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </button>

            {isOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 divide-y divide-gray-100"
                role="menu"
              >
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900 truncate" role="none">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate" role="none">{user.email}</p>
                </div>
                <div className="py-1" role="none">
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-150" 
                    role="menuitem"
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
            href="/auth/signin"
            className="px-3 py-1.5 min-[375px]:px-4 min-[375px]:py-2 text-sm min-[375px]:text-base text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-colors border-2 border-black rounded-sm"
            aria-label="Sign in"
            >
            <span className='font-medium'>Đăng Nhập</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;