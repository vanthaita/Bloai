"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaHome, FaBookmark, FaTag, FaUsers, 
  FaRegClock, FaHeart, FaTimes, FaBars,
  FaPlus
} from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = ({ onToggle }: { onToggle: (isOpen: boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);  
  const pathname = usePathname();

  // Kiểm tra kích thước màn hình và cập nhật trạng thái
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Kiểm tra lần đầu
    checkMobile();

    // Theo dõi thay đổi kích thước màn hình
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen);
  };

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

  return (
    <>
      {/* Overlay khi sidebar mở trên mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleToggle}
        />
      )}

      {isOpen ? (
        <div className={`${
          isMobile 
            ? 'fixed inset-0 w-full bg-white z-50' 
            : 'sticky top-0 h-screen w-64'
          } bg-sidebar-bg border-r text-content-primary overflow-y-auto shadow-sm transition-all duration-300`}
        >
          <div className={`flex justify-between items-center p-4 border-b ${isMobile ? 'text-center' : ''}`}>
            <Link href="/landing" className={`font-bold text-xl ${isMobile ? 'flex-1 text-center' : ''}`}>
              .Devlife
            </Link>
            <button 
              onClick={handleToggle}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${isMobile ? 'absolute right-4' : ''}`}
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>
          <div className="p-4">
            <button className={`w-full mb-6 flex items-center justify-center gap-2 
              py-2 px-4 bg-blue-600 text-white rounded-lg font-medium 
              hover:bg-blue-700 transition-colors`}>
              <FaPlus className="text-sm" />
              <span>New Blog</span>
            </button>
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h3 className={`text-sm font-medium text-content-secondary mb-3 
                  ${isMobile ? 'text-center' : ''}`}
                >
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.href ? (
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 text-sm py-2 px-2 rounded-lg 
                            cursor-pointer transition-colors
                            ${pathname === item.href 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'hover:bg-sidebar-hover hover:text-primary-600'
                            }
                            ${isMobile ? 'justify-center' : ''}`}
                        >
                          <span className={pathname === item.href ? 'text-blue-600' : 'text-primary-500'}>
                            {item.icon}
                          </span>
                          <span>{item.name}</span>
                        </Link>
                      ) : (
                        <div className={`flex items-center gap-3 text-sm py-2 px-2 rounded-lg 
                          cursor-pointer transition-colors
                          hover:bg-sidebar-hover hover:text-primary-600
                          ${isMobile ? 'justify-center' : ''}`}
                        >
                          <span className="text-primary-500">{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="sticky top-0 h-16 z-20">
          <button
            onClick={handleToggle}
            className="absolute left-4 top-4 p-2 bg-white shadow-md rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaBars className="text-gray-600" />
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
