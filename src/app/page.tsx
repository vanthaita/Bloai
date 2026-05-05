import { BlogGrid } from "@/components/blog/BlogGrid";
import { FeaturedPosts } from "@/components/blog/FeaturedPosts";
import Loading from "@/components/loading"; 
import { Suspense } from "react";

import { api, HydrateClient } from "@/trpc/server";

import { Sidebar } from "@/components/blog/Sidebar";

export const dynamic = 'force-dynamic';

export default async function Home() {
    // Fetch data for Featured Posts (Top 3)
    const featuredData = await api.blog.getAllBlog({
        page: 1,
        limit: 3,
    });
    const featuredPosts = featuredData.blogs || [];

    // Prefetch data for SSR hydration to improve LCP and FCP
    void api.blog.getAllBlog.prefetch({
        page: 1,
        limit: 9
    });
    void api.blog.getAllTags.prefetch({
        page: 1,
        limit: 13
    });
    void api.blog.getLeaderBoard.prefetch({
        blogLimit: 5,
        authorLimit: 5
    });

    return (
        <HydrateClient>
            <main className="flex flex-col min-h-screen bg-white text-black">
                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                    <FeaturedPosts posts={featuredPosts} />
                )}

                {/* All Blog Posts & Sidebar */}
                <section className="max-w-7xl mx-auto w-full px-4 min-[375px]:px-6 md:px-8 py-10 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
                            <div className="mb-8 flex items-center border-t-[3px] border-black pt-6">
                                <div className="w-2 h-8 md:h-10 bg-black mr-4"></div>
                                <h1 className="text-2xl md:text-4xl font-extrabold tracking-widest uppercase text-black">
                                    Tin mới nhất
                                </h1>
                            </div>
                            <Suspense fallback={<Loading />}>
                                <BlogGrid />
                            </Suspense>
                        </div>

                        {/* Sidebar Area */}
                        <div className="lg:col-span-4 xl:col-span-3 pt-6 lg:pt-0">
                            <div className="sticky top-28">
                                <Sidebar />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </HydrateClient>
    );
}