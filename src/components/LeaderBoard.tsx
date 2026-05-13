import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { AuthorRankCard } from "@/components/leaderboard/AuthorRankCard";
import { BlogRankCard } from "@/components/leaderboard/BlogRankCard";

const LeaderBoard = async () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("vi-VN", { month: "long" });
  const currentYear = currentDate.getFullYear();

  let topAuthorsThisMonth: Awaited<ReturnType<typeof api.blog.getLeaderBoard>>["topAuthors"] = [];
  let topViewedBlogs: Awaited<ReturnType<typeof api.blog.getLeaderBoard>>["topViewedBlogs"] = [];

  try {
    const leaderboardData = await api.blog.getLeaderBoard({});
    topAuthorsThisMonth = leaderboardData.topAuthors;
    topViewedBlogs = leaderboardData.topViewedBlogs;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
  }

  return (
    <Card className="w-full overflow-hidden bg-transparent border-none shadow-none">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl flex items-center gap-3 text-slate-800">
          <span>Bảng xếp hạng Blog</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <AuthorRankCard
            authors={topAuthorsThisMonth}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
          <BlogRankCard blogs={topViewedBlogs} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderBoard;