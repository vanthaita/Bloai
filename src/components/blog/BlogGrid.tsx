'use client'

import React, { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Button } from '../ui/button';
import { BlogCard } from './BlogCard';
import { BlogGridSkeleton } from './BlogCardSkeleton';
import Link from 'next/link';
import Pagination from '../Pagintion';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';

// Lazy load non-critical components to reduce initial bundle
const BackToTop = dynamic(() => import('../BackToTop').then(mod => ({ default: mod.BackToTop })), {
  ssr: false,
  loading: () => null
});

const InlineNewsletter = dynamic(() => import('./InlineNewsletter').then(mod => ({ default: mod.InlineNewsletter })), {
  ssr: false,
  loading: () => <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3 h-64 bg-gray-100 animate-pulse rounded" />
});

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

    // Use scrollIntoView instead of getBoundingClientRect+scrollTo to avoid
    // forced reflow (a Lighthouse "long main-thread task" culprit).
    const element = document.getElementById('latest-news');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      <div className="space-y-6 min-h-[600px]">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        <BlogGridSkeleton />
      </div>
    );
  }

  const error = blogsQuery.error || tagsError || blogsByTagQuery.error;
  if (error) {
    return (
      <div className='min-h-[600px] w-full flex justify-center items-center text-center px-4'>
        <div className="max-w-md bg-white p-8 border border-slate-100 rounded-2xl shadow-sm">
          <div className="text-5xl mb-4">😕</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Oops! Có lỗi xảy ra</h3>
          <p className="text-slate-500 text-sm mb-6">
            {error ? `${error.message}` : 'Không thể tải bài viết. Vui lòng thử lại sau.'}
          </p>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95 rounded-full px-6 font-semibold shadow-md shadow-blue-500/10 text-xs h-10">
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
        <div className="w-full overflow-x-auto pb-4 mb-6 scroll-custom">
          <div className="flex items-center gap-2.5 min-w-max py-1.5 px-0.5">
            <button
              onClick={clearFilter}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all shadow-sm ${
                !activeFilter 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10' 
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            {tagsData.tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleFilterChange(tag.name)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all shadow-sm ${
                  activeFilter === tag.name 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10' 
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8 px-0 pb-16 pt-2">
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
          <div className="col-span-full text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {activeFilter ? 'Không tìm thấy bài viết' : 'Chưa có bài viết nào'}
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              {activeFilter
                ? `Không tìm thấy bài viết nào tương thích với chủ đề "${activeFilter.replace(/-/g, ' ')}".`
                : 'Trang chưa cập nhật bài viết mới cho chủ đề này.'}
            </p>
            {activeFilter && (
              <Button 
                onClick={clearFilter} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95 rounded-full px-6 font-semibold shadow-md shadow-blue-500/10 text-xs h-9"
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