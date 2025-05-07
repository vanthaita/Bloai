'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Logo from './logo';
import { FaFacebook, FaGithub, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { api } from '@/trpc/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const subscribeMutation = api.blog.subscribeToNewsletter.useMutation({
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      toast.success('Đăng ký nhận bản tin thành công! Cảm ơn bạn.');
      setEmail('');
    },
    onError: (error) => {
      toast.error(`Đăng ký thất bại: ${error.message}`);
    },
    onSettled: () => setIsLoading(false),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Vui lòng nhập địa chỉ email');
      return;
    }
    subscribeMutation.mutate({ email });
  };

  const socialIcons = {
    X: <FaXTwitter className="h-5 w-5" />,
    Facebook: <FaFacebook className="h-5 w-5" />,
    GitHub: <FaGithub className="h-5 w-5" />,
    Youtube: <FaYoutube className="h-5 w-5" />,
  };

  const footerContent = {
    tagline: 'Bài viết sâu sắc về công nghệ, thiết kế và phát triển. Khám phá tương lai AI cùng Bloai.',
    links1: [
      { name: 'Trang chủ', href: '/landing' },
      { name: 'Danh mục', href: '/tags' },
      { name: 'Về chúng tôi', href: '/about' },
    ],
    links2: [
      { name: 'Liên hệ', href: '/contact' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Điều khoản & Bảo mật', href: '/privacy' },
    ],
    socials: [
      { name: 'X', href: 'https://x.com/Bloai_Team' },
      { name: 'GitHub', href: 'https://github.com/TDevUIT/Bloai' },
      { name: 'Facebook', href: 'https://web.facebook.com/bloai/' },
      { name: 'Youtube', href: 'https://www.youtube.com/channel/UCi396lyYi5FURzdp-W93lHg' },
    ],
    copyright: 'Bloai Team. Đã đăng ký bản quyền.',
  };

  return (
    <footer className="">
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-12 text-center">
            <Logo />
            <p className="text-[#554640]/90 max-w-md mt-4">{footerContent.tagline}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <form className="flex gap-3" onSubmit={handleSubmit} aria-label="Subscribe to newsletter">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#554640]" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 focus:ring-2 focus:ring-[#3A6B4C] rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-[#3A6B4C] hover:bg-[#2E5540] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang gửi...' : <>Đăng ký <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
              <p className="text-sm text-[#554640]/80 mt-3">Nhận thông tin cập nhật mới nhất.</p>
            </div>

            <div>
              <h4 className="text-[#2B463C] font-medium mb-4">Liên kết</h4>
              <ul className="space-y-2">
                {footerContent.links1.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[#554640]/90 hover:text-[#3A6B4C] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[#2B463C] font-medium mb-4">&nbsp;</h4>
              <ul className="space-y-2">
                {footerContent.links2.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[#554640]/90 hover:text-[#3A6B4C] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[#3A6B4C] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-4">
              {footerContent.socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-[#554640]/80 hover:text-[#3A6B4C]"
                >
                  {socialIcons[social.name as keyof typeof socialIcons]}
                </Link>
              ))}
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-[#554640]/80">
                © {new Date().getFullYear()} {footerContent.copyright}
              </p>
              <div className="mt-1 space-x-4">
                <Link href="/privacy" className="text-sm text-[#554640]/80 hover:text-[#3A6B4C]">
                  Chính sách Bảo mật
                </Link>
                <Link href="/terms" className="text-sm text-[#554640]/80 hover:text-[#3A6B4C]">
                  Điều khoản Dịch vụ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
