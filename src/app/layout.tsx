import React from "react";
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "@/trpc/react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/section/Navbar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} antialiased scroll-custom`} suppressHydrationWarning>
      <body className="bg-gray-50" suppressHydrationWarning>
        <TRPCReactProvider>
          <main>
            {children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
