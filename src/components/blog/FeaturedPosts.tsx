// Server Component — no 'use client' directive.
// This allows Next.js to emit <link rel="preload"> for the LCP hero image
// in the server-rendered HTML, fixing the "LCP request discovery" audit.

import React from 'react';
import Image from 'next/image';
import { FaEye, FaBookOpen, FaClock } from '@/components/icons';
import { TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Prisma } from '@prisma/client';
import { formatDate } from '@/lib/dateUtils';

type Blog = Prisma.BlogGetPayload<{
  include: {
    tags: true;
    author: true;
  };
}>;

interface FeaturedPostsProps {
  posts: Blog[];
}

/**
 * Build a Cloudinary-optimised URL from either a public ID or an already-full URL.
 * Falls back to a placeholder if src is empty.
 * Uses manual URL construction to ensure consistent server/client rendering.
 */
function buildCldUrl(
  src: string | null | undefined,
  width: number,
  height: number,
  quality = 'auto:eco',
): string {
  if (!src) {
    return `https://res.cloudinary.com/dq2z27agv/image/upload/w_${width},h_${height},c_fill,g_auto,q_auto,f_webp/default-placeholder`;
  }
  // If it's already a full URL (from another CDN / Unsplash etc.) return as-is
  if (src.startsWith('http')) return src;
  // Cloudinary public ID → construct optimised URL manually for consistency
  return `https://res.cloudinary.com/dq2z27agv/image/upload/w_${width},h_${height},c_fill,g_auto,q_${quality},f_webp/${src}`;
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (!posts || posts.length === 0) return null;

  const mainPost = posts[0];
  if (!mainPost) return null;

  const sidePosts = posts.slice(1, 3);

  const heroUrl = buildCldUrl(mainPost.imageUrl, 800, 450, 'auto:eco');

  return (
    <section className="pt-24 pb-8 lg:pt-32 lg:pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 min-[375px]:px-6 md:px-8 w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-black">
          <h2 className="text-2xl md:text-3xl font-extrabold text-black uppercase tracking-tight">
            Tiêu điểm
          </h2>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 text-black hover:underline font-bold transition-all uppercase text-sm"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Featured Post — LCP candidate */}
          <Link
            href={`/blog/${mainPost.slug}`}
            className="lg:col-span-8 group flex flex-col"
          >
            <div className="relative aspect-video lg:aspect-[16/9] mb-4 overflow-hidden bg-gray-100">
              <Image
                src={heroUrl}
                alt={mainPost.title ?? 'Featured post'}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>

            <div className="flex flex-col flex-grow">
              <div className="flex items-center gap-4 mb-3 text-xs font-bold uppercase tracking-wider">
                <div className="flex gap-2 text-black">
                  {mainPost.tags.slice(0, 2).map((tag) => (
                    <span key={tag.id}>{tag.name}</span>
                  ))}
                </div>
                <div className="text-gray-500 font-medium">
                  {formatDate(mainPost.publishDate, 'full')}
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 group-hover:underline transition-all line-clamp-3 leading-tight text-black">
                {mainPost.title}
              </h3>

              <p className="text-gray-700 text-base lg:text-lg mb-6 line-clamp-3">
                {mainPost.metaDescription || 'Khám phá nội dung thú vị trong bài viết này...'}
              </p>

              <div className="mt-auto flex items-center gap-4 text-sm font-medium text-gray-500 pt-4 border-t border-gray-200">
                {mainPost.author && (
                  <span className="text-gray-900">{mainPost.author.name}</span>
                )}
                <span className="flex items-center gap-1">
                  <FaBookOpen className="h-3 w-3" />
                  {mainPost.readTime} min
                </span>
                <span className="flex items-center gap-1">
                  <FaEye className="h-3 w-3" />
                  {mainPost.views >= 1000 ? `${(mainPost.views / 1000).toFixed(1)}k` : mainPost.views}
                </span>
              </div>
            </div>
          </Link>

          {/* Side Featured Posts — lazy loaded */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {sidePosts.map((post, index) => {
              const sideUrl = buildCldUrl(post.imageUrl, 400, 250, 'auto:eco');
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={`group flex flex-col sm:flex-row lg:flex-col gap-4 pb-6 ${
                    index !== sidePosts.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="relative aspect-video sm:w-48 lg:w-full flex-shrink-0 overflow-hidden bg-gray-100">
                    <Image
                      src={sideUrl}
                      alt={post.title ?? 'Featured post'}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 192px, 33vw"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      <span className="text-black">
                        {post.tags[0]?.name}
                      </span>
                      <span className="text-gray-500 font-medium">
                        {formatDate(post.publishDate, 'short')}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold text-black group-hover:underline transition-all line-clamp-3 mb-3 leading-snug">
                      {post.title}
                    </h4>

                    <div className="mt-auto flex items-center gap-3 text-xs text-gray-500 font-medium">
                      {post.author && (
                        <span className="text-gray-800">{post.author.name}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <FaClock className="h-3 w-3" />
                        {post.readTime} min
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
