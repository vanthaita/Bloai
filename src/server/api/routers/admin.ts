import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
// fetch('/api/crawl'),
// fetch('/api/blogs'),
// fetch('/api/tags'),
// fetch('/api/comments'),
// fetch('/api/newsletter')


export const adminRouter = createTRPCRouter({
    getAdminViewBlogs: protectedProcedure
        .input(
            z.object({
                page: z.number().min(1).default(1),
                pageSize: z.number().min(1).max(100).default(10),
                search: z.string().optional(),
                sortBy: z.enum(["publishDate", "title", "views"]).default("publishDate"),
                sortOrder: z.enum(["asc", "desc"]).default("desc"),
                status: z.enum(["all", "Featured", "Published"]).default("all"),
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize, sortBy, search, sortOrder, status } = input;
            const skip = (page - 1) * pageSize;

            const where: Prisma.BlogWhereInput = {
                AND: [
                    ...(search ? [{
                        OR: [
                            { title: { contains: search, mode: 'insensitive' as const } },
                            { author: { name: { contains: search, mode: 'insensitive' as const } } },
                        ],
                    }] : []),
                    ...(status === "Published" ? [{ featured: true }] : 
                       status === "Featured" ? [{ featured: false }] : [])
                ],
            };

            const [blogs, totalCount] = await Promise.all([
                ctx.db.blog.findMany({
                    where,
                    skip,
                    take: pageSize,
                    orderBy: { [sortBy]: sortOrder },
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        publishDate: true,
                        views: true,
                        featured: true,
                        author: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                }),
                ctx.db.blog.count({ where }),
            ]);

            return {
                blogs: blogs.map((blog) => ({
                    id: blog.id,
                    title: blog.title,
                    slug: blog.slug,
                    author: blog.author.name || blog.author.email,
                    publishDate: blog.publishDate,
                    views: blog.views,
                    status: blog.featured ? "Featured" : "Published",
                })),
                totalCount,
                page,
                pageSize,
                totalPages: Math.ceil(totalCount / pageSize),
            };
        })
,
    getAdminViewComments: protectedProcedure
        .input(
            z.object({
                page: z.number().min(1).default(1),
                pageSize: z.number().min(1).max(100).default(10),
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search } = input;
            const skip = (page - 1) * pageSize;
            const where: Prisma.CommentWhereInput = {
                ...(search
                    ? {
                        OR: [
                            { content: { contains: search, mode: 'insensitive' } },
                            { author: { name: { contains: search, mode: 'insensitive' } } },
                            { blog: { title: { contains: search, mode: 'insensitive' } } },
                        ],
                    }
                    : {}),
            };
            const [comments, totalCount] = await Promise.all([
                ctx.db.comment.findMany({
                    where,
                    skip,
                    take: pageSize,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        blog: { select: { id: true, title: true, slug: true } },
                        author: { select: { id: true, name: true, email: true } },
                    },
                }),
                ctx.db.comment.count({ where }),
            ]);
            return {
                comments,
                totalCount,
                page,
                pageSize,
                totalPages: Math.ceil(totalCount / pageSize),
            };
        })
,
    getAdminViewNewsletter: protectedProcedure
        .input(
            z.object({
                page: z.number().min(1).default(1),
                pageSize: z.number().min(1).max(100).default(10),
                search: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search } = input;
            const skip = (page - 1) * pageSize;
            const where: Prisma.NewsletterSubscriptionWhereInput = {
                ...(search ? { email: { contains: search, mode: 'insensitive' } } : {}),
            };
            const [subscribers, totalCount] = await Promise.all([
                ctx.db.newsletterSubscription.findMany({
                    where,
                    skip,
                    take: pageSize,
                    orderBy: { subscribedAt: 'desc' },
                    select: {
                        id: true,
                        email: true,
                        subscribedAt: true,
                        active: true,
                        unsubscribedAt: true,
                    },
                }),
                ctx.db.newsletterSubscription.count({ where }),
            ]);
            return {
                subscribers,
                totalCount,
                page,
                pageSize,
                totalPages: Math.ceil(totalCount / pageSize),
            };
        })
,
    getAllCrawlSources: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.db.crawlSource.findMany({
                orderBy: { createdAt: 'desc' },
            });
        }),
    // XÓA/SỬA TAG
    deleteTag: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.tag.delete({ where: { id: input.id } })
            return { success: true }
        })
,
    updateTag: protectedProcedure
        .input(z.object({ id: z.string(), name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const tag = await ctx.db.tag.update({ where: { id: input.id }, data: { name: input.name } })
            return { success: true, tag }
        })
,
    // XÓA/SỬA BLOG
    deleteBlog: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.blog.delete({ where: { id: input.id } })
            return { success: true }
        })
,
    updateBlog: protectedProcedure
        .input(z.object({ id: z.string(), title: z.string().min(1), status: z.enum(['Published', 'Featured', 'Draft']), tags: z.array(z.string()) }))
        .mutation(async ({ ctx, input }) => {
            // Cập nhật trạng thái (featured), tiêu đề, tags
            const featured = input.status === 'Featured'
            const published = input.status === 'Published'
            // Cập nhật tags: tìm hoặc tạo mới, sau đó connect
            const normalizedTags = input.tags.map(t => t.toLowerCase())
            const uniqueTags = [...new Set(normalizedTags)]
            const existingTags = await ctx.db.tag.findMany({ where: { name: { in: uniqueTags } } })
            const existingTagNames = existingTags.map(t => t.name)
            const newTags = uniqueTags.filter(name => !existingTagNames.includes(name))
            if (newTags.length > 0) {
                await ctx.db.tag.createMany({ data: newTags.map(name => ({ name })), skipDuplicates: true })
            }
            const allTags = await ctx.db.tag.findMany({ where: { name: { in: uniqueTags } } })
            const blog = await ctx.db.blog.update({
                where: { id: input.id },
                data: {
                    title: input.title,
                    featured,
                    tags: { set: [], connect: allTags.map(tag => ({ id: tag.id })) },
                },
                include: { tags: true }
            })
            return { success: true, blog }
        })
,
    // XÓA/SỬA COMMENT
    deleteComment: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.comment.delete({ where: { id: input.id } })
            return { success: true }
        })
,
    updateComment: protectedProcedure
        .input(z.object({ id: z.string(), content: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const comment = await ctx.db.comment.update({ where: { id: input.id }, data: { content: input.content } })
            return { success: true, comment }
        })
,
    // XÓA/SỬA SUBSCRIBER
    deleteSubscriber: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.newsletterSubscription.delete({ where: { id: input.id } })
            return { success: true }
        })
,
    updateSubscriber: protectedProcedure
        .input(z.object({ id: z.string(), active: z.boolean() }))
        .mutation(async ({ ctx, input }) => {
            const data: any = { active: input.active }
            if (!input.active) data.unsubscribedAt = new Date()
            else data.unsubscribedAt = null
            const subscriber = await ctx.db.newsletterSubscription.update({ where: { id: input.id }, data })
            return { success: true, subscriber }
        })
});