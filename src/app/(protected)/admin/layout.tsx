import AdminSidebar from '@/provider/admin.appsidebar';
import React from 'react'

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AdminSidebar>
        {children}
      </AdminSidebar>
    </>
  );
}