'use client'

import React, { useMemo, useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Button } from '../ui/button';

import { BlogCard } from './BlogCard';
import { BlogGridSkeleton } from './BlogCardSkeleton';
import Link from 'next/link';
import Pagination from '../Pagintion';
import { BackToTop } from '../BackToTop';
import { InlineNewsletter } from './InlineNewsletter';
import { useSearchParams, useRouter } from 'next/navigation';
const LIMIT = 9;

export function BlogGrid({ initialTag }: { initialTag?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tagParam = searchParams.get('tag') || initialTag;
  const [activeFilter, setActiveFilter] = useState(tagParam || '');
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  useEffect(() => {
    setActiveFilter(searchParams.get('tag') || initialTag || '');
  }, [searchParams, initialTag]);

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



  const totalPages = Math.ceil(currentTotal / LIMIT);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    if (newPage <= 1) {
      params.delete('page');
    } else {
      params.set('page', newPage.toString());
    }
    router.push(`?${params.toString()}`, { scroll: false });
    
    const element = document.getElementById('latest-news');
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setActiveFilter(newFilter);
    const params = new URLSearchParams(searchParams);
    params.delete('page'); // Reset to page 1 = clean URL
    if (newFilter) {
      params.set('tag', newFilter);
    } else {
      params.delete('tag');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilter = () => {
    setActiveFilter('');
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    params.delete('tag');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (isTagsLoading || (!currentQuery.data && currentQuery.isLoading)) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        <BlogGridSkeleton />
      </div>
    );
  }

  const error = blogsQuery.error || tagsError || blogsByTagQuery.error;
  if (error) {
    return (
      <div className='h-[calc(100vh-80px)] w-full flex justify-center items-center text-center px-4'>
        <div className="max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">
            {error ? `${error.message}` : 'Không thể tải bài viết. Vui lòng thử lại sau.'}
          </p>
          <Button onClick={() => window.location.reload()} className="bg-black text-white hover:bg-gray-800 rounded-none border-[1.5px] border-black">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>

      
      {/* Category Filter Tabs */}
      {tagsData && tagsData.tags.length > 0 && (
        <div className="w-full overflow-x-auto pb-4 mb-4 scroll-custom">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={clearFilter}
              className={`px-4 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest border-[1.5px] border-black rounded-none transition-colors ${
                !activeFilter ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              Tất cả
            </button>
            {tagsData.tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleFilterChange(tag.name)}
                className={`px-4 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest border-[1.5px] border-black rounded-none transition-colors ${
                  activeFilter === tag.name ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 px-0 pb-16 pt-8 border-t-2 border-black">
        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog, index) => (
            <React.Fragment key={blog.id}>
              {/* Inject Newsletter at index 4 (after 4 posts) */}
              {index === 4 && (
                <InlineNewsletter />
              )}
              <Link 
                href={`/blog/${blog.slug}`} 
                onClick={() => handleCardClick(blog.slug)}
                className="block h-full group"
              >
                <BlogCard 
                  blog={blog} 
                  isNavigating={navigatingTo === blog.slug}
                  priority={index < 4}
                />
              </Link>
            </React.Fragment>
          ))
        ) : (
          <div className="col-span-full text-center py-16 border-b border-black">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-widest">
              {activeFilter ? 'Không tìm thấy bài viết' : 'Chưa có bài viết nào'}
            </h3>
            <p className="text-gray-600 mb-4 font-medium">
              {activeFilter
                ? `Không có bài viết nào với tag "${activeFilter.replace(/-/g, ' ')}".`
                : 'Hãy quay lại sau để xem nội dung mới.'}
            </p>
            {activeFilter && (
              <Button 
                onClick={clearFilter} 
                className="bg-black text-white hover:bg-gray-800 rounded-none border border-black uppercase tracking-widest text-xs font-bold"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        )}
      </div>
      
      {totalPages > 0 && (
        <div className="w-full my-4 flex flex-col items-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Back To Top Button */}
      <BackToTop />
    </>
  );
}