import { BlogGrid } from "@/components/blog/BlogGrid";
import Loading from "@/components/loading"; 
import { Suspense } from "react";
import { blogPageMetadata, blogSchema, safeJsonLdStringify } from "@/config/seo";

export const metadata = blogPageMetadata

export default async function Page() {
  return (
    <>
     <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(blogSchema) }}
      />
      <main>
        <div className="px-4 min-[375px]:px-6 md:px-8 lg:px-10 xl:px-12 py-6 min-[375px]:py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200 text-center underline decoration-[#3A6B4C] decoration-4 underline-offset-4">
            BÀI VIẾT NỔI BẬT
          </h1>
          <Suspense fallback={<Loading />}>
            <BlogGrid
            />
          </Suspense>
        </div>
      </main>
    </>

  );
}