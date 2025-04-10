import React, { Suspense } from "react";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import AppSidebarProvider from "@/provider/app.sidebar";
import { auth } from "@/server/auth";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify';
import { GoogleAnalytics } from '@next/third-parties/google'
import Loading from "@/components/loading";

export const metadata: Metadata = {
  title: {
    default: "Bloai Blog",
    template: "%s | Bloai Blog"
  },
  description: "Bloai Blog - Trang tin tức, hướng dẫn và chia sẻ kiến thức chuyên sâu về Trí Tuệ Nhân Tạo (AI) tại Việt Nam. Cập nhật xu hướng công nghệ mới nhất, ứng dụng AI trong đời sống, kinh doanh, giáo dục và các lĩnh vực đột phá. Khám phá bài viết chi tiết về ChatGPT, Midjourney, AI Generative cùng hướng dẫn thực tế, phù hợp cho cả người mới bắt đầu và chuyên gia. Đồng hành cùng cộng đồng AI Việt Nam!",
  // icons: {
  //   // icon: [
  //   //   { url: '/images/Logo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
  //   //   { url: '/images/Logo/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
  //   // ],
  //   apple: [
  //     { url: '/images/Logo/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  //   ],
  // },
  metadataBase: new URL('https://www.bloai.blog'),
};

const inter = Inter({
  subsets: ['vietnamese'],
  variable: '--font-inter',
})

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Bloai Blog",
  "url": "https://www.bloai.blog",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.bloai.blog/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Bloai Blog",
  "url": "https://www.bloai.blog",
  "logo": "https://www.bloai.blog/images/Logo/favicon-32x32.png",
  "sameAs": [
    "https://www.facebook.com/bloaiblog",
    "https://twitter.com/bloaiblog",
    "https://www.linkedin.com/company/bloaiblog"
  ]
};

const navigationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Trang Chủ",
      "item": "https://www.bloai.blog/landing"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Bài Viết",
      "item": "https://www.bloai.blog/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Về chúng tôi",
      "item": "https://www.bloai.blog/about"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Danh Mục",
      "item": "https://www.bloai.blog/tags"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Liên hệ",
      "item": "https://www.bloai.blog/contact"
    }
  ]
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="vi" className={`${inter.className} antialiased scroll-custom`} suppressHydrationWarning>
        <head>
          <link ref="icon" href="/images/icon.ico" sizes="any"/>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema).replace(/</g, '\\u003c') }}
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