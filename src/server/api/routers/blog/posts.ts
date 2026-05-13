import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { revalidateTag } from "next/cache";
import { getCachedData, CACHE_TTL, invalidatePatterns } from "@/lib/redis";
import { sendBlogNotifications } from "@/lib/notifySubscribers";

export const postsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(10).max(120),
        slug: z.string().regex(/^[a-z0-9-]+$/),
        content: z.string().min(50),
        tags: z.array(z.string()).max(15),
        thumbnail: z.string().url().optional(),
        metaDescription: z.string().min(80).max(160),
        imageAlt: z.string().max(125).optional(),
        canonicalUrl: z.string().url().optional(),
        ogTitle: z.string().max(120).optional(),
        ogDescription: z.string().max(600).optional(),
        readTime: z.number().int().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingBlog = await ctx.db.blog.findUnique({ where: { slug: input.slug } });
        if (existingBlog) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Slug already exists" });
        }

        const result = await ctx.db.$transaction(async (prisma) => {
          const normalizedTags = input.tags.map((tag) => tag.toLowerCase());
          const uniqueTags = [...new Set(normalizedTags)];
          const existingTags = await prisma.tag.findMany({ where: { name: { in: uniqueTags } } });
          const existingTagNames = existingTags.map((t) => t.name);
          const newTags = uniqueTags.filter((name) => !existingTagNames.includes(name));

          if (newTags.length > 0) {
            await prisma.tag.createMany({ data: newTags.map((name) => ({ name })), skipDuplicates: true });
          }

          const allTags = await prisma.tag.findMany({ where: { name: { in: uniqueTags } } });

          return prisma.blog.create({
            data: {
              title: input.title,
              slug: input.slug,
              content: input.content,
              metaDescription: input.metaDescription,
              imageUrl: input.thumbnail as string,
              imageAlt: input.imageAlt,
              canonicalUrl: input.canonicalUrl,
              ogTitle: input.ogTitle,
              ogDescription: input.ogDescription,
              readTime: input.readTime,
              keywords: input.tags,
              authorId: ctx.session.user.id,
              tags: { connect: allTags.map((tag) => ({ id: tag.id })) },
            },
            include: { tags: true, author: true },
          });
        }, { timeout: 10000 });

        if (result) {
          setImmediate(async () => {
            try {
              await sendBlogNotifications({ db: ctx.db, blogId: result.id, type: "new" });
            } catch (emailError) {
              console.error("Failed to send blog notifications:", emailError);
            }
          });
        }

        await invalidatePatterns(["blogs:all:*", "tags:all:*", "leaderboard:*"]);
        revalidateTag("blog");

        return { success: true, result };
      } catch (err) {
        console.error(err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create blog post" });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(10).max(120),
        slug: z.string().regex(/^[a-z0-9-]+$/),
        content: z.string().min(50),
        tags: z.array(z.string()).max(15),
        thumbnail: z.string().url().optional(),
        metaDescription: z.string().min(80).max(160),
        imageAlt: z.string().max(125).optional(),
        canonicalUrl: z.string().url().optional(),
        ogTitle: z.string().max(120).optional(),
        ogDescription: z.string().max(600).optional(),
        readTime: z.number().int().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingBlog = await ctx.db.blog.findFirst({
          where: { slug: input.slug, id: { not: input.id } },
        });

        if (existingBlog) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Slug already exists" });
        }

        const result = await ctx.db.$transaction(async (prisma) => {
          const normalizedTags = input.tags.map((tag) => tag.toLowerCase());
          const uniqueTags = [...new Set(normalizedTags)];
          const existingTags = await prisma.tag.findMany({ where: { name: { in: uniqueTags } } });
          const existingTagNames = existingTags.map((t) => t.name);
          const newTags = uniqueTags.filter((name) => !existingTagNames.includes(name));

          if (newTags.length > 0) {
            await prisma.tag.createMany({ data: newTags.map((name) => ({ name })), skipDuplicates: true });
          }

          const allTags = await prisma.tag.findMany({ where: { name: { in: uniqueTags } } });

          await prisma.blog.update({ where: { id: input.id }, data: { tags: { set: [] } } });

          return prisma.blog.update({
            where: { id: input.id },
            data: {
              title: input.title,
              slug: input.slug,
              content: input.content,
              metaDescription: input.metaDescription,
              imageUrl: input.thumbnail,
              imageAlt: input.imageAlt,
              canonicalUrl: input.canonicalUrl,
              ogTitle: input.ogTitle,
              ogDescription: input.ogDescription,
              readTime: input.readTime,
              keywords: input.tags,
              tags: { connect: allTags.map((tag) => ({ id: tag.id })) },
            },
            include: { tags: true, author: true },
          });
        }, { timeout: 10000 });

        await invalidatePatterns([
          `blog:${input.slug}`,
          "blogs:all:*",
          "blogs:tag:*",
          "tags:all:*",
          "leaderboard:*",
          "suggested:*",
        ]);
        revalidateTag("blog");

        return { success: true, result };
      } catch (err) {
        console.error(err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update blog post" });
      }
    }),

  getBlog: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return getCachedData(
          `blog:${input.slug}`,
          async () => {
            const blog = await ctx.db.blog.findUnique({
              where: { slug: input.slug },
              select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                imageUrl: true,
                imageAlt: true,
                publishDate: true,
                updatedAt: true,
                readTime: true,
                canonicalUrl: true,
                metaDescription: true,
                ogTitle: true,
                ogDescription: true,
                ogImageUrl: true,
                authorId: true,
                tags: { select: { id: true, name: true } },
                author: { select: { id: true, name: true, image: true } },
                comments: {
                  select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    author: { select: { id: true, name: true, image: true } },
                  },
                  orderBy: { createdAt: "desc" },
                },
              },
            });

            if (!blog) {
              throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found" });
            }

            return blog;
          },
          CACHE_TTL.BLOG_DETAIL
        );
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Database error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch blog" });
      }
    }),

  getAllBlog: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().optional().default(1),
        limit: z.number().int().positive().optional().default(6),
      })
    )
    .query(async ({ ctx, input }) => {
      return getCachedData(
        `blogs:all:${input.page}:${input.limit}`,
        async () => {
          const skip = (input.page - 1) * input.limit;
          const [blogs, totalBlogs] = await Promise.all([
            ctx.db.blog.findMany({
              skip,
              take: input.limit,
              orderBy: { publishDate: "desc" },
              include: { tags: true, author: true },
            }),
            ctx.db.blog.count(),
          ]);
          return {
            blogs,
            total: totalBlogs,
            totalPages: Math.ceil(totalBlogs / input.limit),
            currentPage: input.page,
            limit: input.limit,
          };
        },
        CACHE_TTL.BLOG_LIST
      );
    }),

  getBlogByTags: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().optional().default(1),
        limit: z.number().int().positive().optional().default(10),
        tag: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return getCachedData(
        `blogs:tag:${input.tag}:${input.page}:${input.limit}`,
        async () => {
          const skip = (input.page - 1) * input.limit;
          const tagFilter = {
            tags: { some: { name: { equals: input.tag, mode: "insensitive" as const } } },
          };
          const [blogs, totalBlogs] = await Promise.all([
            ctx.db.blog.findMany({
              skip,
              take: input.limit,
              orderBy: { publishDate: "desc" },
              where: tagFilter,
              include: { tags: true, author: true },
            }),
            ctx.db.blog.count({ where: tagFilter }),
          ]);
          return {
            blogs,
            total: totalBlogs,
            totalPages: Math.ceil(totalBlogs / input.limit),
            currentPage: input.page,
          };
        },
        CACHE_TTL.BLOG_LIST
      );
    }),
});
