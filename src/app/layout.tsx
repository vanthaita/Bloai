"use client";

import React, { useState } from "react";
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "@/trpc/react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/section/Navbar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="en" className={`${GeistSans.variable} antialiased scroll-custom`}>
      <body className="bg-gray-50">
        <TRPCReactProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1">
              <Sidebar onToggle={(isOpen) => setIsSidebarOpen(isOpen)} />
              <main className="flex-1 p-4">
                {React.cloneElement(children as React.ReactElement, { expanded: !isSidebarOpen })}
              </main>
            </div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
