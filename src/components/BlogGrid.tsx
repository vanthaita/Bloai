'use client'
import React from 'react';
import { FaEye, FaHeart, FaComment, FaBookOpen } from 'react-icons/fa';
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import Link from 'next/link';
import { api } from '@/trpc/react';
import { CldImage } from 'next-cloudinary';
import Spinner from './Snipper';
type BlogGridProps = {
  expanded: boolean,
}

const tagColors: { [key: string]: string } = {
  'JavaScript': 'bg-amber-500/80',
  'AI': 'bg-purple-600/80',
  'React': 'bg-cyan-600/80',
  'Next.js': 'bg-black/80',
  'Web Dev': 'bg-emerald-600/80',
  'Featured': 'bg-rose-600/80',
  'Trending': 'bg-orange-500/80',
  'Technology': 'bg-blue-600/80'
};

const randomColors = [
  'bg-red-500/80',
  'bg-yellow-500/80',
  'bg-green-500/80',
  'bg-blue-500/80',
  'bg-indigo-500/80',
  'bg-pink-500/80',
  'bg-purple-500/80',
  'bg-teal-500/80',
  'bg-orange-500/80',
  'bg-gray-500/80'
];

const getRandomColor = () => {
  return randomColors[Math.floor(Math.random() * randomColors.length)];
};

export function BlogGrid({ expanded = false }: BlogGridProps) {
  const { data: blogs, isLoading, error } = api.blog.getAllBlog.useQuery({
    page: 1,
    limit: 15
  });


  if (isLoading) return (
    <div className='h-[calc(100vh-80px)] w-full flex justify-center items-center flex-col gap-2'>
      <Spinner />
      <h1 className='font-bold text-2xl'>BloAI</h1>
    </div>
  );

  if (error || !blogs) return <div>Error loading blogs</div>;

  return (
    <BentoGrid expanded={expanded} className="max-w-8xl mx-auto px-4">
      {blogs.map((blog) => (
        <Link href={`/blog/${blog.slug}`} key={blog.id}>
          <BentoGridItem className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer border border-gray-100 dark:border-gray-800">
            <div className="relative h-48 overflow-hidden">
              <CldImage
                width={600}
                height={400}
                src={blog.imageUrl || 'default-image-public-id'}
                alt={blog.title || 'Blog post image'}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                crop="fill"
                gravity="auto"
                quality="auto:best"
                format="auto"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />

              <div className="absolute top-3 left-3 flex gap-2">
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={`${tag.name}-${index}`}
                    className={`px-3 py-1 ${tagColors[tag.name] || getRandomColor()} text-white text-xs font-semibold rounded-full backdrop-blur-sm`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {blog.title}
              </h2>

              <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <FaBookOpen className="w-4 h-4" />
                  <span>{blog.readTime} min read</span>
                </span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                {blog.author && <span className="font-medium text-gray-700 dark:text-gray-300">{blog.author.name}</span>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <FaEye className="w-5 h-5 text-blue-500/80" />
                    <span>{blog.views >= 1000 ? `${(blog.views / 1000).toFixed(1)}k` : blog.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaHeart className="w-5 h-5 text-rose-500/80" />
                    <span>{blog.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaComment className="w-5 h-5 text-emerald-500/80" />
                    <span>0</span>
                  </div>
                </div>
                {blog.tags.some(tag => tag.name === 'Featured') && (
                  <div className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 text-xs font-medium rounded-full">
                    Featured
                  </div>
                )}
              </div>
            </div>

            {blog.tags.some(tag => tag.name === 'Trending') && (
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                TRENDING
              </div>
            )}
          </BentoGridItem>
        </Link>
      ))}
    </BentoGrid>
  );
}