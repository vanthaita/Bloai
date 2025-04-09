"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { AUTH_ROUTES } from '@/lib/route';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const AppSidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  return (
    <>
      {isAuthRoute ? (
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