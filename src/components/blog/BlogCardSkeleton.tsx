import React from 'react';

export function BlogCardSkeleton() {
  return (
    <div className="bg-white h-full flex flex-col animate-pulse">
      {/* Image — aspect-video matches the real CldImage wrapper */}
      <div className="relative aspect-video mb-4 bg-gray-200" />

      <div className="flex flex-col flex-grow space-y-3">
        {/* Tag + date row */}
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-full" />
          <div className="h-5 bg-gray-200 rounded w-4/5" />
          <div className="h-5 bg-gray-200 rounded w-3/5" />
        </div>
        {/* Description */}
        <div className="space-y-1.5">
          <div className="h-3.5 bg-gray-200 rounded w-full" />
          <div className="h-3.5 bg-gray-200 rounded w-5/6" />
        </div>
        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="flex gap-3">
            <div className="h-3 bg-gray-200 rounded w-12" />
            <div className="h-3 bg-gray-200 rounded w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogGridSkeleton() {
  return (
    // Must match BlogGrid columns exactly to prevent CLS on hydration
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 pt-8 border-t-2 border-black">
      {Array.from({ length: 9 }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}
