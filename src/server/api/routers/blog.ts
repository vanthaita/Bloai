import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
export const blogRouter = createTRPCRouter({
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
        description: z.string().min(200).max(600),
        canonicalUrl: z.string().url().optional(),
        ogTitle: z.string().max(120).optional(),
        ogDescription: z.string().max(600).optional(),
        readTime: z.number().int().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingBlog = await ctx.db.blog.findUnique({
          where: { slug: input.slug },
        });
        if (existingBlog) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Slug already exists" });
        }
        const result = await ctx.db.$transaction(async (prisma) => {
          const normalizedTags = input.tags.map(tag => tag.toLowerCase());
          const uniqueTags = [...new Set(normalizedTags)];
          const existingTags = await prisma.tag.findMany({
            where: { name: { in: uniqueTags } },
          });

          const existingTagNames = existingTags.map(t => t.name);
          const newTags = uniqueTags.filter(name => !existingTagNames.includes(name));

          if (newTags.length > 0) {
            await prisma.tag.createMany({
              data: newTags.map(name => ({ name })),
              skipDuplicates: true,
            });
          }

          const allTags = await prisma.tag.findMany({
            where: { name: { in: uniqueTags } },
          });

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
              tags: {
                connect: allTags.map(tag => ({ id: tag.id })),
              },
            },
            include: {
              tags: true,
              author: true,
            },
          });
        }, {
          timeout: 10000, 
        });
        return { success: true, result };
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create blog post",
        });
      }
    }),
    
    getBlog: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
            const blog = await ctx.db.blog.findUnique({
                where: { slug: input.slug },
                include: {
                tags: true,
                author: true,
                },
            });

            if (!blog) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found" });
            }

            return blog;
            } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            console.error("Database error:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch blog",
            });
            }
        }),

    getAllBlog: publicProcedure
        .input(z.object({
          page: z.number().int().positive().optional().default(1), 
          limit: z.number().int().positive().optional().default(6)
        }))
        .query(async ({ ctx, input }) => {
        const skip = (input.page - 1) * input.limit;
        
        const blogs = await ctx.db.blog.findMany({
            skip: skip,
            take: input.limit,
            orderBy: { publishDate: 'desc' },
            include: {
            tags: true,
            author: true,
            },
        });
        
        return blogs;
    }),
    getAllTags: publicProcedure
      .input(z.object({
        page: z.number().int().positive().optional().default(1),
        limit: z.number().int().positive().optional().default(10)
      }))
      .query(async ({ ctx, input }) => {
        const skip = (input.page - 1) * input.limit;
        const tags = await ctx.db.tag.findMany({
          skip: skip,
          take: input.limit,
          include: {
            _count: {
              select: { blogs: true }
            }
          },
          orderBy: {
            blogs: {
              _count: 'desc'
            }
          }
        });
        
        const totalTags = await ctx.db.tag.count();
        
        return {
          tags,
          totalTags,
          totalPages: Math.ceil(totalTags / input.limit),
          currentPage: input.page
        };
    }),
});
