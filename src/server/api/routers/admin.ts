import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
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
});