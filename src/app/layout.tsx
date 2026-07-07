import React from "react";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import AppSidebarProvider from "@/provider/app.sidebar";
import { auth } from "@/server/auth";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";
import { ClientProviders } from "@/components/ClientProviders";
import { GoogleTag } from "@/components/GoogleTag";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "Bloai Blog - Tin Tức Công Nghệ, Lập Trình & AI Mới Nhất",
    template: "%s | Bloai Blog"
  },
  description: "Bloai Blog - Trang tin tức hàng đầu về Lập trình, Công nghệ, AI và SEO tại Việt Nam. Cập nhật xu hướng phát triển web, hướng dẫn ChatGPT, Midjourney, tối ưu hóa SEO và hiệu suất phần mềm.",
  keywords: [
    "Bloai",
    "Tin tức công nghệ",
    "Hướng dẫn lập trình",
    "Trí tuệ nhân tạo",
    "ChatGPT",
    "Tối ưu SEO",
    "Phát triển web",
    "Công nghệ mới nhất",
    "AI Việt Nam",
    "Học lập trình"
  ],
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  metadataBase: new URL('https://www.bloai.blog'),
  openGraph: {
    title: "Bloai Blog - Tin Tức Công Nghệ, Lập Trình & AI Mới Nhất",
    description: "Trang tin tức hàng đầu về Lập trình, Công nghệ, AI và SEO tại Việt Nam",
    url: "https://www.bloai.blog",
    siteName: "Bloai Blog",
    images: [
      {
        url: "https://www.bloai.blog/images/Logo/android-chrome-512x512.png",
        width: 1200,
        height: 630,
        alt: "Bloai Blog - Công Nghệ, Lập Trình & AI",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloai Blog - Tin Tức Công Nghệ, Lập Trình & AI Mới Nhất",
    description: "Trang tin tức hàng đầu về Lập trình, Công nghệ, AI và SEO tại Việt Nam",
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
  "description": "Trang tin tức hàng đầu về Lập trình, Công nghệ, AI và SEO tại Việt Nam",
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
    "https://www.facebook.com/blogbloai",
    "https://twitter.com/bloaiblog",
    "https://www.linkedin.com/company/bloaiblog",
    "https://www.youtube.com/@bloaiblog"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+84-374-985-716",
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
    <html lang="vi" className={`antialiased scroll-custom ${beVietnamPro.variable}`} suppressHydrationWarning>
      <head>
        <GoogleTag />
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
      </body>
    </html>
  );
}
