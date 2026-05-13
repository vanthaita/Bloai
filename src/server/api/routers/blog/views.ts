import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getCachedData, CACHE_TTL, incrementViewInRedis, getViewFromRedis } from "@/lib/redis";

export const viewsRouter = createTRPCRouter({
  viewCount: publicProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const decodedSlug = decodeURIComponent(input.slug);

      // 1. Tăng nhanh trong Redis (non-blocking với DB)
      const redisCount = await incrementViewInRedis(decodedSlug);

      // 2. Đồng bộ về DB bất đồng bộ (không block response)
      setImmediate(async () => {
        try {
          const blog = await ctx.db.blog.findUnique({
            where: { slug: decodedSlug },
            select: { id: true, views: true },
          });
          if (blog) {
            await ctx.db.blog.update({
              where: { id: blog.id },
              data: { views: blog.views + 1 },
            });
          }
        } catch (e) {
          console.error("[viewCount] DB sync failed:", e);
        }
      });

      // 3. Trả về ngay từ Redis (nếu có) hoặc fallback DB
      if (redisCount !== null) return redisCount;

      const blog = await ctx.db.blog.findUnique({
        where: { slug: decodedSlug },
        select: { views: true },
      });
      return (blog?.views ?? 0) + 1;
    }),

  getViews: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const decodedSlug = decodeURIComponent(input.slug);

      // Thử Redis trước (realtime counter)
      const redisViews = await getViewFromRedis(decodedSlug);
      if (redisViews !== null) return redisViews;

      // Fallback về DB
      const blog = await ctx.db.blog.findUnique({
        where: { slug: decodedSlug },
        select: { views: true },
      });
      return blog?.views ?? 0;
    }),

  getLeaderBoard: publicProcedure
    .input(
      z.object({
        authorLimit: z.number().int().positive().optional().default(5),
        blogLimit: z.number().int().positive().optional().default(5),
      })
    )
    .query(async ({ input, ctx }) => {
      return getCachedData(
        `leaderboard:${input.authorLimit}:${input.blogLimit}`,
        async () => {
          const topAuthors = await ctx.db.user.findMany({
            take: input.authorLimit,
            orderBy: { blogs: { _count: "desc" } },
            select: {
              id: true,
              name: true,
              image: true,
              _count: { select: { blogs: true } },
            },
          });

          const topViewedBlogs = await ctx.db.blog.findMany({
            take: input.blogLimit,
            orderBy: { views: "desc" },
            select: {
              id: true,
              title: true,
              views: true,
              slug: true,
              author: { select: { name: true } },
              publishDate: true,
            },
          });

          return {
            topAuthors: topAuthors.map((author) => ({
              id: author.id,
              name: author.name || "Ẩn danh",
              blogCount: author._count.blogs,
              avatar: author.image || "",
            })),
            topViewedBlogs: topViewedBlogs.map((blog) => ({
              id: blog.id,
              title: blog.title,
              views: blog.views,
              author: blog.author.name || "Ẩn danh",
              slug: blog.slug,
              publish_day: blog.publishDate,
            })),
          };
        },
        CACHE_TTL.LEADERBOARD
      );
    }),
});
