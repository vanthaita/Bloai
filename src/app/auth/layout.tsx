
import React from "react";
import "@/styles/globals.css";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="antialiased scroll-custom" suppressHydrationWarning>
      <div className="min-h-screen bg-[#e8e8e8] flex items-center justify-center px-4 py-10">
        {children}
      </div>
    </main>
  );
}
