'use client'

import React, { useMemo, useState, Suspense } from 'react';
import { BentoGrid } from "../ui/bento-grid"; 
import { api } from '@/trpc/react';
import Pagination from '../Pagintion'; 
import Loading from '../loading'; 
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { BlogFilterBar } from './BlogFilterBar';
import { BlogCard } from './BlogCard';
import Link from 'next/link';

const LIMIT = 9;

export function BlogGrid() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('');
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const { data: blogData, isLoading, error, isFetching } = api.blog.getAllBlog.useQuery({
    page: currentPage,
    limit: LIMIT
  });

  const handleCardClick = (slug: string) => {
    setNavigatingTo(slug);
  };

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

  const filteredBlogs = useMemo(() => {
    if (!blogData?.blogs) return [];
    if (!activeFilter) return blogData.blogs;

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

  if (isLoading) return <Loading />;

  if (error || !blogData) {
    return (
      <div className='h-[calc(100vh-80px)] w-full flex justify-center items-center text-center px-4'>
        <p className="text-red-600 text-lg">
          {error ? `Error loading blogs: ${error.message}` : 'Could not load blog posts. Please try again later.'}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(blogData.total / LIMIT);

  return (
    <>
      <div className="pt-4 px-4 text-center">
          <BlogFilterBar
            tags={filterTags}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            moreTagsLink="/tags" 
          />
      </div>
      {isFetching && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-background/90 border rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"> </div>
            <span className="text-sm font-medium">Updating content...</span>
          </div>
        </div>
      )}
      <BentoGrid className="px-4 pb-16">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
              <div 
                key={blog.id}
              >
                <Link 
                  href={`/blog/${blog.slug}`} 
                  onClick={() => {handleCardClick(blog.slug);}}>
                    <BlogCard 
                      blog={blog} 
                      isNavigating={navigatingTo === blog.slug}
                    />
                </Link>
              </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            {activeFilter
              ? `No blog posts found for the tag "${activeFilter.replace(/-/g, ' ')}".`
              : 'No blog posts found.'}
            {activeFilter && (
              <Button variant="link" onClick={() => setActiveFilter('')} className="ml-2">
                Clear filter
              </Button>
            )}
          </div>
        )}
      </BentoGrid>
      {totalPages > 1 && (
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