import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/server/db';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Tìm kiếm | Bloai Blog',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.bloai.blog/search',
    languages: {
      'vi-VN': 'https://www.bloai.blog/search',
      'x-default': 'https://www.bloai.blog/search',
    },
  },
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined): string {
  if (!value) return '';
  return Array.isArray(value) ? (value[0] ?? '') : value;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const q = getSingleParam(params.q)?.trim();

  const results = q
    ? await db.blog.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { metaDescription: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          slug: true,
          title: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      })
    : [];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 min-[375px]:px-6 md:px-8 pt-24 pb-10 lg:pt-32 lg:pb-12">
      <h1 className="text-2xl md:text-4xl font-extrabold tracking-widest uppercase text-black">
        Tìm kiếm
      </h1>

      <form className="mt-6" action="/search" method="get">
        <label htmlFor="q" className="block text-sm font-medium text-gray-700">
          Nhập từ khóa
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="q"
            name="q"
            defaultValue={q}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          />
          <button
            type="submit"
            className="bg-black px-5 py-2.5 rounded-md text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition duration-200 ease-in-out"
          >
            Tìm
          </button>
        </div>
      </form>

      {q ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Kết quả cho: {q}</h2>

          {results.length === 0 ? (
            <p className="mt-3 text-gray-600">Không tìm thấy bài viết phù hợp.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {results.map((post) => (
                <li key={post.slug}>
                  <Link className="text-blue-600 hover:underline" href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <p className="mt-6 text-gray-600">Nhập từ khóa để tìm các bài viết trên Bloai Blog.</p>
      )}
    </main>
  );
}
