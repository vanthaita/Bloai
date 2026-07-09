import { BlogGrid } from "@/components/blog/BlogGrid";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { Suspense } from "react";
import Loading from "@/components/loading";
import { db } from "@/server/db";
import { slugify } from "@/types/helper.type";
import { notFound } from "next/navigation";

export const revalidate = 300;

async function getCategoryByRouteSlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const tags = await db.tag.findMany({
    where: {
      blogs: {
        some: {},
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return tags.find((tag) => slugify(tag.name) === decodedSlug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryByRouteSlug(slug);

  if (!category) {
    return {
      title: "Category not found | Bloai Blog",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const categorySlug = slugify(category.name);
  const description = `Tuyen tap cac bai viet moi nhat thuoc danh muc ${category.name} tren Bloai Blog.`;

  return {
    title: `Danh muc: ${category.name.toUpperCase()} | Bloai Blog`,
    description,
    alternates: {
      canonical: `https://www.bloai.blog/category/${categorySlug}`,
    },
    openGraph: {
      type: "website",
      url: `https://www.bloai.blog/category/${categorySlug}`,
      siteName: "Bloai Blog",
      title: `Danh muc: ${category.name.toUpperCase()} | Bloai Blog`,
      description,
      locale: "vi_VN",
      images: [
        {
          url: "https://www.bloai.blog/images/Logo/android-chrome-512x512.png",
          width: 1200,
          height: 630,
          alt: `Danh muc ${category.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Bloai_Team",
      title: `Danh muc: ${category.name.toUpperCase()} | Bloai Blog`,
      description,
      images: ["https://www.bloai.blog/images/Logo/android-chrome-512x512.png"],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryByRouteSlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-16 min-[375px]:px-6 md:px-8 lg:pb-12 lg:pt-24">
        <Breadcrumbs
          items={[{ label: "DANH MUC" }, { label: category.name }]}
        />
        <div className="mb-8 flex items-center border-t-[3px] border-black pt-6">
          <div className="mr-4 h-8 w-2 bg-black md:h-10"></div>
          <h1 className="text-2xl font-extrabold uppercase tracking-widest text-black md:text-4xl">
            Danh muc: {category.name}
          </h1>
        </div>

        <Suspense fallback={<Loading />}>
          <BlogGrid initialTag={category.name} />
        </Suspense>
      </section>
    </main>
  );
}
