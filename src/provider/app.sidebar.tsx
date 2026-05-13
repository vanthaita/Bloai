"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/lib/route';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const AppSidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname) || PROTECTED_ROUTES.includes(pathname);
  const isNewPostRoute = pathname.startsWith('/new-post') || pathname.startsWith('/unsubscribe');

  return (
    <>
      {isAuthRoute || isNewPostRoute ? (
        <div>{children}</div>
      ) : (
        <div className='flex flex-col flex-1'>
          <Navbar />
          {children}
          <Footer />
        </div>
      )}
    </>
  );
};

export default AppSidebarProvider;