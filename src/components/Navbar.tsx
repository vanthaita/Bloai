'use client';

import { useCurrentUser } from '@/hook/use-current-user';
import Link from 'next/link';
import { FaSearch, FaUser, FaSignOutAlt, FaPenAlt, FaHome } from '@/components/icons';
import { signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hook/use-mobile';
import { cn } from '@/lib/utils';
import Logo from '@/components/logo';
import { Button } from './ui/button';
import Search from './Search';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usePathname } from 'next/navigation';
import { NewsTicker } from './blog/NewsTicker';

const Navbar = () => {
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const pathname = usePathname();

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
    <header className="bg-white w-full sticky top-0 z-50 transition-all duration-300 border-b-2 border-black max-w-[100vw]">
      {/* Top Tier */}
      <div className="border-b border-black">
        <div className="max-w-7xl mx-auto px-4 min-[375px]:px-6 md:px-8 w-full flex items-center justify-between h-14 md:h-16">
          
          {/* Left: Search */}
          <div className="flex-1 flex items-center justify-start">
            {!isMobile ? (
              <div className="w-56">
                <Search />
              </div>
            ) : (
              <Link
                href="/search"
                className={cn(
                  "flex items-center justify-center w-8 h-8 border border-black hover:bg-black hover:text-white transition-colors",
                  pathname === "/search" && "bg-black text-white"
                )}
              >
                <FaSearch className="w-3.5 h-3.5" aria-label="Search" />
              </Link>
            )}
          </div>
          
          {/* Center: Logo */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Logo />
          </div>

          {/* Right: User / Auth */}
          <div className="flex-1 flex items-center justify-end gap-2 md:gap-3">
            {user ? (
              <div className="relative flex gap-x-2 items-center" ref={dropdownRef}>
                <Button
                  asChild
                  className={cn(
                    'bg-white text-black border border-black hover:bg-black hover:text-white rounded-none transition-all shadow-none h-8 px-4 font-bold uppercase tracking-wider text-[10px] md:text-xs',
                    pathname === "/new-post" && "bg-black text-white"
                  )}
                >
                  <Link href='/new-post'>
                    <FaPenAlt className="w-3 h-3" />
                    <span className="hidden sm:inline ml-2">Viết Bài</span>
                  </Link>
                </Button>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-center w-8 h-8 border border-black rounded-none hover:bg-black hover:text-white transition-all group p-0"
                  aria-label="User menu"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                >
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage
                      src={user.image || 'https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_auto/v1746885273/y3hpblcst5qn3j5aah1l.svg'}
                      alt={user.name || 'User avatar'}
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <AvatarFallback className="bg-transparent rounded-none text-black font-bold group-hover:text-white transition-colors flex items-center justify-center w-full h-full text-[10px]">
                      {user.name ? (
                        user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                      ) : (
                        <FaUser className="w-3 h-3" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {isOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-48 bg-white shadow-none border border-black divide-y divide-black z-[100]"
                    role="menu"
                  >
                    <div className="px-3 py-2 bg-black text-white">
                      <p className="text-[11px] font-bold uppercase tracking-wider truncate">{user.name}</p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-black hover:bg-gray-100 transition-colors"
                      >
                        <FaSignOutAlt className="w-3 h-3 mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className={cn(
                  "px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-black border border-black rounded-none hover:bg-black hover:text-white transition-colors h-8 flex items-center justify-center",
                  pathname === "/auth/signin" && "bg-black text-white"
                )}
              >
                Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Tier: Category Navigation (Desktop) */}
      {!isMobile && (
        <div className="bg-white border-b border-black">
          <nav className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-center space-x-12 py-2.5" aria-label="Category navigation">
            {[
              { name: 'Trang chủ', path: '/' },
              { name: 'Danh Mục', path: '/tags' },
              { name: 'Về chúng tôi', path: '/about' }
            ].map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-black hover:underline underline-offset-[4px] decoration-1 transition-all",
                  pathname === item.path && "underline"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* News Ticker */}
      <NewsTicker />
    </header>
  );
};

export default Navbar;