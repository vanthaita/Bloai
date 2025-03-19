import { BlogGrid } from "@/components/BlogGrid";


export default async function Home() {
 
  return (
    <main>
      <div className="px-4 min-[375px]:px-6 md:px-8 lg:px-10 xl:px-12 py-4 min-[375px]:py-6 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Nổi bật</h2>
        <BlogGrid expanded={true} />
      </div>
    </main>
  );
}