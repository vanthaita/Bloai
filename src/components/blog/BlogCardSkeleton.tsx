import React from 'react';

export function BlogCardSkeleton() {
  return (
    <div className="bg-white overflow-hidden border-b border-black pb-4 h-full flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-48 bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
        <div>
          {/* Title Skeleton */}
          <div className="space-y-2 mb-3">
            <div className="h-5 bg-gray-200 rounded w-full" />
            <div className="h-5 bg-gray-200 rounded w-3/4" />
          </div>
        </div>

        <div>
          {/* Meta Skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>

          {/* Tags & Date Skeleton */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 rounded-full w-16" />
              <div className="h-5 bg-gray-200 rounded-full w-20" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4 border-t border-black">
      {Array.from({ length: 9 }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}
