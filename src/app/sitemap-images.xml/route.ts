import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bloai.blog';
        
        const blogs = await db.blog.findMany({
            select: {
                slug: true,
                imageUrl: true,
                imageAlt: true,
                title: true,
            },
            where: {
                imageUrl: { not: '' }
            },
            orderBy: { publishDate: 'desc' },
        });
        
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${blogs.map((blog) => `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <image:image>
      <image:loc>${blog.imageUrl.replace(/&/g, '&amp;')}</image:loc>
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
