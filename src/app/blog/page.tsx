import { BlogGrid } from "@/components/blog/BlogGrid";
import Loading from "@/components/loading";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Tất cả bài viết',
    description: 'Danh sách tất cả các bài viết công nghệ và trí tuệ nhân tạo (AI) mới nhất trên Bloai Blog.',
    alternates: {
        canonical: '/blog',
    },
};

export default async function BlogPage() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <section className="max-w-7xl mx-auto w-full px-4 min-[375px]:px-6 md:px-8 pt-24 pb-10 lg:pt-32 lg:pb-12">
                <div id="latest-news" className="mb-8 flex items-center border-t-[3px] border-black pt-6">
                    <div className="w-2 h-8 md:h-10 bg-black mr-4"></div>
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-widest uppercase text-black">
                        Tất cả bài viết
                    </h1>
                </div>

                <Suspense fallback={<Loading />}>
                    <BlogGrid />
                </Suspense>
            </section>
        </main>
    );
}