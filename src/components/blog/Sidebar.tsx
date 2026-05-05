'use client';

import React from 'react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';

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
        <div className="border-b-[1.5px] border-black pb-2 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-black flex items-center">
            <span className="w-3 h-3 bg-black mr-3 inline-block"></span>
            Tin đọc nhiều
          </h3>
        </div>

        {isLoadingLeaderBoard ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 w-full"></div>
                  <div className="h-4 bg-gray-200 w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {topBlogs.map((blog, index) => (
              <Link href={`/blog/${blog.slug}`} key={blog.id} className="flex gap-4 group items-start">
                <div className="text-3xl font-extrabold text-transparent transition-colors" style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <h4 className="text-sm font-bold text-black group-hover:underline underline-offset-4 decoration-[1.5px] line-clamp-3 leading-snug transition-all">
                    {blog.title}
                  </h4>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mt-1">
                    {new Date(blog.publish_day).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Promo Banner Widget */}
      <div className="bg-black text-white p-6 border-[1.5px] border-black flex flex-col items-center text-center">
        <div className="w-8 h-8 border-2 border-white mb-4 flex items-center justify-center">
          <span className="text-white text-lg font-bold">B</span>
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-3 leading-relaxed">
          Trở thành tác giả của Bloai
        </h3>
        <p className="text-xs text-gray-400 font-medium mb-6 leading-relaxed">
          Chia sẻ kiến thức, mở rộng góc nhìn và đóng góp vào cộng đồng công nghệ.
        </p>
        <Button asChild className="w-full bg-white text-black border border-white rounded-none hover:bg-black hover:text-white hover:border-white transition-all text-xs font-bold uppercase tracking-widest h-10">
          <Link href="/auth/signin">Đăng Ký Ngay</Link>
        </Button>
      </div>

      {/* Popular Tags Widget */}
      <div className="flex flex-col">
        <div className="border-b-[1.5px] border-black pb-2 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-black flex items-center">
            <span className="w-3 h-3 border-[1.5px] border-black mr-3 inline-block"></span>
            Chủ đề nổi bật
          </h3>
        </div>

        {isLoadingTags ? (
          <div className="flex flex-wrap gap-2 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200"></div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags`}
                className="px-3 py-1.5 border-[1.5px] border-black text-[10px] font-bold uppercase tracking-wider text-black bg-white hover:bg-black hover:text-white transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>

    </aside>
  );
}
