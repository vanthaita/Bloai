import React from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { FaEye, FaHeart, FaBookOpen } from 'react-icons/fa';
import { Prisma } from '@prisma/client'; 


type Blog = Prisma.BlogGetPayload<{
  include: {
    tags: true;
    author: true;
  };
}> & {
};


interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <div className="group relative bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer border border-gray-100 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <CldImage
            width={600}
            height={400}
            src={blog.imageUrl ?? 'your-default-placeholder-public-id'}
            alt={blog.title ?? 'Blog post image'}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            crop="fill"
            gravity="auto"
            quality="auto:best"
            format="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id} 
                className={`px-3 py-1 text-white text-xs font-medium rounded-full backdrop-blur-sm`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#3A6B4C] transition-colors mb-2 line-clamp-2">
              {blog.title}
            </h2>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <FaBookOpen className="w-4 h-4 text-[#3A6B4C]" />
                  <span>{blog.readTime ?? '?'} min read</span>
                </span>
                <span className="hidden sm:inline">·</span>
                {blog.author && <span className="font-medium whitespace-nowrap">{blog.author.name}</span>}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1" title="Views">
                  <FaEye className="w-4 h-4 text-[#3A6B4C]" />
                  <span>{blog.views >= 1000 ? `${(blog.views / 1000).toFixed(1)}k` : blog.views ?? 0}</span>
                </div>
                <div className="flex items-center gap-1" title="Likes">
                  <FaHeart className="w-4 h-4 text-[#3A6B4C]" />
                  <span>{blog.likes ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-gray-400">
              {new Date(blog.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}