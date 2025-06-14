'use client';
import React from 'react';
import Link from 'next/link';
import Logo from './logo';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import { Star, ArrowRight } from 'lucide-react';

interface Social {
  Icon: React.ComponentType;
  href: string;
  name: string;
}

interface LinkItem {
  name: string;
  href: string;
}

interface FooterColumn {
  isBrandColumn?: boolean;
  title?: string;
  socials?: Social[];
  legalLinks?: LinkItem[];
  links?: LinkItem[];
  details?: string[];
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerData = {
    columns: [
      {
        isBrandColumn: true,
        socials: [
          { Icon: FaFacebookF, href: '#', name: 'Facebook' },
          { Icon: FaLinkedinIn, href: '#', name: 'LinkedIn' },
          { Icon: FaTwitter, href: '#', name: 'Twitter' },
          { Icon: FaYoutube, href: '#', name: 'YouTube' },
          { Icon: FaInstagram, href: '#', name: 'Instagram' },
        ] as Social[],
        legalLinks: [
          { name: 'Tài sản thương hiệu', href: '#' },
          { name: 'Cài đặt Cookie', href: '#' },
          { name: 'Chính sách Bảo mật', href: '#' },
          { name: 'Điều khoản dịch vụ', href: '#' },
          { name: 'Pháp lý', href: '#' },
        ] as LinkItem[],
      },
      {
        title: 'Sản phẩm',
        links: [
          { name: 'Công cụ AI', href: '#' },
          { name: 'Tối ưu SEO', href: '#' },
          { name: 'Kiếm tiền', href: '#' },
          { name: 'Tích hợp', href: '#' },
          { name: 'Bảng giá', href: '#' },
          { name: 'So sánh', href: '#' },
        ] as LinkItem[],
      },
      {
        title: 'Giải pháp',
        links: [
          { name: 'Cho doanh nghiệp', href: '#' },
          { name: 'Cho Agency', href: '#' },
          { name: 'Cho SEOer', href: '#' },
          { name: 'Cho Blogger', href: '#' },
          { name: 'Case study', href: '#' },
        ] as LinkItem[],
      },
      {
        title: 'Tài nguyên',
        links: [
          { name: 'Blog', href: '#' },
          { name: 'Hướng dẫn', href: '#' },
          { name: 'Tài liệu', href: '#' },
          { name: 'Webinar', href: '#' },
          { name: 'Cộng đồng', href: '#' },
        ] as LinkItem[],
      },
      {
        title: 'Công ty',
        links: [
          { name: 'Về chúng tôi', href: '#' },
          { name: 'Tuyển dụng', href: '#' },
          { name: 'Liên hệ', href: '#' },
          { name: 'Đối tác', href: '#' },
        ] as LinkItem[],
      },
      {
        title: 'Liên hệ',
        details: [
          'Công ty TNHH Bloai',
          'Lầu 5, Tòa nhà FutureTech',
          'Khu Công nghệ Cao, TP. Thủ Đức',
          'Email: support@bloai.com',
          'Hotline: 1900 1234',
        ] as string[],
      },
    ] as FooterColumn[],
    newsletter: {
      title: 'Đăng ký nhận bản tin',
      description: 'Nhận tin tức và ưu đãi độc quyền từ Bloai',
    },
    copyrightText: `© ${currentYear} Bloai. Bảo lưu mọi quyền.`,
  };

  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="py-12 border-b border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Bắt đầu trải nghiệm Bloai ngay hôm nay!
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Hàng ngàn doanh nghiệp đã sử dụng Bloai để tạo nội dung chất lượng và tăng trưởng bền vững.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link
                href="#"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm text-center"
              >
                Dùng thử miễn phí
              </Link>
              <Link
                href="#"
                className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg border border-gray-300 transition-colors shadow-sm text-center"
              >
                Xem bảng giá
              </Link>
            </div>
          </div>
        </div>

        <div className="py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            {footerData.columns.map((column, index) => (
              <div
                key={column.title || `brand-col-${index}`}
                className={column.isBrandColumn ? 'sm:col-span-2 lg:col-span-1' : ''}
              >
                {column.isBrandColumn ? (
                  <div className="space-y-6">
                    <Logo />
                    <p className="text-gray-600 text-sm">
                      Bloai - Nền tảng AI hàng đầu giúp bạn tạo nội dung chất lượng, tối ưu SEO và tăng thu nhập.
                    </p>
                    {column.socials && (
                      <div className="flex space-x-4">
                        {column.socials.map((social) => (
                          <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.name}
                            className="text-gray-500 hover:text-green-600 transition-colors p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                          >
                            <social.Icon />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 text-lg">{column.title}</h5>
                    {column.links ? (
                      <ul className="space-y-3">
                        {column.links.map((link) => (
                          <li key={link.name}>
                            <Link
                              href={link.href}
                              className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-start"
                            >
                              <ArrowRight className="h-3 w-3 mt-1 mr-2 text-green-500" />
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="space-y-2 text-sm text-gray-600">
                        {column.details?.map((detail, i) => (
                          <p key={i}>{detail}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 mb-4 md:mb-0">{footerData.copyrightText}</p>
              {footerData.columns[0]?.legalLinks && (
                <div className="flex flex-wrap justify-center gap-4">
                  {footerData.columns[0].legalLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;