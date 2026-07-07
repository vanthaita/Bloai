import { Metadata } from 'next';

export const rootLayoutMetadata: Metadata = {
  title: {
    default: "Bloai Blog - Tin Tức Công Nghệ, Lập Trình & AI Mới Nhất",
    template: "%s | Bloai Blog"
  },
  description: "Bloai Blog - Nền tảng chia sẻ kiến thức chuyên sâu về Công nghệ, Lập trình, AI và SEO. Cập nhật xu hướng phát triển phần mềm, hướng dẫn ChatGPT, Midjourney, Generative AI với hướng dẫn chi tiết từ cơ bản đến nâng cao. Đồng hành cùng cộng đồng công nghệ Việt Nam!",
  metadataBase: new URL('https://www.bloai.blog'),
  openGraph: {
    images: '/images/Logo/android-chrome-512x512.png',
  },
};

export const websiteSchemaLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Bloai Blog",
  "url": "https://www.bloai.blog",
  "description": "Trung tâm kiến thức Công nghệ, Lập trình, AI và SEO hàng đầu Việt Nam",
  "inLanguage": "vi",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.bloai.blog/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};
export const breadcrumbSchemaLd = {
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
export const organizationSchemaLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Bloai Blog",
  "legalName": "Cộng đồng Bloai Blog",
  "url": "https://www.bloai.blog",
  "logo": "https://www.bloai.blog/images/Logo/android-chrome-512x512.png",
  "foundingDate": "2023",
  "founders": [{
    "@type": "Person",
    "name": "Bloai Team"
  }],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "22521330uit@gmail.com",
    "availableLanguage": ["Vietnamese"]
  },
  "sameAs": [
    "https://www.facebook.com/blogbloai",
    "https://x.com/Bloai_Team",
    "https://www.youtube.com/channel/UCi396lyYi5FURzdp-W93lHg"
  ]
};
// Blog 
export const blogPageMetadata: Metadata = {
  title: "Bloai Blog - Hướng Dẫn Lập Trình, Công Nghệ, AI & SEO Từ Cơ Bản Đến Nâng Cao",
  description: "Bloai Blog cung cấp kiến thức toàn diện về Lập trình, Công nghệ, AI và SEO từ cơ bản đến nâng cao. Khám phá hướng dẫn lập trình, tối ưu hiệu suất, ChatGPT, Machine Learning và các công cụ công nghệ mới nhất.",
  keywords: [
    "Ứng dụng AI",
    "Hướng dẫn lập trình",
    "Học lập trình web",
    "Tối ưu SEO",
    "Kiến thức công nghệ",
    "ChatGPT Hướng dẫn",
    "Midjourney Tips",
    "AI Coding",
    "Prompt Engineering",
    "AI Content Creation",
    "Công cụ AI miễn phí",
    "AutoML",
    "Tối ưu hóa AI",
    "Xu hướng công nghệ",
    "Phát triển AI",
    "Công nghệ AI",
    "AI Việt Nam",
    "Computer Vision",
    "Xử lý ngôn ngữ tự nhiên",
    "Phát triển phần mềm"
  ],
  authors: [{ name: "Bloai Team" }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://www.bloai.blog',
    siteName: 'Bloai Blog',
    title: "Bloai Blog - Trung Tâm Kiến Thức Công Nghệ, Lập Trình & AI Hàng Đầu Việt Nam",
    description: "Hướng dẫn toàn diện về Lập trình, Công nghệ, AI và SEO từ cơ bản đến nâng cao. Cập nhật xu hướng công nghệ mới nhất và ứng dụng thực tiễn trong đời sống.",
    images: [{ url: 'https://www.bloai.blog/images/Logo/android-chrome-512x512.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bloai Blog - Hướng Dẫn Lập Trình, Công Nghệ, AI & SEO Từ Cơ Bản Đến Nâng Cao",
    images: ['https://www.bloai.blog/images/Logo/android-chrome-512x512.png'],
  },
  alternates: {
    canonical: 'https://www.bloai.blog',
    types: { 'application/rss+xml': 'https://www.bloai.blog/rss.xml' },
  },
};

// Schema Definitions
export const blogSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Bloai Blog - Lập trình, AI & Công nghệ",
  "url": "https://www.bloai.blog/",
  "description": "Tổng hợp các bài viết mới nhất về công nghệ, lập trình, trí tuệ nhân tạo và SEO",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.bloai.blog/" },
  "publisher": {
    "@type": "Organization",
    "name": "Bloai Blog",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.bloai.blog/images/Logo/android-chrome-512x512.png"
    }
  },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "BlogPosting",
          "url": "https://www.bloai.blog/blog/bat-trend-mang-xa-hoi-cach-tao-vi-djo-choi-gioi-thieu-ban-than-voi-gpt",
          "name": "Bắt Trend Mạng Xã Hội: Cách tạo Vỉ Đồ Chơi Giới Thiệu Bản Thân Với GPT"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "BlogPosting",
          "url": "https://www.bloai.blog/blog/tim-hieu-sau-ve-amazon-kendra-genai-index-2025-huong-dan-chi-tiet",
          "name": "Tìm hiểu sâu về Amazon Kendra GenAI Index (2025) [Hướng dẫn Chi Tiết]"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "BlogPosting",
          "url": "https://www.bloai.blog/blog/xay-dung-ai-assistant-bi-mat-tao-tro-ly-thong-minh-tu-notion-huong-dan-day-du-2025",
          "name": "Xây dựng AI Assistant: Bí mật Tạo Trợ Lý Thông Minh Từ Notion (Hướng dẫn Đầy đủ 2025)"
        }
      }
    ]
  }
};
// --- AboutPage ---
export const aboutPageSchemaLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "Giới thiệu Bloai Blog",
  "description": "Tìm hiểu về sứ mệnh và đội ngũ đứng sau Bloai Blog - Nền tảng kiến thức Lập trình, Công nghệ và AI hàng đầu Việt Nam",
  "publisher": organizationSchemaLd, 
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.bloai.blog/about"
  },
  "image": "https://www.bloai.blog/images/Logo/android-chrome-512x512.png"
};

// --- ContactPage ---
export const contactPageSchemaLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Liên hệ hợp tác cùng Bloai Blog",
  "description": "Kết nối với chuyên gia Công nghệ, Lập trình, AI và cộng đồng tại Việt Nam thông qua Bloai Blog",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "22521330uit@gmail.com",
    "availableLanguage": "Vietnamese",
    "areaServed": "VN"
  },
  "sameAs": organizationSchemaLd.sameAs
};

// --- HomePage ---
export const homePageSchemaLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Trang chủ Bloai Blog",
  "description": "Cập nhật tin tức và bài viết mới nhất về Công nghệ, Lập trình, AI và SEO tiên tiến tại Việt Nam",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.bloai.blog"
  },
  "publisher": organizationSchemaLd
};

export const safeJsonLdStringify = (data: object): string => {
  return JSON.stringify(data, null, 2)
    .replace(/</g, '\\u003c')
};