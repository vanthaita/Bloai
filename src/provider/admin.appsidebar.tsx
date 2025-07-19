'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBlog, FaRobot, FaTags, FaComments, FaEnvelope, FaCogs } from 'react-icons/fa';

const navItems = [
  { href: '/admin/blog', label: 'Blog', icon: <FaBlog /> },
  { href: '/admin/crawl', label: 'Crawl', icon: <FaRobot /> },
  { href: '/admin/tags', label: 'Tags', icon: <FaTags /> },
  { href: '/admin/comments', label: 'Comments', icon: <FaComments /> },
  { href: '/admin/newsletter', label: 'Newsletter', icon: <FaEnvelope /> },
];

const AdminSidebar = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col items-center py-8 shadow-md z-20">
        <div className="mb-8 flex flex-col items-center">
          <span className="font-bold text-xl tracking-wide text-gray-900">Admin</span>
        </div>
        <nav className="flex flex-col gap-2 w-full px-4">
          {navItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-base font-medium
                  ${isActive ? 'bg-gray-900 text-white shadow' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <span className={`text-xl ${isActive ? 'text-white' : 'text-gray-500'}`}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex-1" />
        <div className="text-xs text-gray-400 mt-8">Bloai Admin &copy; {new Date().getFullYear()}</div>
      </aside>
      <main className="flex-1 ml-64 bg-gray-50 p-8 min-h-screen overflow-y-auto" style={{ maxHeight: '100vh' }}>{children}</main>
    </div>
  );
};

export default AdminSidebar;
