'use client'

import React, { useMemo, useState } from 'react';
import { BentoGrid } from "../ui/bento-grid"; 
import { api } from '@/trpc/react';
import Loading from '../loading'; 
import { Button } from '../ui/button';
import { BlogFilterBar } from './BlogFilterBar';
import { BlogCard } from './BlogCard';
import Link from 'next/link';
import Pagination from '../Pagintion';
import { useSearchParams, useRouter } from 'next/navigation';
const LIMIT = 9;

export function BlogGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('');
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1');

  const { 
    data: tagsData, 
    isLoading: isTagsLoading, 
    error: tagsError 
  } = api.blog.getAllTags.useQuery({
    page: 1,
    limit: 13,
  });

  const blogsQuery = api.blog.getAllBlog.useQuery({
    page: currentPage,
    limit: LIMIT
  }, {
    enabled: !activeFilter, 
  });

  const blogsByTagQuery = api.blog.getBlogByTags.useQuery({
    page: currentPage,
    limit: LIMIT,
    tag: activeFilter
  }, {
    enabled: !!activeFilter,
  });

  const currentQuery = activeFilter ? blogsByTagQuery : blogsQuery;
  const currentBlogs = currentQuery.data?.blogs || [];
  const currentTotal = currentQuery.data?.total || 0;

  const handleCardClick = (slug: string) => {
    setNavigatingTo(slug);
  };

  const filterTags = useMemo(() => {
    if (!tagsData?.tags) return [];
    
    return tagsData.tags.map((tag) => ({
      label: tag.name,
      value: tag.name,
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [tagsData?.tags]);

  const totalPages = Math.ceil(currentTotal / LIMIT);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilter: string) => {
    setActiveFilter(newFilter);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const clearFilter = () => {
    setActiveFilter('');
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  if (isTagsLoading || (!currentQuery.data && currentQuery.isLoading)) {
    return <Loading />;
  }

  const error = blogsQuery.error || tagsError || blogsByTagQuery.error;
  if (error) {
    return (
      <div className='h-[calc(100vh-80px)] w-full flex justify-center items-center text-center px-4'>
        <p className="text-red-600 text-lg">
          {error ? `Error loading blogs: ${error.message}` : 'Could not load blog posts. Please try again later.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="px-4">
        <BlogFilterBar
          tags={filterTags}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          moreTagsLink="/tags" 
        />
      </div>
      
      {(blogsQuery.isFetching || blogsByTagQuery.isFetching) && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-background/90 border rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Updating content...</span>
          </div>
        </div>
      )}
      
      <BentoGrid className="px-4 pb-16">
        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog) => (
            <Link 
              href={`/blog/${blog.slug}`} 
              key={blog.id}
              onClick={() => handleCardClick(blog.slug)}
              className="hover:opacity-90 transition-opacity"
            >
              <BlogCard 
                blog={blog} 
                isNavigating={navigatingTo === blog.slug}
              />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            {activeFilter
              ? `No blog posts found for the tag "${activeFilter.replace(/-/g, ' ')}".`
              : 'No blog posts found.'}
            {activeFilter && (
              <Button 
                variant="link" 
                onClick={clearFilter} 
                className="ml-2 text-primary"
              >
                Clear filter
              </Button>
            )}
          </div>
        )}
      </BentoGrid>
      
      {totalPages > 0 && (
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