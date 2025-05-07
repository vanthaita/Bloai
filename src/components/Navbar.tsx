'use client';

import { useCurrentUser } from '@/hook/use-current-user';
import Link from 'next/link';
import { FaSearch, FaBell, FaUser, FaSignOutAlt, FaPenAlt, FaRobot, FaHome } from 'react-icons/fa';
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
          <div className="hidden md:flex items-center ml-8 space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-[#3A6B4C] transition-colors flex items-center gap-1"
            >
              <FaHome className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
            <Link
              href="/tags"
              className="text-gray-600 hover:text-[#3A6B4C] transition-colors"
            >
              Danh Mục
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-[#3A6B4C] transition-colors"
            >
              Về chúng tôi
            </Link>
          </div>
        )}

        {!isMobile && (
          <div className="flex-1 max-w-2xl mx-4">
            <Search />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-end gap-2 min-[375px]:gap-4 flex-shrink-0">
        {isMobile && (
          <Link href="/search" className="p-1.5 text-gray-600 hover:text-[#3A6B4C] transition-colors">
            <FaSearch className="w-4 h-4" aria-label="Search" />
          </Link>
        )}

        {user ? (
          <div className="relative flex gap-x-4" ref={dropdownRef}>
            <Button asChild className='bg-[#3A6B4C] text-white hover:bg-[#3A6B4C]/90 ...'>
              <Link href='/new-post'>
                <FaPenAlt className="w-4 h-4" />
                <span className="hidden sm:inline">Viết Blog</span>
              </Link>
            </Button>
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
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors" 
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
          >
            <span className='font-medium'>Đăng Nhập</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;