"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaHome, FaBookmark, FaTag, FaUsers, 
  FaRegClock, FaHeart, FaTimes, FaBars,
  FaPlus
} from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Sidebar = ({ onToggle }: { onToggle: (isOpen: boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsOpen(!isMobileView);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    onToggle(isOpen);
  }, [isOpen, onToggle]);

  const menuSections = [
    {
      title: "Menu",
      items: [
        { name: "Home", icon: <FaHome />, href: "/" },
        { name: "Following", icon: <FaUsers /> },
        { name: "Tags", icon: <FaTag /> },
      ]
    },
    {
      title: "Bookmarks",
      items: [
        { name: "Quick saves", icon: <FaBookmark /> },
        { name: "Read it later", icon: <FaRegClock /> },
        { name: "Likes", icon: <FaHeart /> },
      ]
    }
  ];

  const DesktopSidebar = () => (
    <div className={cn(
      "sticky top-0 h-screen bg-background border-r overflow-y-auto transition-all duration-300",
      isOpen ? "w-64" : "w-0 -translate-x-full"
    )}>
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/landing" className="font-bold text-xl">
            .Devlife
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)}
          >
            <FaTimes className="h-4 w-4" />
          </Button>
        </div>

        <Button className="w-full mb-6 gap-2">
          <FaPlus className="text-sm" />
          <span>New Blog</span>
        </Button>

        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {item.href ? (
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3"
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
                      className="w-full justify-start gap-3"
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
  );

  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden ml-4">
          <FaBars className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-6">
            <Link href="/landing" className="font-bold text-xl">
              .Devlife
            </Link>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <FaTimes className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>

          <Button className="w-full mb-6 gap-2">
            <FaPlus className="text-sm" />
            <span>New Blog</span>
          </Button>

          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {item.href ? (
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className="w-full justify-start gap-3"
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
                        className="w-full justify-start gap-3"
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
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {isMobile ? (
        <MobileSidebar />
      ) : (
        <>
          {isOpen ? (
            <DesktopSidebar />
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:block absolute left-4 top-4"
              onClick={() => setIsOpen(true)}
            >
              <FaBars className="h-5 w-5" />
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default Sidebar;