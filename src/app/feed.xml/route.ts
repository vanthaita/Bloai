import { api } from "@/trpc/server";
import { escapeXml, getBlogUrl, getCanonicalSiteUrl } from "@/lib/seo-url";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const baseUrl = getCanonicalSiteUrl();
        
        // Fetch latest blogs
        const data = await api.blog.getAllBlog({
            page: 1,
            limit: 20,
        });
        
        const blogs = data.blogs || [];
        
        const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bloai Blog</title>
    <link>${baseUrl}</link>
    <description>Cập nhật kiến thức AI và công nghệ mới nhất trên Bloai Blog.</description>
    <language>vi-VN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${blogs.map((blog) => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${escapeXml(getBlogUrl(blog.slug))}</link>
      <guid isPermaLink="true">${escapeXml(getBlogUrl(blog.slug))}</guid>
      <description><![CDATA[${blog.metaDescription || ''}]]></description>
      <pubDate>${new Date(blog.publishDate).toUTCString()}</pubDate>
      ${blog.author?.name ? `<author><![CDATA[${blog.author.name}]]></author>` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

        return new NextResponse(rssXml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error("Error generating RSS feed:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
