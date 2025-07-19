import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import axios from "axios";
import * as cheerio from "cheerio";
import { aiAnalyzeBlogContent, aiGenerateHTMLToMarkdown } from '@/lib/gemini';
import { aiEnhanceContentBlogForSEO } from '@/lib/gemini';
import { uploadImageToCloudinary } from '@/lib/uploadImageUrl';

export const crawlSourceRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string(), url: z.string().url(), type: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const crawlSource = await ctx.db.crawlSource.create({
        data: input,
      });
      return { success: true, crawlSource };
    }),

  crawl: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input }) => {
      const { url } = input;
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const title = $('title').text() || '';
      const body = $('body').text() || '';
      return {
        success: true,
        data: {
          title,
          content: body,
          rawHtml: html,
        },
      };
    }),

  crawlBlogLinks: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input }) => {
      const { url } = input;
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const links: Array<{ url: string; text: string }> = [];
      $('a').each((_, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        if (
          href &&
          href.startsWith('/blog/') &&
          href !== '/blog/' &&
          !href.includes('#') &&
          !href.includes('?')
        ) {
          links.push({
            url: new URL(href, url).href,
            text,
          });
        }
      });
      const uniqueLinks = Object.values(
        links.reduce((acc, cur) => {
          acc[cur.url] = cur;
          return acc;
        }, {} as Record<string, { url: string; text: string }>)
      );
      return { success: true, links: uniqueLinks };
    }),

  saveCrawledBlog: publicProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      sourceUrl: z.string().url(),
      author: z.string().optional(),
      publishedAt: z.date().optional(),
      crawlSourceId: z.string().optional(),
      language: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existed = await ctx.db.crawledBlog.findFirst({ where: { sourceUrl: input.sourceUrl } });
      if (existed) {
        return { success: true, crawledBlog: existed, existed: true };
      }
      const crawledBlog = await ctx.db.crawledBlog.create({
        data: {
          title: input.title,
          content: input.content,
          sourceUrl: input.sourceUrl,
          author: input.author,
          publishedAt: input.publishedAt,
          crawlSourceId: input.crawlSourceId,
          language: input.language,
        },
      });
      return { success: true, crawledBlog, existed: false };
    }),

  crawlAndSaveBlogsFromList: publicProcedure
    .input(z.object({ baseUrl: z.string().url(), maxPages: z.number().min(1).max(20).default(5), crawlSourceId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { baseUrl, maxPages, crawlSourceId } = input;
      const allLinks: Array<{ url: string; text: string }> = [];
      // Crawl từng trang phân trang
      for (let page = 1; page <= maxPages; page++) {
        let pageUrl = baseUrl;
        if (page > 1) {
          // Thêm query phân trang, ví dụ: ?page=2 hoặc &page=2
          pageUrl = baseUrl.includes('?') ? `${baseUrl}&page=${page}` : `${baseUrl}?page=${page}`;
        }
        try {
          const response = await axios.get(pageUrl);
          const html = response.data;
          const $ = cheerio.load(html);
          $('a').each((_, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().trim();
            if (
              href &&
              href.startsWith('/blog/') &&
              href !== '/blog/' &&
              !href.includes('#') &&
              !href.includes('?')
            ) {
              allLinks.push({
                url: new URL(href, baseUrl).href,
                text,
              });
            }
          });
        } catch (err) {
          // Nếu 1 trang lỗi thì bỏ qua, tiếp tục các trang khác
          continue;
        }
      }
      // Loại trùng lặp
      const uniqueLinks = Object.values(
        allLinks.reduce((acc, cur) => {
          acc[cur.url] = cur;
          return acc;
        }, {} as Record<string, { url: string; text: string }>)
      );
      // Crawl từng blog detail và lưu vào DB
      let savedCount = 0;
      for (const link of uniqueLinks) {
        try {
          const res = await axios.get(link.url);
          const html = res.data;
          const $ = cheerio.load(html);
          const title = $('title').text() || link.text || '';
          const body = $('body').text() || '';
          let tags: string[] = [];
          let topic: string | null = null;
          let priority: string | null = null;
          if (title && body) {
            try {
              const aiResult = await aiAnalyzeBlogContent(title, body);
              tags = aiResult?.tags || [];
              topic = aiResult?.topic || null;
              priority = aiResult?.priority || null;
            } catch (e) {
              // Nếu AI lỗi thì bỏ qua, vẫn lưu blog
            }
            await ctx.db.crawledBlog.create({
              data: {
                title,
                content: body,
                sourceUrl: link.url,
                crawlSourceId: crawlSourceId,
                tags,
                topic,
                priority,
              },
            });
            savedCount++;
          }
        } catch (err) {
          // Nếu crawl 1 blog lỗi thì bỏ qua
          continue;
        }
      }
      return { success: true, savedCount, totalLinks: uniqueLinks.length, links: uniqueLinks };
    }),

  crawlAndSaveSelectedBlogs: publicProcedure
    .input(z.object({ blogs: z.array(z.object({ url: z.string().url(), text: z.string().optional(), crawlSourceId: z.string().optional() })) }))
    .mutation(async ({ ctx, input }) => {
      let savedCount = 0;
      for (const blog of input.blogs) {
        // Kiểm tra đã có trong DB chưa
        const exists = await ctx.db.crawledBlog.findFirst({ where: { sourceUrl: blog.url } });
        if (exists) continue;
        try {
          const res = await axios.get(blog.url);
          const html = res.data;
          const $ = cheerio.load(html);
          const title = $('title').text() || blog.text || '';
          const body = $('body').text() || '';
          let tags: string[] = [];
          let topic: string | null = null;
          let priority: string | null = null;
          if (title && body) {
            try {
              const aiResult = await aiAnalyzeBlogContent(title, body);
              tags = aiResult?.tags || [];
              topic = aiResult?.topic || null;
              priority = aiResult?.priority || null;
            } catch (e) {}
            await ctx.db.crawledBlog.create({
              data: {
                title,
                content: body,
                sourceUrl: blog.url,
                crawlSourceId: blog.crawlSourceId,
                tags,
                topic,
                priority,
              },
            });
            savedCount++;
          }
        } catch (err) {
          continue;
        }
      }
      return { success: true, savedCount, total: input.blogs.length };
    }),

  enhanceAndTranslateBlogContent: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input }) => {
      const { url } = input;
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const title = $('title').text() || '';
      const body = $('body').html() || '';
      const markdownResult = await aiGenerateHTMLToMarkdown(body);
      if (!markdownResult.success || !markdownResult.markdownContent) {
        return {
          success: false,
          title,
          markdown: '',
          warnings: 'Chuyển đổi thất bại',
          language: markdownResult.language || 'vi',
        };
      }
      return {
        success: true,
        title,
        markdown: markdownResult.markdownContent,
        warnings: '',
        language: markdownResult.language,
      };
    }),

  convertAndSaveBlogAsDraft: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const crawled = await ctx.db.crawledBlog.findUnique({ where: { id: input.id } });
        if (!crawled) return { success: false };
        const markdown = crawled.content;
        const updated = await ctx.db.crawledBlog.update({
          where: { id: input.id },
          data: {
            improvedContent: markdown,
            status: 'converted',
          },
        });
        return { success: true, crawledBlogId: updated.id };
      } catch (e) {
        return { success: false };
      }
    }),

  updateCrawledBlog: publicProcedure
    .input(z.object({
      id: z.string(),
      author: z.string().optional(),
      status: z.string().optional(),
      tags: z.array(z.string()).optional(),
      topic: z.string().optional(),
      priority: z.string().optional(),
      language: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const updated = await ctx.db.crawledBlog.update({
        where: { id },
        data,
      });
      return { success: true, blog: updated };
    }),

  getCrawledBlogs: publicProcedure
    .input(z.object({
      crawlSourceId: z.string().optional(),
      tag: z.string().optional(),
      topic: z.string().optional(),
      priority: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {};
      if (input.crawlSourceId) where.crawlSourceId = input.crawlSourceId;
      if (input.tag) where.tags = { has: input.tag };
      if (input.topic) where.topic = input.topic;
      if (input.priority) where.priority = input.priority;
      if (input.search) {
        where.OR = [
          { title: { contains: input.search, mode: 'insensitive' } },
          { content: { contains: input.search, mode: 'insensitive' } },
          { sourceUrl: { contains: input.search, mode: 'insensitive' } },
        ];
      }
      const blogs = await ctx.db.crawledBlog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: input.offset,
        take: input.limit,
        select: {
          id: true,
          title: true,
          sourceUrl: true,
          tags: true,
          topic: true,
          priority: true,
          status: true,
          createdAt: true,
          crawlSourceId: true,
          content: true, // Thêm dòng này để trả về content
        },
      });
      return { success: true, blogs };
    }),

  getCrawledBlog: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const blog = await ctx.db.crawledBlog.findUnique({
        where: { id: input.id },
      });
      if (!blog) {
        throw new Error('Crawled blog not found');
      }
      return blog;
    }),

  deleteCrawledBlog: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.crawledBlog.delete({ where: { id: input.id } });
      return { success: true };
    }),
}); 