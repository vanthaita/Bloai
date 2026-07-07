'use client';

import React from 'react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { formatDateVi } from '@/lib/dateUtils';

export function Sidebar() {
  const { data: leaderBoardData, isLoading: isLoadingLeaderBoard } = api.blog.getLeaderBoard.useQuery({
    blogLimit: 5,
  });

  const { data: tagsData, isLoading: isLoadingTags } = api.blog.getAllTags.useQuery({
    limit: 10,
  });

  const topBlogs = leaderBoardData?.topViewedBlogs || [];
  const popularTags = tagsData?.tags || [];

  return (
    <aside className="w-full flex flex-col gap-10">
      
      {/* Top Read Widget */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 pb-3 mb-6 border-b border-slate-200/80">
          <div className="w-1.5 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Tin đọc nhiều
          </h2>
        </div>

        {isLoadingLeaderBoard ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-slate-100 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 w-full rounded"></div>
                  <div className="h-3 bg-slate-100 w-2/3 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {topBlogs.map((blog, index) => (
              <Link href={`/blog/${blog.slug}`} key={blog.id} className="flex gap-3 group items-start">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm transition-all ${
                  index === 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' :
                  index === 1 ? 'bg-slate-800 text-white' :
                  index === 2 ? 'bg-slate-600 text-white' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors">
                    {blog.title}
                  </h4>
                  <span className="text-[10px] font-medium text-slate-400 mt-1">
                    {formatDateVi(blog.publish_day)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Popular Tags Widget */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 pb-3 mb-6 border-b border-slate-200/80">
          <div className="w-1.5 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Chủ đề nổi bật
          </h2>
        </div>

        {isLoadingTags ? (
          <div className="flex flex-wrap gap-2 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-7 w-16 bg-slate-100 rounded-full"></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                className="px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
              >
                {tag.name}
              </Link>
            ))}
            <Link
              href="/tags"
              className="px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm"
            >
              Tất cả →
            </Link>
          </div>
        )}
      </div>

    </aside>
  );
}
