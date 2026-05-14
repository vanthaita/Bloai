"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/lib/route';

const AppSidebarProvider = ({ 
  children,
  navbar,
  footer
}: { 
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname) || PROTECTED_ROUTES.includes(pathname);
  const isNewPostRoute = pathname.startsWith('/new-post') || pathname.startsWith('/unsubscribe');

  return (
    <>
      {isAuthRoute || isNewPostRoute ? (
        <div className="flex flex-col flex-1 w-full">{children}</div>
      ) : (
        <div className='flex flex-col flex-1'>
          {navbar}
          <div className="flex flex-col flex-1 w-full min-h-[120vh]" id="main-content">
            {children}
          </div>
          {footer}
        </div>
      )}
    </>
  );
};

export default AppSidebarProvider;