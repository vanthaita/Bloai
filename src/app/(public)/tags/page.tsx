'use client';

import React from 'react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag, FolderOpen, BookOpenText, AlertTriangle } from 'lucide-react';
import { env } from '@/env';

const BASE_URL = env.NEXT_PUBLIC_APP_URL;
const CATEGORIES_PAGE_PATH = '/categories';

const CategoriesPage = () => {
  const { data, isLoading, error } = api.blog.getAllTags.useQuery({
    page: 1,
    limit: 100, 
  });

  const generateStructuredData = () => {
    if (!data || !data.tags || data.tags.length === 0) {
      return null;
    }
    const currentPageUrl = `${BASE_URL}${CATEGORIES_PAGE_PATH}`;
    const itemListElement = data.tags.map((tag, index) => {
      const tagUrl = `${BASE_URL}/blog/tag/${tag.name}`; 
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Thing', 
          url: tagUrl,
          name: tag.name,
          description: tag.description || `Các bài viết thuộc chuyên mục ${tag.name}`,
        },
      };
    });
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Danh sách Chuyên mục Bài viết - Bloai Blog',
      description: 'Khám phá các chuyên mục và chủ đề bài viết đa dạng trên Bloai Blog.',
      url: currentPageUrl,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentPageUrl,
      },
      itemListElement: itemListElement,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: BASE_URL + '/' },
          { '@type': 'ListItem', position: 2, name: 'Danh mục', item: currentPageUrl },
        ],
      },
    };
    return JSON.stringify(structuredData);
  };

  const structuredDataJson = generateStructuredData();

  if (isLoading) return <CategoriesLoadingSkeleton />;

  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg rounded-lg border border-red-200 bg-white p-6 text-center shadow-lg sm:p-8">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500 sm:h-14 sm:w-14" />
        <h2 className="mb-2 text-xl font-semibold text-red-800 sm:text-2xl">
          Lỗi Tải Dữ Liệu
        </h2>
        <p className="mb-5 text-gray-700">
          Đã có lỗi xảy ra khi tải danh sách chuyên mục. Vui lòng làm mới trang hoặc thử lại sau.
        </p>
        <p className="rounded bg-red-100 p-3 text-sm text-red-700">
          Chi tiết lỗi: {error.message}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-4 sm:p-6 lg:p-8">
      {structuredDataJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataJson }}
        />
      )}

      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-gray-200 pb-6 text-center md:mb-12">
          <h1 className="mb-3 flex items-center justify-center gap-2 text-3xl font-bold text-gray-900 font-serif sm:mb-4 sm:gap-3 sm:text-4xl lg:text-5xl">
            <FolderOpen className="h-8 w-8 flex-shrink-0 text-indigo-600 sm:h-10 sm:w-10" />
            Khám phá Chuyên mục
          </h1>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            Duyệt qua danh sách các chủ đề và tìm những bài viết phù hợp với sự quan tâm của bạn trên Bloai Blog.
          </p>
        </div>

        {data && data.tags.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {data.tags.map((tag) => {
              const tagSlug = tag.name; 
              return (
                <Link
                  key={tag.id}
                  href={`/tags/${tagSlug}`}
                  className="group transform transition-all duration-300 ease-in-out hover:-translate-y-1"
                >
                  <div className="flex h-full flex-col rounded-lg border border-gray-200/80 bg-white p-4 shadow-md transition-shadow hover:shadow-lg hover:border-indigo-300 sm:p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h2 className="flex items-center gap-2 pr-2 text-lg font-semibold text-gray-800 transition-colors group-hover:text-indigo-600 sm:text-xl">
                        <Tag className="h-5 w-5 flex-shrink-0 text-gray-400 transition-colors group-hover:text-indigo-500" />
                        <span className="break-words">{tag.name}</span>
                      </h2>
                      <span className="flex-shrink-0 whitespace-nowrap rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-800 sm:px-3 sm:text-sm">
                        {tag._count?.blogs ?? 0} Bài viết
                      </span>
                    </div>

                    {tag.description ? (
                      <p className="mb-4 flex-grow text-sm leading-relaxed text-gray-600 line-clamp-3">
                        {tag.description}
                      </p>
                    ) : (
                      <div className="mb-4 flex-grow"></div> 
                    )}

                    <div className="mt-auto pt-2">
                      <div className="inline-flex items-center text-sm font-medium text-indigo-600 transition-colors group-hover:text-indigo-700">
                        Xem chuyên mục
                        <svg
                          className="ml-1.5 h-4 w-4 transition-transform duration-200 ease-in-out group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed border-gray-300 bg-gray-50/70 px-6 py-16 text-center sm:py-20">
            <BookOpenText className="mx-auto mb-4 h-12 w-12 text-gray-400 sm:h-14 sm:w-14" />
            <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
              Chưa có chuyên mục nào được tìm thấy
            </h3>
            <p className="max-w-md text-gray-600">
              Hiện tại chưa có chuyên mục nào. Khi các bài viết được gắn thẻ, chúng sẽ xuất hiện ở đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


const CategoriesLoadingSkeleton = () => (
  <div className="min-h-screen animate-pulse bg-gradient-to-b from-white to-gray-100 p-4 sm:p-6 lg:p-8">
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 border-b border-gray-200 pb-6 text-center md:mb-12">
        <Skeleton className="mx-auto mb-4 h-9 w-3/5 max-w-sm rounded-lg bg-gray-200 sm:h-10 lg:h-12" />
        <Skeleton className="mx-auto h-5 w-full max-w-lg rounded-lg bg-gray-200 sm:h-6" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex h-full flex-col rounded-lg border border-gray-200/80 bg-white p-4 shadow-md sm:p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <Skeleton className="h-6 w-3/5 rounded bg-gray-200 sm:h-7" />
              <Skeleton className="h-6 w-[80px] flex-shrink-0 rounded-full bg-gray-200 sm:h-7 sm:w-[90px]" />
            </div>
            <Skeleton className="mb-2 h-4 w-full rounded bg-gray-200" />
            <Skeleton className="mb-4 h-4 w-4/5 rounded bg-gray-200 flex-grow" />
            <div className="mt-auto pt-2">
              <Skeleton className="h-5 w-32 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CategoriesPage;