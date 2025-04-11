import React, { Suspense } from "react";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import AppSidebarProvider from "@/provider/app.sidebar";
import { auth } from "@/server/auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify';
import { GoogleAnalytics } from '@next/third-parties/google'
import Loading from "@/components/loading";
import {
  rootLayoutMetadata,
  websiteSchemaLd,
  organizationSchemaLd,
  breadcrumbSchemaLd,
  safeJsonLdStringify 
} from '@/config/seo'; 

export const metadata = rootLayoutMetadata;

const inter = Inter({
  subsets: ['vietnamese'],
  variable: '--font-inter',
})



export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="vi" className={`${inter.className} antialiased scroll-custom`} suppressHydrationWarning>
        <head>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(websiteSchemaLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(organizationSchemaLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbSchemaLd) }}
            />
          </head>
        <body className="bg-gray-50" suppressHydrationWarning>
          <TRPCReactProvider>
            <main>
              <AppSidebarProvider>
                <Suspense fallback={<Loading />}>
                    {children}
                </Suspense>
                <ToastContainer/>
                <Analytics />
                <SpeedInsights />
                <GoogleAnalytics gaId="G-CL7D21ZY78" />
              </AppSidebarProvider>
            </main>
          </TRPCReactProvider>
        </body>
      </html>
    </SessionProvider>
  );
}