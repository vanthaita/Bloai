import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";

export const blogRouter = createTRPCRouter({
  // Lấy tất cả blogs
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.blog.findMany({
      include: {
        author: true,
        tags: true,
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { publishDate: "desc" }
    });
  }),

  // Lấy blog theo id
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.blog.findUnique({
        where: { id: input.id },
        include: {
          author: true,
          tags: true,
          comments: {
            include: { author: true },
            orderBy: { createdAt: "desc" }
          }
        }
      });
    }),

  // Tạo blog mới
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      imageUrl: z.string(),
      readTime: z.string(),
      tags: z.array(z.string())
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.blog.create({
        data: {
          title: input.title,
          content: input.content,
          imageUrl: input.imageUrl,
          readTime: input.readTime,
          author: { connect: { id: ctx.session.user.id } },
          tags: {
            connectOrCreate: input.tags.map(tag => ({
              where: { name: tag },
              create: { name: tag }
            }))
          }
        }
      });
    }),
});
