// components/HeroSection.tsx
import React from 'react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-white text-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-[80vh] flex flex-col justify-center items-center text-center py-16 md:py-24 lg:py-32">
        {/* Optional: Announcement Banner */}
        {false && (
          <div className="mb-6 md:mb-8">
            <Link 
              href="/new-feature" 
              className="inline-flex items-center justify-between px-4 py-2 mb-7 text-sm text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors" 
              role="alert"
            >
              <span className="text-xs bg-green-600 rounded-full text-white px-3 py-1 mr-3">Mới!</span>
              <span className="text-sm font-medium">Giới thiệu Bloai 2.0: Mạnh mẽ hơn, Thông minh hơn!</span>
              <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
            </Link>
          </div>
        )}

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Cách Mạng Hóa Blogging <br className="hidden md:inline" />
          <span className="block text-green-600 xl:inline">Bằng Sức Mạnh AI</span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 mb-8 md:mb-10">
          Bloai là nền tảng tối thượng giúp bạn tạo nội dung blog chuẩn SEO, tối ưu hóa kiếm tiền (MMO)
          và nhân rộng cỗ máy thu nhập thụ động - tất cả nhờ Trí Tuệ Nhân Tạo tiên tiến.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/get-started"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-green-600 rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Bắt đầu Miễn phí Ngay
          </Link>
          <Link
            href="/see-demo"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-green-600 bg-white rounded-lg border-2 border-green-600 hover:bg-green-50 transition duration-150 ease-in-out shadow-sm"
          >
            Xem Demo
          </Link>
        </div>

        {/* Social Proof */}
        <div className="mt-10 md:mt-12">
          <div className="flex flex-col items-center">
            <div className="flex -space-x-2 overflow-hidden mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <img 
                  key={i}
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                  src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i+20}.jpg`}
                  alt="User avatar"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Đã được tin dùng bởi <strong className="text-gray-700">10,000+</strong> nhà sáng tạo nội dung
            </p>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  className="w-4 h-4 text-yellow-400" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
              <span className="ml-1 text-sm text-gray-600">4.8/5 (500+ đánh giá)</span>
            </div>
          </div>
        </div>

        {/* Product Screenshot */}
        <div className="mt-12 lg:mt-16 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Bloai AI Dashboard"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;