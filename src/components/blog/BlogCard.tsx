"use client";

import React from 'react';
import { Prisma } from '@prisma/client';
import { FaEye, FaBookOpen } from '@/components/icons';
import { formatDate } from '@/lib/dateUtils';
import { OptimizedImage } from '@/components/OptimizedImage';

type Blog = Prisma.BlogGetPayload<{
  include: {
    tags: true;
    author: true;
  };
}> & {};

interface BlogCardProps {
  blog: Blog;
  onClick?: () => void;
  isNavigating?: boolean;
  priority?: boolean;
}

export function BlogCard({ blog, onClick, isNavigating, priority = false }: BlogCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative h-full cursor-pointer ${isNavigating ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="group relative bg-white h-full flex flex-col border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          <OptimizedImage
            src={blog.imageUrl || ''}
            alt={blog.title ?? 'Blog post image'}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
            priority={priority}
            sizes="(max-width: 480px) calc(100vw - 32px), (max-width: 768px) calc(50vw - 24px), (max-width: 1280px) calc(33vw - 24px), 364px"
          />
          <div className="absolute top-3 left-3 flex gap-1 z-10">
            {blog.tags.slice(0, 1).map((tag) => (
              <span key={tag.id} className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col flex-grow p-5 bg-white">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 font-medium">
            <div>
              {formatDate(blog.publishDate, 'full')}
            </div>
          </div>

          <h2 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-snug">
            {blog.title}
          </h2>

          {blog.metaDescription && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
              {blog.metaDescription}
            </p>
          )}

          <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">{blog.author?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <FaBookOpen className="w-3.5 h-3.5 text-slate-400" />
                {blog.readTime ?? '?'} phút
              </span>
              <span className="flex items-center gap-1">
                <FaEye className="w-3.5 h-3.5 text-slate-400" />
                {blog.views >= 1000 ? `${(blog.views / 1000).toFixed(1)}k` : blog.views ?? 0} xem
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}