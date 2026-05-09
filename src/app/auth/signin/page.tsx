import type { Metadata } from 'next';
import SignInClient from './SignInClient';

export const metadata: Metadata = {
  title: 'Đăng nhập — Bloai Blog',
  description: 'Đăng nhập vào Bloai Blog để tiếp tục hành trình khám phá AI và tạo nội dung của bạn.',
  alternates: {
    canonical: 'https://www.bloai.blog/auth/signin',
  },
};

export default function SignInPage() {
  return <SignInClient />;
}
