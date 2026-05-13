import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { revalidateTag } from "next/cache";
import { getCachedData, CACHE_TTL, invalidatePatterns } from "@/lib/redis";

export const commentsRouter = createTRPCRouter({
  addComment: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        content: z.string().min(1),
        name: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user && (!input.name || !input.email)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name and email are required for guest comments",
        });
      }

      const comment = await ctx.db.comment.create({
        data: {
          content: input.content,
          blog: { connect: { slug: input.slug } },
          author: ctx.session?.user
            ? { connect: { id: ctx.session.user.id } }
            : { create: { name: input.name!, email: input.email! } },
        },
        include: { author: true },
      });

      await invalidatePatterns([`blog:${input.slug}`, `comments:${input.slug}`]);
      revalidateTag("blog");

      return comment;
    }),

  listBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      return getCachedData(
        `comments:${input.slug}`,
        async () =>
          ctx.db.comment.findMany({
            where: { blog: { slug: input.slug } },
            include: { author: true },
            orderBy: { createdAt: "desc" },
          }),
        CACHE_TTL.COMMENTS
      );
    }),
});
