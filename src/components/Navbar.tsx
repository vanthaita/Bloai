'use client';

import { useCurrentUser } from '@/hook/use-current-user';
import Link from 'next/link';
import { FaSearch, FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hook/use-mobile';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Logo from '@/components/logo'; 
import { Button } from './ui/button';

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
        "h-14 min-[375px]:h-16 bg-white border-b-2 border-black/70 flex items-center justify-between",
        "px-2 min-[375px]:px-4 md:px-6 lg:px-8 shadow-sm",
        "fixed top-0 left-0 w-full z-20" 
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center flex-shrink-0">
        <Link
          href="/"
          className='hover:opacity-80 transition-opacity' 
          aria-label="Bloai Home Page"
        >
          <Logo />
        </Link>
      </div>

      {!isMobile && (
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative w-full">
            <label htmlFor="main-search" className="sr-only">Search content</label>
            <input
              id="main-search"
              type="search"
              name="search"
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
              aria-label="Search articles"
            />
            <FaSearch
              className="absolute left-2.5 min-[375px]:left-3 top-1/2 -translate-y-1/2
                        w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 text-gray-500"
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 min-[375px]:gap-4 flex-shrink-0">
        <button
          className="hidden sm:flex p-1.5 min-[375px]:p-2 text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="Notifications"
        >
          <FaBell className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" />
        </button>

        {user ? (
          <div className="relative flex gap-x-4" ref={dropdownRef}>
            <Link href='/new-post'>
              <Button className='bg-neutral-950 text-white hover:bg-gray-800'>
                Tạo Blog
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
            className="px-3 py-1.5 min-[375px]:px-4 min-[375px]:py-2 text-sm min-[375px]:text-base text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-colors border-2 border-black rounded-xl"
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