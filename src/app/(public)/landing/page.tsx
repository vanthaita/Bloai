import type { Metadata } from 'next';
import LandingClient from './LandingClient';

export const metadata: Metadata = {
  title: 'Khám Phá Thế Giới AI Cùng Bloai Blog',
  description: 'Nền tảng kiến thức AI hàng đầu Việt Nam. Hướng dẫn thực tế, nghiên cứu mới nhất và case study AI ứng dụng thực tiễn.',
  alternates: {
    canonical: 'https://www.bloai.blog/landing',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.bloai.blog/landing',
    siteName: 'Bloai Blog',
    title: 'Khám Phá Thế Giới AI Cùng Bloai Blog',
    description: 'Nền tảng kiến thức AI hàng đầu Việt Nam. Hướng dẫn thực tế và nghiên cứu AI mới nhất.',
    locale: 'vi_VN',
    images: [
      {
        url: 'https://www.bloai.blog/images/Logo/android-chrome-512x512.png',
        width: 1200,
        height: 630,
        alt: 'Bloai Blog - Nền Tảng AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Bloai_Team',
    title: 'Khám Phá Thế Giới AI Cùng Bloai Blog',
    description: 'Nền tảng kiến thức AI hàng đầu Việt Nam.',
    images: ['https://www.bloai.blog/images/Logo/android-chrome-512x512.png'],
  },
};

export default function LandingPage() {
  return <LandingClient />;
}