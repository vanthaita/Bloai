// components/AboutSection.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Lucide Icons
import { Lightbulb, Users, ShieldCheck, Sparkles, ArrowRight, Rocket, FileText, BarChart2, Smile } from 'lucide-react';
// React Icons
import { FaRegLightbulb, FaUsers, FaShieldAlt, FaMagic } from 'react-icons/fa';

interface CoreValue {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  iconLibrary: 'lucide' | 'react-icons';
}

const AboutSection: React.FC = () => {
  const stats = [
    { value: '10,000+', label: 'Người dùng', icon: Users },
    { value: '1M+', label: 'Bài viết tạo mỗi tháng', icon: FileText },
    { value: '4.8/5', label: 'Đánh giá từ khách hàng', icon: BarChart2 },
    { value: '95%', label: 'Tỉ lệ hài lòng', icon: Smile },
  ];

  const coreValues: CoreValue[] = [
    {
      icon: Lightbulb,
      title: 'Đổi Mới Sáng Tạo',
      description: 'Áp dụng công nghệ AI tiên tiến nhất để mang lại giải pháp đột phá trong sáng tạo nội dung.',
      color: 'text-purple-600',
      iconLibrary: 'lucide'
    },
    {
      icon: FaUsers,
      title: 'Trao Quyền Cho Người Dùng',
      description: 'Giúp mọi người ở mọi trình độ có thể thành công trong việc tạo và kiếm tiền từ blog.',
      color: 'text-blue-600',
      iconLibrary: 'react-icons'
    },
    {
      icon: ShieldCheck,
      title: 'Chất Lượng & Tin Cậy',
      description: 'Nền tảng ổn định, an toàn với nội dung AI tạo ra đạt chất lượng cao nhất.',
      color: 'text-green-600',
      iconLibrary: 'lucide'
    },
    {
      icon: FaMagic,
      title: 'Minh Bạch & Đạo Đức',
      description: 'Tuân thủ các nguyên tắc đạo đức trong phát triển AI và minh bạch trong hoạt động.',
      color: 'text-amber-600',
      iconLibrary: 'react-icons'
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-full mb-4">
            <Rocket className="w-4 h-4 mr-1" />
            Về Bloai
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Cách mạng hóa sáng tạo nội dung với <span className="text-green-600">AI tiên tiến</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Bloai kết hợp sức mạnh AI với kiến thức chuyên sâu về SEO và kiếm tiền online,
            giúp bạn tạo nội dung chất lượng và xây dựng cỗ máy thu nhập thụ động.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100 hover:border-green-200 transition-colors"
              >
                <div className="flex justify-center mb-3">
                  <Icon className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;