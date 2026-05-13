// Server Component — no 'use client'.
// Removing the client boundary eliminates this file from the JS bundle sent to the browser,
// reducing the amount of JavaScript that must be parsed & executed on first load.
import React from 'react';
import Link from 'next/link';
import Logo from './logo';
import { FaGithub, FaFacebook, FaYoutube, FaXTwitter } from '@/components/icons';
import { FooterNewsletterForm } from './FooterNewsletterForm';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-stable bg-white text-black border-t-2 border-black mt-12 max-w-[100vw] overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content - Newspaper Grid Style */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
          {/* Left Section - Logo & Description */}
          <div className="md:col-span-5 p-5 md:p-8 border-b md:border-b-0 md:border-r border-black flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <Logo />
              <p className="text-black text-xs font-medium leading-relaxed max-w-sm">
                Bài viết sâu sắc về công nghệ, thiết kế và phát triển. Khám phá tương lai AI cùng Bloai.
              </p>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h3 className="font-bold text-black uppercase tracking-wider text-[11px]">Đăng ký nhận tin</h3>
              {/* Only the form needs client JS — everything else stays server-rendered */}
              <FooterNewsletterForm />
            </div>
          </div>

          {/* Right Section - Links & Contact */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2">
            {/* Links */}
            <div className="p-5 md:p-8 border-b sm:border-b-0 sm:border-r border-black">
              <h3 className="font-bold text-black mb-5 uppercase tracking-wider text-[11px] flex items-center">
                <span className="w-2.5 h-2.5 bg-black mr-2.5 inline-block"></span>
                Liên kết
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'Trang chủ', href: '/' },
                  { label: 'Danh mục', href: '/tags' },
                  { label: 'Về chúng tôi', href: '/about' },
                  { label: 'Liên hệ', href: '/contact' },
                  { label: 'Giới thiệu', href: '/landing' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-black font-bold hover:underline underline-offset-[4px] decoration-1 transition-all text-[11px] uppercase tracking-wider"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Socials */}
            <div className="p-5 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="font-bold text-black mb-5 uppercase tracking-wider text-[11px] flex items-center">
                  <span className="w-2.5 h-2.5 border border-black mr-2.5 inline-block"></span>
                  Thông tin
                </h3>
                <ul className="space-y-3">
                  {[
                    { label: 'FAQs', href: '/faqs' },
                    { label: 'Điều khoản & Bảo mật', href: '/privacy' },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-black font-bold hover:underline underline-offset-[4px] decoration-1 transition-all text-[11px] uppercase tracking-wider"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-bold text-black mb-3 uppercase tracking-wider text-[11px]">Kết nối</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: FaXTwitter, href: 'https://twitter.com', label: 'Twitter' },
                    { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
                    { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
                    { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-8 h-8 border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
                    >
                      <social.icon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-5 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <p className="text-[9px] sm:text-[10px] text-black font-bold uppercase tracking-[0.15em]">
            © {currentYear} Bloai. Bản quyền thuộc về Bloai Team.
          </p>

          <div className="flex gap-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em]">
            <Link href="/privacy" className="text-black hover:underline underline-offset-[4px] decoration-1 transition-all">
              Bảo mật
            </Link>
            <Link href="/privacy" className="text-black hover:underline underline-offset-[4px] decoration-1 transition-all">
              Điều khoản
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;