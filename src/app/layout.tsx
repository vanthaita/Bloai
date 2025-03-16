import React from "react";
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "@/trpc/react";
import AppSidebarProvider from "@/provider/app.sidebar";
import { auth } from "@/server/auth";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bloai",
  description: "Blog Tech",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <SessionProvider session={session} >
      <html lang="en" className={`${GeistSans.variable} antialiased scroll-custom`} suppressHydrationWarning>
        <body className="bg-gray-50" suppressHydrationWarning>
          <TRPCReactProvider>
            <main>
              <AppSidebarProvider>
                {children}
              </AppSidebarProvider>
            </main>
          </TRPCReactProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
