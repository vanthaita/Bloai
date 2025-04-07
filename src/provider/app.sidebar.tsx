"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome, FaBookmark, FaTag, FaUsers,
  FaRegClock, FaHeart, FaTimes, FaBars,
  FaPlus, FaComments, FaFolderOpen
} from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navbar from '@/section/Navbar';
import { useIsMobile } from '@/hook/use-mobile';
import { useOpenAppSidebar } from '@/hook/use-app-sidebar';
import { AUTH_ROUTES } from '@/lib/route';
import Footer from '@/components/Footer';
import Logo from '@/components/logo';

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  href?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const AppSidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const { isOpenAppSidebar, setIsOpenAppSidebar } = useOpenAppSidebar();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const [mobileTab, setMobileTab] = useState<string | null>("Trang chủ"); 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpenAppSidebar && sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)) {
        setIsOpenAppSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpenAppSidebar, isMobile]);

  const menuSections: MenuSection[] = [
    {
      title: "Menu",
      items: [
        { name: "Trang chủ", icon: <FaHome />, href: "/" },
        // { name: "Đang theo dõi", icon: <FaUsers />, href: "/following" },
        { name: "Tags", icon: <FaTag />, href: "/tags" },
      ]
    },
    {
      title: "",
      items: [
        // { name: "Lưu nhanh", icon: <FaBookmark />, href: "/saved" },
        // { name: "Đọc sau", icon: <FaRegClock />, href: "/read-later" }, 
        // { name: "Đã thích", icon: <FaHeart />, href: "/liked" }, 
      ]
    }
  ];

  const mobileTabs: MenuItem[] = menuSections.reduce<MenuItem[]>((tabs, section) => {
    return tabs.concat(section.items);
  }, []);

  const handleMobileTabClick = (tabName: string, href?: string) => {
    setMobileTab(tabName);
    if (href) {
    }
  };

  return (
    <>
      {isAuthRoute ?
        (
          <div>{children}</div>
        ) :
        (
          <section className='flex flex-1'>
            {!isMobile ? ( 
              <>
                {isMobile && isOpenAppSidebar && ( 
                  <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpenAppSidebar(false)}
                  />
                )}

                <aside
                  ref={sidebarRef}
                  className={cn(
                    'h-full border-r-2 border-black/70 fixed bg-background transition-all duration-300 z-50 bg-white',
                    isOpenAppSidebar ? (isMobile ? 'w-full bg-white' : 'w-64') : 'w-20'
                  )}
                >
                  {!isOpenAppSidebar && (
                    <div className='h-full flex flex-col items-center justify-between py-6'>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpenAppSidebar(true)}
                      >
                        <FaBars className='h-6 w-6' />
                      </Button>

                      <div className='-rotate-90 whitespace-nowrap'>
                        <Logo />
                      </div>
                      <div className='flex flex-col gap-5'>
                        <FaComments className='h-6 w-6 cursor-pointer' />
                        <FaFolderOpen className='h-6 w-6 cursor-pointer' />
                        <FaBookmark className='h-6 w-6 cursor-pointer' />
                      </div>
                    </div>
                  )}

                  {isOpenAppSidebar && (
                    <div className='h-full flex flex-col p-4'>
                      <div className='h-full flex flex-col p-4'>
                        <div className='flex justify-between items-center mb-6'>
                          <Link href="/" className='font-bold text-xl'>
                            <Logo />
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpenAppSidebar(false)}
                          >
                            <FaTimes className='h-6 w-6' />
                          </Button>
                        </div>

                        <Link href='/new-post'>
                          <Button className='w-full mb-6 gap-2'>
                            <FaPlus className='text-sm' />
                            <span>Blog mới</span>
                          </Button>
                        </Link>

                        {menuSections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className='mb-6'>
                            <h3 className='text-sm font-medium text-muted-foreground mb-3 px-2'>
                              {section.title}
                            </h3>
                            <ul className='space-y-1'>
                              {section.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  {item.href ? (
                                    <Button
                                      variant={pathname === item.href ? "secondary" : "ghost"}
                                      className='w-full justify-start gap-3'
                                      asChild
                                    >
                                      <Link href={item.href}>
                                        {item.icon}
                                        {item.name}
                                      </Link>
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      className='w-full justify-start gap-3'
                                    >
                                      {item.icon}
                                      {item.name}
                                    </Button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </aside>
              </>
            ) : ( 
              <div className="fixed inset-x-0 bottom-0 bg-white border-t border-black/20 z-50">
                <nav className=" flex justify-around items-center h-16">
                  {mobileTabs.map((tab, index) => (
                    <Button
                      key={index}
                      variant={mobileTab === tab.name ? "secondary" : "ghost"}
                      className="flex flex-col items-center justify-center gap-1 min-w-[50px]"
                      onClick={() => handleMobileTabClick(tab.name, tab.href)}
                      asChild
                    >
                      <Link href={tab.href || "/"}> 
                        <>
                          {tab.icon}
                          <span className="text-xs">{tab.name}</span>
                        </>
                      </Link>
                    </Button>
                  ))}
                </nav>
              </div>
            )}

            <main className={cn(
              'transition-margin duration-300 flex-1',
              isMobile ? 'ml-0' : (isOpenAppSidebar ? 'ml-64' : 'ml-20'),
              isMobile && 'mb-16' 
            )}>
              <div className='h-14'>
                <Navbar />
              </div>
              {children}
              <Footer />
            </main>
          </section>
        )
      }
    </>
  );
};

export default AppSidebarProvider;