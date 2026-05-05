'use client';

import React, { useState } from 'react';
import { Search, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic
    console.log('Search:', searchQuery);
  };

  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 md:py-16 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-green-200 shadow-sm">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Khám phá kiến thức AI & Công nghệ
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Nơi chia sẻ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              kiến thức
            </span>
            <br />
            và trải nghiệm
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Bài viết sâu sắc về công nghệ, thiết kế và phát triển. 
            Khám phá tương lai AI cùng Bloai.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết, chủ đề..."
                className="w-full pl-14 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-lg hover:shadow-xl transition-shadow"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white font-medium rounded-xl transition-colors"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <span className="text-sm text-gray-500">Phổ biến:</span>
            {['AI', 'Machine Learning', 'Web Development', 'Design'].map((tag) => (
              <Link
                key={tag}
                href={`/tags?tag=${tag.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-full transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
