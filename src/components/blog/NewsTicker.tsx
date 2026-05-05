'use client';
import { api } from '@/trpc/react';
import Link from 'next/link';

export function NewsTicker() {
  const { data } = api.blog.getAllBlog.useQuery({ limit: 5 });
  const blogs = data?.blogs || [];

  if (blogs.length === 0) return null;

  return (
    <div className="bg-black text-white flex overflow-hidden whitespace-nowrap text-xs font-bold uppercase tracking-wider">
      <div className="px-4 py-2 bg-black z-10 flex items-center border-r border-gray-600 shrink-0">
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        TIN MỚI
      </div>
      
      <div className="flex items-center flex-1 overflow-hidden relative group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
          {/* We duplicate the content to create a seamless loop */}
          {[...blogs, ...blogs].map((blog, idx) => (
            <Link 
              key={`${blog.id}-${idx}`} 
              href={`/blog/${blog.slug}`} 
              className="hover:text-gray-300 transition-colors mx-8 shrink-0 flex items-center"
            >
              <span className="text-gray-400 mr-2 font-medium">
                {new Date(blog.publishDate).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
              </span>
              {blog.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
