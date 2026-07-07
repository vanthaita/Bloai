import { BlogGrid } from "@/components/blog/BlogGrid";
import { FeaturedPosts } from "@/components/blog/FeaturedPosts";
import Loading from "@/components/loading";
import { Suspense } from "react";
import { api, HydrateClient } from "@/trpc/server";
import { Sidebar } from "@/components/blog/Sidebar";

function SidebarSkeleton() {
    return (
        <aside className="w-full flex flex-col gap-10 animate-pulse">
            <div className="space-y-4">
                <div className="h-4 bg-gray-200 w-24 mb-6" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 bg-gray-200 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-200 w-full" />
                            <div className="h-3 bg-gray-200 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}

export const revalidate = 300;

export const metadata = {
    title: 'Bloai Blog - Tin Tức Công Nghệ, Lập Trình & AI Mới Nhất',
    description: 'Bloai Blog — Trang tin tức hàng đầu về Lập trình, Công nghệ, AI và SEO tại Việt Nam. Cập nhật xu hướng phát triển web, hướng dẫn ChatGPT, Midjourney và tối ưu hiệu suất.',
    alternates: {
        canonical: 'https://www.bloai.blog',
        languages: {
            'vi-VN': 'https://www.bloai.blog',
            'x-default': 'https://www.bloai.blog',
        },
    },
    openGraph: {
        type: 'website' as const,
        url: 'https://www.bloai.blog',
        siteName: 'Bloai Blog',
        title: 'Bloai Blog - Tin Tức Công Nghệ, Lập Trình & AI Mới Nhất',
        description: 'Trang tin tức hàng đầu về Lập trình, Công nghệ, AI và SEO tại Việt Nam.',
        locale: 'vi_VN',
        images: [
            {
                url: 'https://www.bloai.blog/images/Logo/android-chrome-512x512.png',
                width: 1200,
                height: 630,
                alt: 'Bloai Blog - Công Nghệ, Lập Trình & AI',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image' as const,
        site: '@Bloai_Team',
        title: 'Bloai Blog - Tin Tức Công Nghệ, Lập Trình & AI Mới Nhất',
        description: 'Trang tin tức hàng đầu về Lập trình, Công nghệ, AI và SEO tại Việt Nam.',
        images: ['https://www.bloai.blog/images/Logo/android-chrome-512x512.png'],
    },
};

export default async function Home() {
    // Parallel fetch for better performance
    const [featuredData, allPostsData] = await Promise.all([
        api.blog.getAllBlog({ page: 1, limit: 3 }),
        api.blog.getAllBlog({ page: 1, limit: 18 }),
    ]);

    const featuredPosts = featuredData.blogs || [];
    const allPostsForCrawlers = allPostsData.blogs || [];

    return (
        <main className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
            <h1 className="sr-only">Bloai Blog - Tin tức AI và công nghệ mới nhất</h1>
            <HydrateClient>
                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                    <FeaturedPosts posts={featuredPosts} />
                )}

                {/* All Blog Posts & Sidebar */}
                <section className="cv-auto max-w-7xl mx-auto w-full px-4 min-[375px]:px-6 md:px-8 py-10 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
                            <div id="latest-news" className="mb-8 flex items-center justify-between pb-4 border-b border-slate-200/80">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                                    <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                                        Tin mới nhất
                                    </h2>
                                </div>
                            </div>
                            <Suspense fallback={<Loading />}>
                                <BlogGrid />
                            </Suspense>
                        </div>

                        {/* Sidebar Area */}
                        <div className="lg:col-span-4 xl:col-span-3 pt-6 lg:pt-0">
                            <div className="sticky top-28">
                                <Suspense fallback={<SidebarSkeleton />}>
                                    <Sidebar />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </section>

                {/*
                  * Server-rendered blog post index — hidden from users (sr-only) but
                  * visible to crawlers in the initial HTML. Fixes the "orphan page"
                  * issue by giving every blog post at least one incoming <a href> link.
                  */}
                {allPostsForCrawlers.length > 0 && (
                    <nav aria-label="Tất cả bài viết" className="sr-only">
                        <h2>Danh sách bài viết mới nhất</h2>
                        <ul>
                            {allPostsForCrawlers.map((post) => (
                                <li key={post.slug}>
                                    <a href={`/blog/${post.slug}`}>{post.title}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </HydrateClient>
        </main>
    );
}
