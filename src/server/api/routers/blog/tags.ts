import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { getCachedData, CACHE_TTL } from "@/lib/redis";

export const tagsRouter = createTRPCRouter({
  getAllTags: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().optional().default(1),
        limit: z.number().int().positive().optional().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      return getCachedData(
        `tags:all:${input.page}:${input.limit}`,
        async () => {
          const skip = (input.page - 1) * input.limit;
          const tags = await ctx.db.tag.findMany({
            skip,
            take: input.limit,
            include: { _count: { select: { blogs: true } } },
            orderBy: { blogs: { _count: "desc" } },
          });
          const totalTags = await ctx.db.tag.count();
          return {
            tags,
            totalTags,
            totalPages: Math.ceil(totalTags / input.limit),
            currentPage: input.page,
          };
        },
        CACHE_TTL.TAGS
      );
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const decodedSlug = decodeURIComponent(input.slug);
      return getCachedData(
        `tag:detail:${decodedSlug}`,
        async () => {
          const tag = await ctx.db.tag.findFirst({
            where: { name: decodedSlug },
            include: {
              blogs: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  metaDescription: true,
                  imageUrl: true,
                  imageAlt: true,
                  publishDate: true,
                  readTime: true,
                  author: true,
                  tags: true,
                },
                orderBy: { publishDate: "desc" },
              },
            },
          });

          if (!tag) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Tag not found" });
          }

          return tag;
        },
        CACHE_TTL.TAG_DETAIL
      );
    }),

  getSuggestedBlogs: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        limit: z.number().int().positive().optional().default(3),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return getCachedData(
          `suggested:${input.slug}:${input.limit}`,
          async () => {
            const currentBlog = await ctx.db.blog.findUnique({
              where: { slug: input.slug },
              select: { tags: { select: { id: true } } },
            });

            if (!currentBlog) {
              throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found" });
            }

            const currentTagIds = currentBlog.tags.map((tag) => tag.id);

            if (currentTagIds.length === 0) {
              return ctx.db.blog.findMany({
                where: { slug: { not: input.slug } },
                take: input.limit,
                orderBy: { publishDate: "desc" },
                select: {
                  slug: true,
                  title: true,
                  imageUrl: true,
                  imageAlt: true,
                  publishDate: true,
                  readTime: true,
                  metaDescription: true,
                  author: { select: { name: true, image: true } },
                  tags: { select: { name: true } },
                },
              });
            }

            return ctx.db.$queryRaw`
              SELECT
                b."slug", b."title", b."imageUrl", b."imageAlt",
                b."publishDate", b."readTime", b."metaDescription",
                json_build_object('name', a."name", 'image', a."image") as author,
                COALESCE(
                  json_agg(json_build_object('name', t."name"))
                  FILTER (WHERE t."id" IS NOT NULL),
                  '[]'::json
                ) as tags
              FROM "Blog" b
              INNER JOIN "User" a ON b."authorId" = a."id"
              LEFT JOIN "_BlogToTag" bt ON b."id" = bt."A"
              LEFT JOIN "Tag" t ON bt."B" = t."id"
              LEFT JOIN "_BlogToTag" bt_overlap
                ON b."id" = bt_overlap."A"
                AND bt_overlap."B" IN (${Prisma.join(currentTagIds)})
              WHERE b."slug" != ${input.slug}
              GROUP BY b."id", a."id"
              ORDER BY COUNT(bt_overlap."B") DESC, b."publishDate" DESC
              LIMIT ${input.limit};
            `;
          },
          CACHE_TTL.SUGGESTED
        );
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Database error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch suggested blogs" });
      }
    }),
});
