import { BlogGrid } from "@/components/BlogGrid";


export default async function Home() {
 
  return (
    <main>
      <div className="px-4 min-[375px]:px-6 md:px-8 lg:px-10 xl:px-12 py-4 min-[375px]:py-6">
        <h2 className="text-2xl font-bold mb-4">Today's Trending</h2>
        <BlogGrid expanded={true} />
      </div>
    </main>
  );
}