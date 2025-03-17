import Link from 'next/link';
import React from 'react';
import { FaTwitter, FaGithub, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: <FaTwitter /> },
    { name: 'GitHub', href: '#', icon: <FaGithub /> },
    { name: 'LinkedIn', href: '#', icon: <FaLinkedinIn /> },
  ];

  return (
    <footer className="bg-gray-50 border-t-2 border-black/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
          <div className="md:col-span-4 lg:col-span-5 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
              <Link href="/">Bloai</Link>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Discover insightful articles on technology, design, and development.
              Stay updated with the latest trends and best practices.
            </p>
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 hover:underline underline-offset-4 transition-colors text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{social.name}</span>
                  <span className="text-2xl hover:scale-110 transition-transform">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-6">
          <p className="text-center text-sm text-gray-600">
            © {currentYear} Bloai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;