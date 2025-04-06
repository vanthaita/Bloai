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
  title: "BloAI Blog - Kiến thức AI từ Cơ bản đến Nâng cao",
  description: "Khám phá cách sử dụng AI trong mọi lĩnh vực, hướng dẫn chi tiết về Trí tuệ Nhân tạo, và ứng dụng thực tế của AI vào công việc và cuộc sống.",
  keywords: [
    "AI",
    "Trí tuệ Nhân tạo",
    "Machine Learning",
    "Deep Learning",
    "Generative AI",
    "Neural Networks",
    "Ứng dụng AI",
    "AI cho Doanh nghiệp",
    "AI trong Y tế",
    "AI Giáo dục",
    "AI Marketing",
    "AI trong Fintech",
    "AI trong Logistics",
    "Chuyển đổi số với AI",
    "Smart Assistant",
    "Robotics AI",
    "Tự động hóa với AI",
    "AI và IoT",
    "Hướng dẫn AI",
    "ChatGPT Hướng dẫn",
    "Midjourney Tips",
    "AI Coding",
    "Prompt Engineering",
    "AI Content Creation",
    "Công cụ AI miễn phí",
    "AutoML",
    "Tối ưu hóa AI",
    "Xu hướng AI 2024",
    "Đạo đức AI",
    "AI Ethics",
    "AI Startup",
    "Phát triển AI",
    "Công nghệ AI",
    "AI Việt Nam",
    "Computer Vision",
    "Xử lý ngôn ngữ tự nhiên",
    "AI Automation",
    "Big Data Analytics",
    "AI Framework",
    "AI Model"
  ],
  authors: [{ name: "BloAI Team" }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://bloai.blog',
    siteName: 'BloAI Blog',
    images: [
      {
        url: 'https://bloai.blog/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BloAI Blog',
      },
    ],
  },
  alternates: {
    canonical: 'https://bloai.blog',
    types: {
      'application/rss+xml': 'https://bloai.blog/rss.xml',
    },
  },
  icons: [
    { rel: "icon", url: "/images/Logo/Bloai.svg" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/images/Logo/apple-touch-icon.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/images/Logo/favicon-32x32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/images/Logo/favicon-16x16.png" },
    { rel: "manifest", url: "/site.webmanifest" }
  ],
  metadataBase: new URL('https://bloai.blog'),
};

const inter = Inter({
  subsets: ['vietnamese'],
  variable: '--font-inter',
})

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BloAI Blog",
  "url": "https://bloai.blog",
  "logo": "https://bloai.blog/images/Logo/Bloai.svg",
  "description": "Trang tin tức và hướng dẫn về Trí tuệ Nhân tạo hàng đầu Việt Nam",
  "sameAs": [
    "https://facebook.com/bloai.blog",
    "https://twitter.com/bloai_blog",
    "https://www.linkedin.com/company/bloai-blog"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contact@bloai.blog",
    "contactType": "customer service"
  }
};

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
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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