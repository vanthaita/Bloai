'use client'
import React, { useMemo, useState } from 'react';
import { FaEye, FaHeart, FaBookOpen } from 'react-icons/fa';
import { BentoGrid } from "./ui/bento-grid";
import Link from 'next/link';
import { api } from '@/trpc/react';
import { CldImage } from 'next-cloudinary';
import Spinner from './Snipper';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Pagination from './Pagintion';
import Loading from './loading';

type BlogGridProps = {
  expanded: boolean,
}

const tagColors: { [key: string]: string } = {
  'Career in Japan': 'bg-[#3A6B4C]',
  'Tech Interviews': 'bg-[#2B463C]',
  'Visa Guide': 'bg-[#4F7359]',
  'Japanese Culture': 'bg-[#5A7C6C]',
  'Startups': 'bg-[#6B8E7C]',
  'Web Development': 'bg-[#3A6B4C]',
  'AI': 'bg-[#2B463C]',
  'Remote Work': 'bg-[#4F7359]',
  'Language Tips': 'bg-[#5A7C6C]',
  'Industry Trends': 'bg-[#6B8E7C]'
};

const LIMIT = 6;

export function BlogGrid({ expanded = false }: BlogGridProps) {
  const [currentPage, setCurrentPage] = useState(1); 
  const { data: blogData, isLoading, error } = api.blog.getAllBlog.useQuery({
    page: currentPage,
    limit: LIMIT
  });
  const [activeFilter, setActiveFilter] = useState('');

  const filterTags = useMemo(() => {
    if (!blogData?.blogs || blogData.blogs.length === 0) {
      return [];
    }
    const allTagNames = blogData.blogs.flatMap((blog) => blog.tags.map((tag) => tag.name));
    const uniqueTagNames = Array.from(new Set(allTagNames));
    return uniqueTagNames.map((tagName) => ({
      label: tagName,
      value: tagName.toLowerCase().replace(/ /g, '-'),
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [blogData?.blogs]);

  const filteredBlogs = React.useMemo(() => {
    if (!blogData?.blogs) return [];

    if (!activeFilter) {
      return blogData.blogs;
    }

    return blogData.blogs.filter(blog =>
      blog.tags.some(tag =>
        tag.name.toLowerCase().replace(/ /g, '-') === activeFilter
      )
    );
  }, [blogData?.blogs, activeFilter]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); 
  };

  if (isLoading) return (
    <Loading />
  );

  if (error || !blogData) return (
      <div className='h-[calc(100vh-80px)] w-full flex justify-center items-center text-center px-4'>
        <p className="text-red-600 text-lg">
            {error ? `Error loading blogs: ${error.message}` : 'Could not load blog posts. Please try again later.'}
        </p>
      </div>
    );

  const totalPages = Math.ceil(blogData.total / LIMIT);

  return (
    <>
      <div className="pt-4 px-4 text-center">
        <div className="">
          {filterTags.length > 0 && (
             <div className="flex flex-wrap justify-center gap-3 mb-12">
             {filterTags.slice(0, 12).map((tag) => (
               <Button
                 key={tag.value}
                 variant={'outline'}
                 size="sm"
                 className={cn(
                   "rounded-full h-auto py-1.5 px-4 font-medium transition-all border-[#D1D5DB] text-gray-900 hover:bg-gray-100",
                   activeFilter === tag.value && 'bg-[#3A6B4C] text-white border-[#3A6B4C] hover:bg-[#3A6B4C]/90'
                 )}
                 onClick={() => setActiveFilter(prev => prev === tag.value ? '' : tag.value)}
               >
                 {tag.label}
               </Button>
             ))}
             <Link href='/categories'>
             <Button
                 variant={'outline'}
                 size="sm"
                 className={cn(
                   "rounded-full h-auto py-1.5 px-4 font-medium transition-all border-[#D1D5DB] text-gray-900 hover:bg-gray-100 underline",
                 )}
               >
                 + More
               </Button>
             </Link>
           </div>
          )}
        </div>
      </div>

      <BentoGrid expanded={expanded} className="px-4 pb-16">
        {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
                <Link href={`/blog/${blog.slug}`} key={blog.id} legacyBehavior={false}>
                <div className="group relative bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer border border-gray-100 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                    <CldImage
                        width={600}
                        height={400}
                        src={blog.imageUrl || 'your-default-placeholder-public-id'}
                        alt={blog.title || 'Blog post image'}
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
                            key={tag.name}
                            className={`px-3 py-1 ${tagColors[tag.name] || 'bg-gray-800/80'} text-white text-xs font-medium rounded-full backdrop-blur-sm`}
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
                                <span>{blog.readTime} min read</span>
                                </span>
                                <span className="hidden sm:inline">·</span>
                                {blog.author && <span className="font-medium whitespace-nowrap">{blog.author.name}</span>}
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="flex items-center gap-1" title="Views">
                                <FaEye className="w-4 h-4 text-[#3A6B4C]" />
                                <span>{blog.views >= 1000 ? `${(blog.views / 1000).toFixed(1)}k` : blog.views}</span>
                                </div>
                                <div className="flex items-center gap-1" title="Likes">
                                <FaHeart className="w-4 h-4 text-[#3A6B4C]" />
                                <span>{blog.likes}</span>
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
            ))
        ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
                No blog posts found{activeFilter ? ` for the tag "${activeFilter.replace(/-/g, ' ')}"` : ''}.
            </div>
        )}
      </BentoGrid>

      {blogData && totalPages > 1 && (
        <div className="max-w-7xl mx-auto my-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}