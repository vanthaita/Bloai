import { BlogGrid } from "@/components/blog/BlogGrid";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { Suspense } from "react";
import Loading from "@/components/loading";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug).replace(/-/g, ' ');
    return {
        title: `Tag: ${decodedSlug.toUpperCase()} | Bloai Blog`,
        description: `Khám phá các bài viết liên quan đến chủ đề ${decodedSlug}`,
        alternates: {
            canonical: `https://www.bloai.blog/tag/${slug}`
        },
        openGraph: {
            type: 'website',
            url: `https://www.bloai.blog/tag/${slug}`,
            siteName: 'Bloai Blog',
            title: `Tag: ${decodedSlug.toUpperCase()} | Bloai Blog`,
            description: `Khám phá các bài viết liên quan đến chủ đề ${decodedSlug}`,
            locale: 'vi_VN',
            images: [
                {
                    url: 'https://www.bloai.blog/images/Logo/android-chrome-512x512.png',
                    width: 1200,
                    height: 630,
                    alt: `Tag ${decodedSlug}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            site: '@Bloai_Team',
            title: `Tag: ${decodedSlug.toUpperCase()} | Bloai Blog`,
            description: `Khám phá các bài viết liên quan đến chủ đề ${decodedSlug}`,
            images: ['https://www.bloai.blog/images/Logo/android-chrome-512x512.png'],
        },
    }
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug).replace(/-/g, ' ');

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <section className="max-w-7xl mx-auto w-full px-4 min-[375px]:px-6 md:px-8 pt-16 pb-10 lg:pt-24 lg:pb-12">
                <Breadcrumbs items={[
                    { label: 'TAGS', href: '/tags' },
                    { label: decodedSlug }
                ]} />
                <div className="mb-8 flex items-center border-t-[3px] border-black pt-6">
                    <div className="w-2 h-8 md:h-10 bg-black mr-4"></div>
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-widest uppercase text-black">
                        Tag: {decodedSlug}
                    </h1>
                </div>

                <Suspense fallback={<Loading />}>
                    <BlogGrid initialTag={decodedSlug} />
                </Suspense>
            </section>
        </main>
    );
}
