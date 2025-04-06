import { BlogGrid } from "@/components/BlogGrid";

export default async function Home() {

  return (
    <main>
      <div className="px-4 min-[375px]:px-6 md:px-8 lg:px-10 xl:px-12 py-6 min-[375px]:py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200 text-center underline">
          NỔI BẬT
        </h2>
        <BlogGrid expanded={true} />
      </div>
    </main>
  );
}