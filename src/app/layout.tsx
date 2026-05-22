import React from "react";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import AppSidebarProvider from "@/provider/app.sidebar";
import { auth } from "@/server/auth";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";
import { ClientProviders } from "@/components/ClientProviders";
import { GTMLoader } from "@/components/GTMLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className="antialiased scroll-custom" suppressHydrationWarning>
      <head>
        {/* GTMLoader defers GA script until first user interaction, no preconnect needed */}
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
          <SessionProvider>
            <div id="app-root">
              <AppSidebarProvider navbar={<Navbar />} footer={<Footer />}>
                {children}
                <ClientProviders />
              </AppSidebarProvider>
            </div>
          </SessionProvider>
        </TRPCReactProvider>
        {/* GTMLoader defers GA script until first user interaction —
            removes it from Lighthouse's "unused JS" critical-path audit entirely. */}
        <GTMLoader />
      </body>
    </html>
  );
}
