import React from "react";
import { Medal } from "lucide-react";
import { FaUser } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Author {
  id: string;
  name: string;
  blogCount: number;
  avatar: string | null;
}

const getMedalIcon = (index: number) => {
  switch (index) {
    case 0: return <Medal className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 stroke-yellow-500" />;
    case 1: return <Medal className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-300 stroke-slate-400" />;
    case 2: return <Medal className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-500 stroke-amber-600" />;
    default: return <span className="font-medium text-slate-500 text-sm sm:text-base">{index + 1}</span>;
  }
};

export function AuthorRankCard({
  authors,
  currentMonth,
  currentYear,
}: {
  authors: Author[];
  currentMonth: string;
  currentYear: number;
}) {
  return (
    <div className="relative overflow-hidden border border-slate-200 bg-white shadow-sm rounded-lg">
      <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold rounded-bl-lg shadow-sm">
        {currentMonth} {currentYear}
      </div>
      <div className="pb-3 sm:pb-4 border-b border-slate-100 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800">Tác giả hàng đầu</h3>
          <span className="text-xs sm:text-sm text-slate-500 font-medium mt-2">Số bài viết</span>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4 p-3 sm:p-4">
        {authors.map((author, index) => (
          <div
            key={author.id}
            className={`flex items-center p-2 sm:p-3 rounded-lg transition-all hover:shadow-md ${
              index < 3
                ? "bg-gradient-to-r from-amber-50/50 to-white border border-amber-100"
                : "hover:bg-slate-50"
            }`}
          >
            <div className="mr-2 sm:mr-3 flex-shrink-0">{getMedalIcon(index)}</div>
            <div className="flex items-center flex-1 min-w-0 gap-x-2 sm:gap-x-3">
              {author.avatar ? (
                <Avatar>
                  <AvatarImage
                    src={author.avatar || "https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_auto/v1746885273/y3hpblcst5qn3j5aah1l.svg"}
                    alt={`${author.name}'s avatar`}
                  />
                  <AvatarFallback className="bg-gray-200">
                    {author.name ? (
                      author.name.split(" ").map((n) => n[0]).join("")
                    ) : (
                      <FaUser className="w-4 h-4 text-gray-600" />
                    )}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-100 rounded-full border-2 border-white shadow-sm flex-shrink-0">
                  <FaUser className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                </div>
              )}
              <span className="font-medium text-sm sm:text-base text-slate-800 truncate">
                {author.name}
              </span>
            </div>
            <span
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold ${
                index < 3 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
              }`}
            >
              {author.blogCount} bài
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
