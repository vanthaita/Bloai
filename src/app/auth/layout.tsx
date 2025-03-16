
import React from "react";
import "@/styles/globals.css";
import { AuthBackground } from "@/components/AuthBackground";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased scroll-custom">
        <main className="">
          <div className="min-h-screen bg-[#e8e8e8] flex">
              <div className="hidden lg:block w-1/2">
                <AuthBackground />
              </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
