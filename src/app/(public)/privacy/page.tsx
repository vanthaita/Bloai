import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Điều Khoản & Chính Sách Bảo Mật — Bloai Blog',
  description: 'Điều khoản sử dụng và chính sách bảo mật của Bloai Blog. Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn.',
  alternates: {
    canonical: 'https://www.bloai.blog/privacy',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.bloai.blog/privacy',
    siteName: 'Bloai Blog',
    title: 'Điều Khoản & Chính Sách Bảo Mật — Bloai Blog',
    description: 'Điều khoản sử dụng và chính sách bảo mật của Bloai Blog.',
    locale: 'vi_VN',
    images: [
      {
        url: 'https://www.bloai.blog/images/Logo/android-chrome-512x512.png',
        width: 1200,
        height: 630,
        alt: 'Bloai Blog - Chính Sách',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Bloai_Team',
    title: 'Điều Khoản & Chính Sách Bảo Mật — Bloai Blog',
    description: 'Chính sách bảo mật của Bloai Blog.',
    images: ['https://www.bloai.blog/images/Logo/android-chrome-512x512.png'],
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
