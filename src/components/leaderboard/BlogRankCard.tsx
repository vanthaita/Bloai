import React from "react";
import Link from "next/link";
import { Eye, Trophy, Star, Zap } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  views: number;
  author: string;
  slug: string;
  publish_day: Date;
}

const RANK_BADGES = [
  { label: "HOT", className: "bg-yellow-100 text-yellow-800" },
  { label: "POPULAR", className: "bg-blue-100 text-blue-800" },
  { label: "TRENDING", className: "bg-purple-100 text-purple-800" },
];

const getBlogRankIcon = (index: number) => {
  switch (index) {
    case 0: return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 stroke-yellow-500" />;
    case 1: return <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-blue-400 stroke-blue-500" />;
    case 2: return <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-purple-400 stroke-purple-500" />;
    default: return <span className="text-xs sm:text-sm font-medium text-slate-500">{index + 1}</span>;
  }
};

export function BlogRankCard({ blogs }: { blogs: Blog[] }) {
  return (
    <div className="border border-slate-200 bg-white shadow-sm rounded-lg">
      <div className="border-b border-slate-100 p-4 flex items-center gap-2">
        <div className="p-1 sm:p-1.5 bg-purple-100 rounded-lg">
          <Eye className="w-3 h-3 sm:w-4 sm:h-4 fill-purple-400 stroke-purple-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">Bài viết nổi bật</h3>
      </div>

      <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4 p-3 sm:p-4">
        {blogs.map((blog, index) => (
          <div
            key={blog.id}
            className={`group p-2 sm:p-3 rounded-lg transition-all hover:shadow-md ${
              index < 3
                ? "border border-purple-100 bg-gradient-to-r from-purple-50/50 to-white"
                : "hover:bg-slate-50"
            }`}
          >
            <div className="flex items-start">
              <div
                className={`mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0 ${
                  index < 3 ? "text-purple-500" : "text-slate-400"
                }`}
              >
                {getBlogRankIcon(index)}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm sm:text-base text-slate-800 hover:text-purple-600 line-clamp-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <Link href={`/blog/${blog.slug}`} className="truncate">
                    {blog.title}
                  </Link>
                  {index < 3 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex-shrink-0 ${RANK_BADGES[index]!.className}`}
                    >
                      {RANK_BADGES[index]!.label}
                    </span>
                  )}
                </h4>
                <div className="flex gap-2 items-center mt-0.5">
                  <p className="text-xs text-slate-500">bởi {blog.author}</p>
                  <time
                    dateTime={new Date(blog.publish_day).toISOString()}
                    className="text-slate-400 text-xs"
                  >
                    {new Date(blog.publish_day).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>

              <div className="flex items-center ml-2 text-xs sm:text-sm font-semibold group-hover:text-purple-600 transition-colors flex-shrink-0">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                {blog.views.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
