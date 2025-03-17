import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { BlogGrid } from "@/components/BlogGrid";

const posts = [
  {
    id: 1,
    title: '15 Advanced JavaScript Tricks for Experienced Developers',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    author: 'John Doe',
    readTime: '4 min read',
    views: 159,
    likes: 8,
    comments: 3,
    tags: ['JavaScript', 'Programming']
  },
  {
    id: 2,
    title: 'How to Build a Local RAG with DeepSeek-R1, LangChain, and Ollama',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    author: 'Jane Smith',
    readTime: '6 min read',
    views: 245,
    likes: 12,
    comments: 5,
    tags: ['AI', 'Machine Learning', 'How To']
  },
  {
    id: 3,
    title: 'This AI deepfake tool is WAY too real. Full body animation',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    author: 'Mike Johnson',
    readTime: '3 min read',
    views: 532,
    likes: 24,
    comments: 8,
    tags: ['AI', 'Technology', 'Trending']
  },
  {
    id: 4,
    title: '50+ HOURS REACT.JS 19 MONSTER CLASS',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    author: 'Sarah Wilson',
    readTime: '8 min read',
    views: 421,
    likes: 18,
    comments: 6,
    tags: ['React', 'JavaScript', 'How To']
  },
  {
    id: 5,
    title: 'Time will never be the same!',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    author: 'Alex Brown',
    readTime: '5 min read',
    views: 312,
    likes: 15,
    comments: 4,
    tags: ['Technology', 'Future', 'Trending']
  },
  {
    id: 6,
    title: 'The Accent Oracle',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    author: 'Chris Davis',
    readTime: '7 min read',
    views: 189,
    likes: 9,
    comments: 3,
    tags: ['AI', 'Language']
  },
  {
    id: 7,
    title: 'Mastering Next.js 14: Server Actions and Partial Prerendering',
    imageUrl: 'https://picsum.photos/400/300?random=7',
    author: 'Emma Wilson',
    readTime: '9 min read',
    views: 892,
    likes: 45,
    comments: 12,
    tags: ['Next.js', 'Web Dev', 'Featured']
  },
  {
    id: 8,
    title: 'The Future of AI: Multimodal Models and Their Impact',
    imageUrl: 'https://picsum.photos/400/300?random=8',
    author: 'Daniel Lee',
    readTime: '11 min read',
    views: 1203,
    likes: 89,
    comments: 24,
    tags: ['AI', 'Future Tech', 'Trending', 'Featured']
  },
  {
    id: 9,
    title: 'A Beginner’s Guide to Quantum Computing',
    imageUrl: 'https://picsum.photos/400/300?random=9',
    author: 'Olivia Green',
    readTime: '12 min read',
    views: 765,
    likes: 38,
    comments: 15,
    tags: ['Technology', 'Quantum Computing', 'How To']
  },
  {
    id: 10,
    title: 'The Ethical Implications of AI in Everyday Life',
    imageUrl: 'https://picsum.photos/400/300?random=10',
    author: 'Samuel White',
    readTime: '6 min read',
    views: 290,
    likes: 11,
    comments: 7,
    tags: ['AI', 'Ethics', 'Technology']
  },
  {
    id: 11,
    title: 'Top 5 Web Development Frameworks in 2024',
    imageUrl: 'https://picsum.photos/400/300?random=11',
    author: 'Mia Clark',
    readTime: '7 min read',
    views: 589,
    likes: 30,
    comments: 10,
    tags: ['Web Dev', 'Technology', 'Trending']
  },
  {
    id: 12,
    title: 'Cybersecurity Best Practices for Remote Work',
    imageUrl: 'https://picsum.photos/400/300?random=12',
    author: 'Ethan Hall',
    readTime: '9 min read',
    views: 412,
    likes: 22,
    comments: 9,
    tags: ['Technology', 'Cybersecurity', 'How To', 'Featured']
  },
  {
    id: 13,
    title: 'Unlocking the Power of CSS Grid for Layout Design',
    imageUrl: 'https://picsum.photos/400/300?random=13',
    author: 'Ava Wright',
    readTime: '8 min read',
    views: 356,
    likes: 19,
    comments: 6,
    tags: ['Web Dev', 'CSS', 'How To']
  },
  {
    id: 14,
    title: 'The Rise of Serverless Computing and its Benefits',
    imageUrl: 'https://picsum.photos/400/300?random=14',
    author: 'Noah Turner',
    readTime: '10 min read',
    views: 634,
    likes: 33,
    comments: 12,
    tags: ['Cloud', 'Technology', 'Trending']
  },
  {
    id: 15,
    title: 'Getting Started with React Hooks: A Practical Guide',
    imageUrl: 'https://picsum.photos/400/300?random=15',
    author: 'Isabella Baker',
    readTime: '6 min read',
    views: 487,
    likes: 26,
    comments: 8,
    tags: ['React', 'JavaScript', 'How To', 'Featured']
  },
];

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  // Split posts into different categories
  const trendingPosts = posts.filter(post => post.tags.includes('Trending'));
  const featuredPosts = posts.filter(post => post.tags.includes('Featured'));
  const howToPosts = posts.filter(post => post.tags.includes('How To'));
  const techPosts = posts.filter(post => post.tags.includes('Technology'));

  return (
    <HydrateClient>
      <div className="px-4 min-[375px]:px-6 md:px-8 lg:px-10 xl:px-12 py-4 min-[375px]:py-6">
        <h2 className="text-2xl font-bold mb-4">Today's Trending</h2>
        <BlogGrid posts={trendingPosts} expanded={true} />

        <h2 className="text-2xl font-bold mt-8 mb-4">Featured Posts</h2>
        <BlogGrid posts={featuredPosts} expanded={false} />

        <h2 className="text-2xl font-bold mt-8 mb-4">How To Use...</h2>
        <BlogGrid posts={howToPosts} expanded={false} />

        <h2 className="text-2xl font-bold mt-8 mb-4">Technology</h2>
        <BlogGrid posts={techPosts} expanded={false} />
      </div>
    </HydrateClient>
  );
}