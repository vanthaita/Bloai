import { BlogGrid } from "@/components/blog/BlogGrid";
import { Metadata } from "next";
import Loading from "@/components/loading"; 
import { Suspense } from "react";
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
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "headline": "Bloai Blog - Kiến thức AI từ cơ bản đến nâng cao",
    "description": "Tổng hợp các bài viết mới nhất về trí tuệ nhân tạo và công nghệ",
    "url": "https://www.bloai.blog/",
    "image": "https://www.bloai.blog/images/og-blog.jpg",
    "publisher": {
      "@type": "Organization",
      "name": "Bloai Blog",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.bloai.blog/images/Logo/web-app-manifest-512x512.png",
        "width": 300,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.bloai.blog/"
    },
    "blogPost": [
      {
        "@type": "BlogPosting",
        "headline": "Bắt Trend Mạng Xã Hội: Cách tạo Vỉ Đồ Chơi Giới Thiệu Bản Thân Với GPT",
        "url": "https://www.bloai.blog/blog/bat-trend-mang-xa-hoi-cach-tao-vi-djo-choi-gioi-thieu-ban-than-voi-gpt",
        "datePublished": "2024-06-15T08:00:00+07:00",
        "dateModified": "2024-06-15T08:00:00+07:00",
        "author": {
          "@type": "Person",
          "name": "IE204SEO",
        },
      },
      {
        "@type": "BlogPosting",
        "headline": "Tìm hiểu sâu về Amazon Kendra GenAI Index (2025) [Hướng dẫn Chi Tiết]",
        "url": "https://www.bloai.blog/blog/tim-hieu-sau-ve-amazon-kendra-genai-index-2025-huong-dan-chi-tiet",
        "datePublished": "2024-06-10T08:00:00+07:00",
        "dateModified": "2024-06-12T08:00:00+07:00",
        "author": {
          "@type": "Person",
          "name": "IE204SEO",
        },
      },
      {
        "@type": "BlogPosting",
        "headline": "Xây dựng AI Assistant: Bí mật Tạo Trợ Lý Thông Minh Từ Notion",
        "url": "https://www.bloai.blog/blog/xay-dung-ai-assistant-bi-mat-tao-tro-ly-thong-minh-tu-notion-huong-dan-day-du-2025",
        "datePublished": "2024-06-05T08:00:00+07:00",
        "dateModified": "2024-06-07T08:00:00+07:00",
        "author": {
          "@type": "Person",
          "name": "IE204SEO",
        },
      }
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.bloai.blog/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema).replace(/</g, '\\u003c') }}
      />
      <main className="flex flex-col" itemScope itemType="https://schema.org/Blog">
        <section className="px-4 min-[375px]:px-6 md:px-8 lg:px-10 xl:px-12 py-6 min-[375px]:py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200 text-center underline decoration-[#3A6B4C] decoration-4 underline-offset-4" itemProp="headline">
            BÀI VIẾT NỔI BẬT
          </h1>
          
          <Suspense fallback={<Loading />}>
            <div itemScope itemType="https://schema.org/ItemList">
              <BlogGrid />
            </div>
          </Suspense>
        </section>

        <section className="w-full">
          <LeaderBoard />
        </section>

        <section className="w-full bg-gray-50 dark:bg-gray-800 py-12" itemScope itemType="https://schema.org/SubscribeAction">
          <EmailSubscribeSection 
            title="Đừng bỏ lỡ kiến thức AI mới nhất"
            description="Đăng ký nhận bản tin để cập nhật các bài viết mới, thủ thuật AI và tin tức công nghệ mỗi tuần."
          />
        </section>

        <section itemScope itemType="https://schema.org/Review">
          <TestimonialSection />
        </section>
      </main>
    </>
  );
}