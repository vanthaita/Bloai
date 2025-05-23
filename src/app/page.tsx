import { BlogGrid } from "@/components/blog/BlogGrid";
import Loading from "@/components/loading"; 
import { Suspense } from "react";
<<<<<<< HEAD
import { blogPageMetadata, blogSchema, safeJsonLdStringify } from "@/config/seo";
=======
import LeaderBoard from "@/components/LeaderBoard";
import EmailSubscribeSection from "@/components/EmailSubscribe";
import TestimonialSection from "@/components/TestimonialSection";

export const metadata: Metadata = {
  title: "Bloai Blog - Hướng Dẫn AI Từ Cơ Bản Đến Nâng Cao | Kiến Thức Công Nghệ Mới Nhất",
  description: "Bloai Blog cung cấp kiến thức AI toàn diện từ cơ bản đến nâng cao. Khám phá hướng dẫn ChatGPT, Machine Learning, Deep Learning và ứng dụng AI trong kinh doanh, y tế, giáo dục. Cập nhật xu hướng AI 2024 và công cụ AI miễn phí.",
  keywords: [
    "AI Việt Nam",
    "Hướng dẫn AI",
    "ChatGPT",
    "Machine Learning",
    "Deep Learning",
    "Generative AI",
    "Ứng dụng AI",
    "Công nghệ AI 2024",
    "Trí tuệ nhân tạo",
    "Tutorial AI",
    "Midjourney",
    "Prompt Engineering"
  ],
  authors: [{ name: "Bloai Team", url: "https://www.bloai.blog/about" }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://www.bloai.blog',
    siteName: 'Bloai Blog',
    title: "Bloai Blog - Trung Tâm Kiến Thức AI Hàng Đầu Việt Nam",
    description: "Hướng dẫn toàn diện về Trí tuệ Nhân tạo từ cơ bản đến nâng cao. Cập nhật xu hướng AI mới nhất và ứng dụng thực tiễn.",
    images: [
      {
        url: 'https://www.bloai.blog/images/Logo/web-app-manifest-512x512.png',
        width: 1200,
        height: 630,
        alt: 'Bloai Blog - Kiến Thức AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bloaiblog',
    creator: '@bloaiblog',
    title: "Bloai Blog - Hướng Dẫn AI Từ Cơ Bản Đến Nâng Cao",
    description: "Khám phá thế giới AI với hướng dẫn chi tiết và case study thực tế",
    images: ['https://www.bloai.blog/images/Logo/web-app-manifest-512x512.png'],
  },
  alternates: {
    canonical: 'https://www.bloai.blog',
    types: {
      'application/rss+xml': 'https://www.bloai.blog/rss.xml',
    },
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
};

export default async function Home() {
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
    "logo": "https://www.bloai.blog/images/Logo/favicon-32x32.png",
    "sameAs": [
      "https://www.facebook.com/bloaiblog",
      "https://twitter.com/bloaiblog",
      "https://www.linkedin.com/company/bloaiblog",
      "https://www.youtube.com/@bloaiblog"
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Trang chủ",
      "item": "https://www.bloai.blog"
    }]
  };

  const testimonialSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Organization",
      "name": "Bloai Blog"
    },
    "author": {
      "@type": "Person",
      "name": "Người dùng ẩn danh"
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bloai Blog"
    }
  };
  
  return (
    <>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(testimonialSchema).replace(/</g, '\\u003c') }}
      />

      <main className="flex flex-col">
        <section className="px-4 min-[375px]:px-6 md:px-8 lg:px-10 xl:px-12 py-6 min-[375px]:py-8">
>>>>>>> e31a2c630cb91bfa50a5ce151e47714bee6b7ccb
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200 text-center underline decoration-[#3A6B4C] decoration-4 underline-offset-4">
            BÀI VIẾT NỔI BẬT
          </h1>
          <Suspense fallback={<Loading />}>
            <BlogGrid />
          </Suspense>
        </section>

        <section className="w-full">
          <LeaderBoard />
        </section>

        <section className="w-full py-12">
          <EmailSubscribeSection 
            title="Đừng bỏ lỡ kiến thức AI mới nhất"
            description="Đăng ký nhận bản tin để cập nhật các bài viết mới, thủ thuật AI và tin tức công nghệ mỗi tuần."
          />
        </section>

        <section>
          <TestimonialSection />
        </section>
      </main>
    </>
  );
}