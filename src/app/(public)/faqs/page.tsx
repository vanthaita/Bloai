import type { Metadata } from 'next';
import FAQsClient from './FAQsClient';

export const metadata: Metadata = {
  title: 'Câu Hỏi Thường Gặp về AI — Bloai Blog',
  description: 'Giải đáp câu hỏi thường gặp về AI, Machine Learning và ứng dụng trí tuệ nhân tạo. Tìm hiểu cách học AI hiệu quả dù không biết lập trình.',
  alternates: {
    canonical: 'https://www.bloai.blog/faqs',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.bloai.blog/faqs',
    siteName: 'Bloai Blog',
    title: 'Câu Hỏi Thường Gặp về AI — Bloai Blog',
    description: 'Giải đáp câu hỏi thường gặp về AI và cách học AI hiệu quả.',
    locale: 'vi_VN',
    images: [
      {
        url: 'https://www.bloai.blog/images/Logo/android-chrome-512x512.png',
        width: 1200,
        height: 630,
        alt: 'Bloai Blog - FAQ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Bloai_Team',
    title: 'Câu Hỏi Thường Gặp về AI — Bloai Blog',
    description: 'Giải đáp câu hỏi về AI và cách học AI hiệu quả.',
    images: ['https://www.bloai.blog/images/Logo/android-chrome-512x512.png'],
  },
};

export default function FAQsPage() {
  return <FAQsClient />;
}