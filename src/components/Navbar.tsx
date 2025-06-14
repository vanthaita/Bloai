'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, LogIn, Rocket } from 'lucide-react';
import Logo from './logo';

interface NavLink {
  href: string;
  label: string;
  subLinks?: NavLink[]; 
}

const navLinks: NavLink[] = [
  { href: '/product', label: 'Sản phẩm' },
  { 
    href: '/solutions', 
    label: 'Giải pháp',
    subLinks: [
      { href: '/solutions/seo', label: 'SEO Content' },
      { href: '/solutions/marketing', label: 'Marketing' },
      { href: '/solutions/agency', label: 'Cơ quan' }
    ]
  },
  { href: '/resources', label: 'Tài nguyên' },
  { href: '/pricing', label: 'Giá' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) setOpenSubMenu(null);
  };

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-white shadow-sm transition-all duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <div className="flex items-center">
                  <Link
                    href={link.href}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-700 transition-colors flex items-center"
                  >
                    {link.label}
                    {link.subLinks && (
                      <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                </div>
                
                {link.subLinks && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-gray-100 text-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top">
                    <div className="py-1">
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.label}
                          href={subLink.href}
                          className="block px-4 py-2 text-sm hover:bg-green-50 hover:text-green-700 transition-colors"
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-700 transition-colors flex items-center"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Đăng nhập
            </Link>
            <Link
              href="/get-started"
              className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-green-700 hover:bg-green-800 transition-colors shadow flex items-center"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Bắt đầu ngay
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-700 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <div key={link.label}>
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    onClick={() => !link.subLinks && setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                  {link.subLinks && (
                    <button 
                      onClick={() => toggleSubMenu(link.label)}
                      className="p-2"
                    >
                      <ChevronDown 
                        className={`h-5 w-5 transition-transform ${openSubMenu === link.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>
                
                {link.subLinks && openSubMenu === link.label && (
                  <div className="ml-4 mt-1 space-y-1">
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={subLink.label}
                        href={subLink.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-green-700 hover:bg-gray-50 transition-colors"
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="pt-4 pb-2 border-t border-gray-200 space-y-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-700 hover:bg-gray-50 transition-colors"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Đăng nhập
              </Link>
              <Link
                href="/get-started"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-3 py-2 rounded-md text-base font-semibold text-white bg-green-700 hover:bg-green-800 transition-colors shadow"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Bắt đầu ngay
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;