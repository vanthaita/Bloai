"use client";

import React from 'react';
import Image from 'next/image';
import { FaEye, FaBookOpen } from '@/components/icons';
import { Prisma } from '@prisma/client';
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
      <div className="group relative bg-white h-full flex flex-col">
        <div className="relative aspect-video mb-4 overflow-hidden bg-gray-100">
          <OptimizedImage
            src={blog.imageUrl || ''}
            alt={blog.title ?? 'Blog post image'}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
            priority={priority}
            sizes="(max-width: 480px) calc(100vw - 32px), (max-width: 768px) calc(50vw - 24px), (max-width: 1280px) calc(33vw - 24px), 364px"
          />
        </div>

        <div className="flex flex-col flex-grow">
          <div className="flex items-center justify-between text-xs mb-2 font-bold uppercase tracking-wider">
            <div className="text-black">
              {blog.tags.slice(0, 1).map((tag) => (
                <span key={tag.id}>{tag.name}</span>
              ))}
            </div>
            <div className="text-gray-500 font-medium">
              {formatDate(blog.publishDate, 'full')}
            </div>
          </div>

          <h2 className="text-xl font-bold text-black group-hover:underline transition-all mb-2 line-clamp-3 leading-snug">
            {blog.title}
          </h2>

          {blog.metaDescription && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {blog.metaDescription}
            </p>
          )}

          <div className="mt-auto pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">{blog.author?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <FaBookOpen className="w-3 h-3" />
                {blog.readTime ?? '?'} min
              </span>
              <span className="flex items-center gap-1">
                <FaEye className="w-3 h-3" />
                {blog.views >= 1000 ? `${(blog.views / 1000).toFixed(1)}k` : blog.views ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}