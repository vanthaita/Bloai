import React from "react";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import AppSidebarProvider from "@/provider/app.sidebar";
import { auth } from "@/server/auth";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Bloai Blog - Trí Tuệ Nhân Tạo & Công Nghệ Mới Nhất",
    template: "%s | Bloai Blog"
  },
  description: "Bloai Blog - Trang tin tức hàng đầu về Trí Tuệ Nhân Tạo (AI) tại Việt Nam. Cập nhật xu hướng công nghệ mới nhất, hướng dẫn sử dụng ChatGPT, Midjourney, AI Generative và ứng dụng AI trong đời sống, kinh doanh, giáo dục.",
  keywords: [
    "AI Việt Nam",
    "Trí tuệ nhân tạo",
    "ChatGPT",
    "Midjourney",
    "AI Generative",
    "Công nghệ AI",
    "Hướng dẫn AI",
    "Tin tức công nghệ",
    "Ứng dụng AI"
  ],
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  metadataBase: new URL('https://www.bloai.blog'),
  openGraph: {
    title: "Bloai Blog - Trí Tuệ Nhân Tạo & Công Nghệ Mới Nhất",
    description: "Trang tin tức hàng đầu về Trí Tuệ Nhân Tạo (AI) tại Việt Nam",
    url: "https://www.bloai.blog",
    siteName: "Bloai Blog",
    images: [
      {
        url: "https://www.bloai.blog/images/Logo/android-chrome-512x512.png",
        width: 1200,
        height: 630,
        alt: "Bloai Blog - Trí Tuệ Nhân Tạo & Công Nghệ",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloai Blog - Trí Tuệ Nhân Tạo & Công Nghệ Mới Nhất",
    description: "Trang tin tức hàng đầu về Trí Tuệ Nhân Tạo (AI) tại Việt Nam",
    images: ["https://www.bloai.blog/images/Logo/android-chrome-512x512.png"],
    site: "@bloaiblog",
    creator: "@bloaiblog",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

const inter = Inter({
  subsets: ['vietnamese'],
  variable: '--font-inter',
  // 'optional' = browser uses fallback if font not cached; no mid-paint swap → zero font CLS
  display: 'optional',
  preload: true,
  adjustFontFallback: true, // auto-adjusts fallback metrics to minimize layout shift
});

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Bloai Blog",
  "url": "https://www.bloai.blog",
  "description": "Trang tin tức hàng đầu về Trí Tuệ Nhân Tạo (AI) tại Việt Nam",
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
  "logo": "https://www.bloai.blog/images/Logo/android-chrome-512x512.png",
  "sameAs": [
    "https://www.facebook.com/bloaiblog",
    "https://twitter.com/bloaiblog",
    "https://www.linkedin.com/company/bloaiblog",
    "https://www.youtube.com/@bloaiblog"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+84-xxx-xxx-xxxx",
    "contactType": "customer service",
    "areaServed": "VN",
    "availableLanguage": "Vietnamese"
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Trang Chủ",
      "item": "https://www.bloai.blog"
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
          <link rel="preconnect" href="https://res.cloudinary.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
          <link rel="dns-prefetch" href="https://vercel.live" />
          <Script
            type="text/partytown"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1872574461230356"
            strategy="worker"
            crossOrigin="anonymous"
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c') }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
          />
        </head>
        <body className="bg-gray-50" suppressHydrationWarning>
          <TRPCReactProvider>
            <main id="main-content" aria-label="Nội dung chính">
              <AppSidebarProvider>
                {children}
                <ToastContainer position="bottom-right" />
                <Analytics />
                <SpeedInsights />
                <Script
                  type="text/partytown"
                  id="gtag-base"
                  strategy="worker"
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', 'G-CL7D21ZY78');
                    `
                  }}
                />
                <Script
                  type="text/partytown"
                  src="https://www.googletagmanager.com/gtag/js?id=G-CL7D21ZY78"
                  strategy="worker"
                />
                <Script
                  type="text/partytown"
                  id="gtm-script"
                  strategy="worker"
                  dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-XXXXXXX');`
                  }}
                />
              </AppSidebarProvider>
            </main>
          </TRPCReactProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
