import type { Metadata } from 'next';
import SignUpClient from './SignUpClient';

export const metadata: Metadata = {
  title: 'Đăng ký — Bloai Blog',
  description: 'Đăng ký tài khoản Bloai Blog để tham gia cộng đồng AI và bắt đầu sáng tạo nội dung.',
  alternates: {
    canonical: 'https://www.bloai.blog/auth/signup',
  },
};

export default function SignUpPage() {
  return <SignUpClient />;
}
