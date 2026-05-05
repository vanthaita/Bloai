'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Brain, 
  Code, 
  Palette, 
  Rocket, 
  Database, 
  Smartphone,
  Cloud,
  Lock,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

interface Category {
  name: string;
  slug: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  bgColor: string;
}

const categories: Category[] = [
  {
    name: 'AI & Machine Learning',
    slug: 'ai-machine-learning',
    icon: <Brain className="h-6 w-6" />,
    count: 45,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100'
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    icon: <Code className="h-6 w-6" />,
    count: 67,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  {
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    icon: <Palette className="h-6 w-6" />,
    count: 32,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 hover:bg-pink-100'
  },
  {
    name: 'Startup & Business',
    slug: 'startup-business',
    icon: <Rocket className="h-6 w-6" />,
    count: 28,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100'
  },
  {
    name: 'Database',
    slug: 'database',
    icon: <Database className="h-6 w-6" />,
    count: 23,
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100'
  },
  {
    name: 'Mobile Development',
    slug: 'mobile-development',
    icon: <Smartphone className="h-6 w-6" />,
    count: 19,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100'
  },
  {
    name: 'Cloud & DevOps',
    slug: 'cloud-devops',
    icon: <Cloud className="h-6 w-6" />,
    count: 34,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 hover:bg-cyan-100'
  },
  {
    name: 'Security',
    slug: 'security',
    icon: <Lock className="h-6 w-6" />,
    count: 15,
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100'
  },
];

export function CategoriesSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-4">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Khám phá theo chủ đề</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Danh mục phổ biến
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tìm kiếm bài viết theo lĩnh vực bạn quan tâm
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/tags?tag=${category.slug}`}
              className={`group relative p-6 rounded-2xl border border-gray-200 ${category.bgColor} transition-all duration-300 hover:shadow-lg hover:scale-105`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`${category.color} transform group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {category.count} bài viết
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            href="/tags"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <Lightbulb className="h-5 w-5 text-green-600" />
            Xem tất cả danh mục
          </Link>
        </div>
      </div>
    </section>
  );
}
