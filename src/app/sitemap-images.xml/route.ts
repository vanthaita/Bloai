import { db } from "@/server/db";
import { escapeXml, getCanonicalBlogUrl, getCanonicalSiteUrl } from "@/lib/seo-url";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const baseUrl = getCanonicalSiteUrl();
        
        const blogs = await db.blog.findMany({
            select: {
                slug: true,
                imageUrl: true,
                imageAlt: true,
                title: true,
                canonicalUrl: true,
                content: true,
            },
            where: {
                imageUrl: { not: '' },
                content: { not: '' },
            },
            orderBy: { publishDate: 'desc' },
        });
        
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${blogs.map((blog) => `
  <url>
    <loc>${escapeXml(getCanonicalBlogUrl(blog.slug, blog.canonicalUrl))}</loc>
    <image:image>
      <image:loc>${escapeXml(blog.imageUrl)}</image:loc>
      <image:title><![CDATA[${blog.title}]]></image:title>
      ${blog.imageAlt ? `<image:caption><![CDATA[${blog.imageAlt}]]></image:caption>` : ''}
    </image:image>
  </url>`).join('')}
</urlset>`;

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
            },
        });
    } catch (error) {
        console.error("Error generating Image Sitemap:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
