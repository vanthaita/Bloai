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
  const isAdminRoute = pathname.startsWith('/admin');

  
  return (
    <>
      {isAuthRoute || isNewPostRoute || isAdminRoute ? (
        <div>{children}</div>
      ) : (
        <section className='flex flex-1'>
          <main className='flex-1'>
            <div className='h-14'>
              <Navbar />
            </div>
            {children}
            <Footer />
          </main>
        </section>
      )}
    </>
  );
};

export default AppSidebarProvider;