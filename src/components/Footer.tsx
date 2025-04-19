'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight } from 'lucide-react'; 
import Link from 'next/link';
import Logo from './logo';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { api } from '@/trpc/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Footer = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const subscribeMutation = api.blog.subscribeToNewsletter.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      toast.success('Đăng ký nhận bản tin thành công! Cảm ơn bạn.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setEmail('');
    },
    onError: (error) => {
      toast.error(`Đăng ký thất bại: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Vui lòng nhập địa chỉ email', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    subscribeMutation.mutate({ email });
  };

  const footerContent = {
    tagline: 'Bài viết sâu sắc về công nghệ, thiết kế và phát triển. Khám phá tương lai AI cùng Bloai.',
    links1_title: 'Liên kết', 
    links1: [ 
      { name: 'Trang chủ', href: '/landing' },
      { name: 'Danh mục', href: '/tags' },
      { name: 'Về chúng tôi', href: '/about' },
    ],
    links2_title: '\u00A0', 
    links2: [ 
      { name: 'Liên hệ', href: '/contact' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Điều khoản & Bảo mật', href: '/privacy' },
    ],
    socials_title: 'Kết nối',
    socials: [
      { name: 'Twitter', href: 'https://x.com/Bloai_Team', icon: 'FaTwitter' }, 
      { name: 'GitHub', href: 'https://github.com/TDevUIT/Bloai', icon: 'FaGithub' },
      { name: 'Facebook', href: 'https://www.youtube.com/channel/UCi396lyYi5FURzdp-W93lHg', icon: 'FaFacebook' },
    ],
    copyright: 'Bloai Team. Đã đăng ký bản quyền.', 
  };

  const joinProfessionalsText = "Nhận thông tin cập nhật mới nhất."; 
  const privacyPolicyText = "Chính sách Bảo mật"; 
  const termsOfServiceText = "Điều khoản Dịch vụ"; 

  return (
    <footer className="">
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Logo />
            </div>
            <p className="text-center text-[#554640]/90 max-w-md">
              {footerContent.tagline}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <form className="flex gap-3" onSubmit={handleSubmit}>
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#554640]" />
                  <Input
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 focus:ring-2 focus:ring-[#3A6B4C] rounded-lg"
                    aria-label="Email for newsletter" 
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-[#3A6B4C] border-[#3A6B4C] hover:bg-[#2E5540] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Đang gửi...'
                  ) : (
                    <>
                      Đăng ký 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
              <p className="text-sm text-[#554640]/80 mt-3">
                {joinProfessionalsText}
              </p>
            </div>

            <div>
              <h4 className="text-[#2B463C] font-medium mb-4">{footerContent.links1_title}</h4>
              <ul className="space-y-2">
                {footerContent.links1.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[#554640]/90 hover:text-[#3A6B4C] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[#2B463C] font-medium mb-4">{footerContent.links2_title}</h4>
              <ul className="space-y-2">
                {footerContent.links2.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[#554640]/90 hover:text-[#3A6B4C] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[#3A6B4C] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-4">
              <Link
                href={footerContent.socials.find(s => s.name === 'Twitter')?.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#554640]/80 hover:text-[#3A6B4C]"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-[#554640]/80 hover:text-[#3A6B4C]"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </Link>
              <Link
                href={footerContent.socials.find(s => s.name === 'GitHub')?.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#554640]/80 hover:text-[#3A6B4C]"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </Link>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-[#554640]/80">
                © {new Date().getFullYear()} {footerContent.copyright}
              </p>
              <div className="mt-1 space-x-4">
                <Link
                  href="/privacy"
                  className="text-sm text-[#554640]/80 hover:text-[#3A6B4C]"
                >
                  {privacyPolicyText}
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-[#554640]/80 hover:text-[#3A6B4C]"
                >
                  {termsOfServiceText}
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