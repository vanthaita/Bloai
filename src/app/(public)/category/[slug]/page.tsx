import { BlogGrid } from "@/components/blog/BlogGrid";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { Suspense } from "react";
import Loading from "@/components/loading";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug).replace(/-/g, ' ');
    return {
        title: `Danh mục: ${decodedSlug.toUpperCase()} | Bloai Blog`,
        description: `Các bài viết mới nhất thuộc danh mục ${decodedSlug}`,
        alternates: {
            canonical: `/category/${slug}`
        }
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug).replace(/-/g, ' ');

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <section className="max-w-7xl mx-auto w-full px-4 min-[375px]:px-6 md:px-8 pt-16 pb-10 lg:pt-24 lg:pb-12">
                <Breadcrumbs items={[
                    { label: 'DANH MỤC' },
                    { label: decodedSlug }
                ]} />
                <div className="mb-8 flex items-center border-t-[3px] border-black pt-6">
                    <div className="w-2 h-8 md:h-10 bg-black mr-4"></div>
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-widest uppercase text-black">
                        Danh mục: {decodedSlug}
                    </h1>
                </div>

                <Suspense fallback={<Loading />}>
                    <BlogGrid initialTag={decodedSlug} />
                </Suspense>
            </section>
        </main>
    );
}
