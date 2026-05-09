import { BlogGrid } from "@/components/blog/BlogGrid";
import Loading from "@/components/loading";
import { Suspense } from "react";

export const revalidate = 300;

export const metadata = {
    title: 'Tất cả bài viết về AI & Công Nghệ',
    description: 'Danh sách tất cả các bài viết công nghệ và trí tuệ nhân tạo (AI) mới nhất trên Bloai Blog. Cập nhật hàng ngày về ChatGPT, Machine Learning và ứng dụng AI.',
    alternates: {
        canonical: 'https://www.bloai.blog/blog',
        languages: {
            'vi-VN': 'https://www.bloai.blog/blog',
            'x-default': 'https://www.bloai.blog/blog',
        },
    },
    openGraph: {
        type: 'website' as const,
        url: 'https://www.bloai.blog/blog',
        siteName: 'Bloai Blog',
        title: 'Tất cả bài viết về AI & Công Nghệ — Bloai Blog',
        description: 'Tất cả bài viết về AI và công nghệ mới nhất trên Bloai Blog.',
        locale: 'vi_VN',
        images: [
            {
                url: 'https://www.bloai.blog/images/Logo/android-chrome-512x512.png',
                width: 1200,
                height: 630,
                alt: 'Bloai Blog - Tất Cả Bài Viết',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image' as const,
        site: '@Bloai_Team',
        title: 'Tất cả bài viết về AI & Công Nghệ — Bloai Blog',
        description: 'Tất cả bài viết về AI và công nghệ mới nhất trên Bloai Blog.',
        images: ['https://www.bloai.blog/images/Logo/android-chrome-512x512.png'],
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