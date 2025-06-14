import { BlogGrid } from "@/components/blog/BlogGrid";
import Loading from "@/components/loading"; 
import { Suspense } from "react";
import LeaderBoard from "@/components/LeaderBoard";
import EmailSubscribeSection from "@/components/EmailSubscribe";
import TestimonialSection from "@/components/TestimonialSection";

export default async function Home() {
    return (
        <>
            <main className="flex flex-col">
                <section className="px-4 min-[375px]:px-6 md:px-8 lg:px-10 xl:px-12 py-6 min-[375px]:py-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200 text-center underline decoration-[#3A6B4C] decoration-4 underline-offset-4">
                    BÀI VIẾT NỔI BẬT
                </h1>
                <Suspense fallback={<Loading />}>
                    <BlogGrid />
                </Suspense>
                </section>

                <section className="w-full">
                <LeaderBoard />
                </section>

                <section className="w-full py-12">
                <EmailSubscribeSection 
                    title="Đừng bỏ lỡ kiến thức AI mới nhất"
                    description="Đăng ký nhận bản tin để cập nhật các bài viết mới, thủ thuật AI và tin tức công nghệ mỗi tuần."
                />
                </section>

                <section>
                <TestimonialSection />
                </section>
            </main>
        </>
    );
}