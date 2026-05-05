'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Logo from './logo';
import { FaGithub, FaFacebook, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribe:', email);
  };

  return (
    <footer className="bg-white text-black border-t-2 border-black mt-12 max-w-[100vw] overflow-x-hidden">
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
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-black" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Địa chỉ Email"
                    className="w-full pl-9 pr-3 py-2 border border-black border-r-0 rounded-none focus:outline-none focus:bg-gray-50 text-xs bg-white text-black placeholder:text-gray-500 font-medium transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white font-bold rounded-none hover:bg-white hover:text-black transition-colors text-[10px] uppercase tracking-wider whitespace-nowrap border border-black"
                >
                  Đăng ký
                </button>
              </form>
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
                {['Trang chủ', 'Danh mục', 'Về chúng tôi'].map((item, idx) => (
                  <li key={idx}>
                    <Link 
                      href={item === 'Trang chủ' ? '/' : item === 'Danh mục' ? '/tags' : '/about'} 
                      className="text-black font-bold hover:underline underline-offset-[4px] decoration-1 transition-all text-[11px] uppercase tracking-wider"
                    >
                      {item}
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
                  {['FAQs', 'Điều khoản & Bảo mật'].map((item, idx) => (
                    <li key={idx}>
                      <Link 
                        href={item === 'FAQs' ? '/faqs' : '/privacy'} 
                        className="text-black font-bold hover:underline underline-offset-[4px] decoration-1 transition-all text-[11px] uppercase tracking-wider"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Links Boxy Style */}
              <div>
                <h3 className="font-bold text-black mb-3 uppercase tracking-wider text-[11px]">Kết nối</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: FaXTwitter, href: "https://twitter.com", label: "Twitter" },
                    { icon: FaGithub, href: "https://github.com", label: "GitHub" },
                    { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
                    { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" }
                  ].map((social, idx) => (
                    <a
                      key={idx}
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