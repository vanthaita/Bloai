import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getCachedData, CACHE_TTL } from "@/lib/redis";

export const searchRouter = createTRPCRouter({
  fullTextSearch: publicProcedure
    .input(
      z.object({
        searchTerm: z.string().min(1, { message: "Search term cannot be empty" }),
        slug: z.string().optional(),
        page: z.number().int().positive().optional().default(1),
        limit: z.number().int().min(1).optional().default(4),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const cacheKey = `search:${input.searchTerm}:${input.slug ?? ""}:${input.page}:${input.limit}`;
        return getCachedData(
          cacheKey,
          async () => {
            const whereClause = {
              OR: [
                { title: { contains: input.searchTerm, mode: "insensitive" as const } },
                { tags: { some: { name: { contains: input.searchTerm, mode: "insensitive" as const } } } },
              ],
              ...(input.slug && { slug: { contains: input.slug, mode: "insensitive" as const } }),
            };
            const skipValue = (input.page - 1) * input.limit;
            const [results, totalCount] = await ctx.db.$transaction([
              ctx.db.blog.findMany({
                where: whereClause,
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  metaDescription: true,
                  imageUrl: true,
                  imageAlt: true,
                  publishDate: true,
                  author: { select: { id: true, name: true, image: true } },
                  tags: { select: { id: true, name: true } },
                },
                orderBy: { publishDate: "desc" },
                take: input.limit,
                skip: skipValue,
              }),
              ctx.db.blog.count({ where: whereClause }),
            ]);
            return {
              results,
              totalCount,
              currentPage: input.page,
              totalPages: Math.ceil(totalCount / input.limit),
            };
          },
          CACHE_TTL.SEARCH
        );
      } catch (error) {
        console.error("Error in fullTextSearch:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to perform search",
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),
});
