import type { Metadata } from 'next';
import SignInClient from './SignInClient';

export const metadata: Metadata = {
  title: 'Đăng nhập — Bloai Blog',
  description: 'Đăng nhập vào Bloai Blog để tiếp tục hành trình khám phá AI và tạo nội dung của bạn.',
  alternates: {
    canonical: 'https://www.bloai.blog/auth/signin',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: 'https://www.bloai.blog/auth/signin',
    siteName: 'Bloai Blog',
    title: 'Đăng nhập — Bloai Blog',
    description: 'Đăng nhập vào Bloai Blog để khám phá AI.',
    locale: 'vi_VN',
    images: [
      {
        url: 'https://www.bloai.blog/images/Logo/android-chrome-512x512.png',
        width: 1200,
        height: 630,
        alt: 'Bloai Blog - Đăng nhập',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Bloai_Team',
    title: 'Đăng nhập — Bloai Blog',
    description: 'Đăng nhập vào Bloai Blog.',
    images: ['https://www.bloai.blog/images/Logo/android-chrome-512x512.png'],
  },
};

export default function SignInPage() {
  return <SignInClient />;
}
