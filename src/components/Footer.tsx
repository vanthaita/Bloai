import Link from 'next/link';
import { FaTwitter, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import Logo from './logo'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'Trang chủ', href: '/landing' },
    { name: 'Danh mục', href: '/tags' },
    { name: 'Về chúng tôi', href: '/about' },
    { name: 'Liên hệ', href: '/contact' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Điều khoản & Chính sách bảo mật', href: '/privacy' },
  ];

  const socials = [
    { name: 'Twitter', href: 'https://x.com/Bloai_Team', icon: <FaTwitter /> },
    { name: 'GitHub', href: 'https://github.com/TDevUIT/Bloai', icon: <FaGithub /> },
    { name: 'LinkedIn', href: '#', icon: <FaLinkedinIn /> }, 
  ];
  
  
  const recommendedTools = [
    {
      name: 'CopyAI',
      href: 'https://www.copy.ai/',
      description: 'Công cụ viết content AI cho marketing'
    },
    {
      name: 'Jasper',
      href: 'https://www.jasper.ai/',
      description: 'Trợ lý viết bài AI đa năng'
    },
    {
      name: 'Synthesia',
      href: 'https://www.synthesia.io/',
      description: 'Tạo video AI từ văn bản'
    },
    {
      name: 'Descript',
      href: 'https://www.descript.com/',
      description: 'Chỉnh sửa video/podcast bằng AI'
    },
  ];

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bloai Team",
    "url": "https://www.bloai.blog/",
    "logo": "https://yourdomain.com/images/logo.png",
    "description": "Bài viết sâu sắc về công nghệ, thiết kế và phát triển. Khám phá tương lai AI cùng Bloai.",
    "sameAs": socials
      .filter(social => social.href !== '#')
      .map(social => social.href),
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@yourdomain.com",
      "contactType": "customer service"
    }
  };

  const toolSchemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": recommendedTools.map((tool, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "WebApplication",
        "name": tool.name,
        "url": tool.href,
        "description": tool.description,
        "applicationCategory": "AI Writing Tool",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/OnlineOnly"
        }
      }
    }))
  };

  return (
    <>
     <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchemaMarkup) }}
      />
      <footer className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-10 md:mb-12">

            <div className="space-y-4 col-span-2 lg:col-span-2">
              <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
                <Logo />
              </Link>
              <p className="text-base ">
                Bài viết sâu sắc về công nghệ, thiết kế và phát triển. Khám phá tương lai AI cùng Bloai.
              </p>
            </div>

            <div className="md:pl-4 lg:pl-0">
              <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="  hover:underline text-base transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold  mb-4">Công cụ AI</h3>
              <ul className="space-y-4"> 
                {recommendedTools.map((tool) => (
                  <li key={tool.name}>
                    <Link 
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group" 
                    >
                      <span className="text-base  group- group-hover:underline transition-colors">
                        {tool.name}
                      </span>
                      <span className="block text-sm text-gray-400 mt-1 group-hover: transition-colors">
                        {tool.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-semibold  mb-4">Kết nối</h3>
              <div className="flex gap-x-5"> 
                {socials.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="  text-2xl transition-colors"
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20 text-center text-base text-gray-400">
            © {currentYear} Bloai Team. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;