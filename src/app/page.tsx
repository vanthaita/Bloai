import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { BlogGrid } from "@/components/BlogGrid";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <div className="px-4 min-[375px]:px-6 md:px-8 lg:px-10 xl:px-12 py-4 min-[375px]:py-6">
        <BlogGrid />
      </div>
    </HydrateClient>
  );
}