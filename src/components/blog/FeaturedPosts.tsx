// Server Component — no 'use client' directive.
// This allows Next.js to emit <link rel="preload"> for the LCP hero image
// in the server-rendered HTML, fixing the "LCP request discovery" audit.

import React from 'react';
import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { FaEye, FaBookOpen, FaClock } from '@/components/icons';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import { OptimizedImage } from '@/components/OptimizedImage';

type Blog = Prisma.BlogGetPayload<{
  include: {
    tags: true;
    author: true;
  };
}>;

interface FeaturedPostsProps {
  posts: Blog[];
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (!posts || posts.length === 0) return null;

  const mainPost = posts[0];
  if (!mainPost) return null;

  const sidePosts = posts.slice(1, 3);

  return (
    <section className="pt-24 pb-8 lg:pt-28 lg:pb-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 min-[375px]:px-6 md:px-8 w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Bài viết tiêu điểm
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-sm"
          >
            Xem tất cả bài viết
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Featured Post — LCP candidate */}
          <Link
            href={`/blog/${mainPost.slug}`}
            className="lg:col-span-8 group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative aspect-video lg:aspect-[16/9] w-full overflow-hidden bg-slate-100">
              <OptimizedImage
                src={mainPost.imageUrl || ''}
                alt={mainPost.title ?? 'Featured post'}
                fill
                className="object-cover transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                {mainPost.tags.slice(0, 2).map((tag) => (
                  <span key={tag.id} className="bg-blue-600/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col flex-grow p-6 md:p-8 bg-white">
              <div className="flex items-center gap-3 mb-3 text-xs text-slate-500 font-medium">
                <div>{formatDate(mainPost.publishDate, 'full')}</div>
              </div>

              <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight text-slate-900">
                {mainPost.title}
              </h3>

              <p className="text-slate-600 text-sm md:text-base mb-6 line-clamp-2 leading-relaxed">
                {mainPost.metaDescription || 'Khám phá nội dung thú vị trong bài viết này...'}
              </p>

              <div className="mt-auto flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                {mainPost.author && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{mainPost.author.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <FaBookOpen className="h-3 w-3 text-slate-400" />
                    {mainPost.readTime} phút
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye className="h-3 w-3 text-slate-400" />
                    {mainPost.views >= 1000 ? `${(mainPost.views / 1000).toFixed(1)}k` : mainPost.views} lượt xem
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Side Featured Posts — lazy loaded */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {sidePosts.map((post) => {
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col sm:flex-row lg:flex-col gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="relative aspect-video sm:w-40 lg:w-full flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <OptimizedImage
                      src={post.imageUrl || ''}
                      alt={post.title ?? 'Featured post'}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 192px, calc(33vw - 32px)"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {post.tags[0] && (
                          <span className="bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {post.tags[0].name}
                          </span>
                        )}
                        <span className="text-slate-400 text-[11px]">
                          {formatDate(post.publishDate, 'short')}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
                        {post.title}
                      </h4>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-50">
                      {post.author && (
                        <span className="font-medium text-slate-700">{post.author.name}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <FaClock className="h-3.5 w-3.5 text-slate-400" />
                        {post.readTime} phút
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
