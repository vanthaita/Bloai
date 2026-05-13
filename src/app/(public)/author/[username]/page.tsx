import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import Link from "next/link";
import { FaUser } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const authorName = decodeURIComponent(username).replace(/-/g, ' ');
    const author = await db.user.findFirst({
        where: { name: { equals: authorName, mode: 'insensitive' } }
    });

    if (!author) {
        return { title: 'Tác giả không tồn tại | Bloai Blog' };
    }

    const defaultDescription = `Tất cả bài viết từ tác giả ${author.name} trên Bloai Blog. Khám phá các bài viết phân tích chuyên sâu, chia sẻ kiến thức hữu ích về Trí tuệ nhân tạo (AI), Machine Learning và công nghệ mới nhất.`;

    return {
        title: `Tác giả: ${author.name}`,
        description: author.bio || defaultDescription,
        alternates: {
            canonical: `https://www.bloai.blog/author/${username}`
        },
        openGraph: {
            type: 'profile',
            url: `https://www.bloai.blog/author/${username}`,
            siteName: 'Bloai Blog',
            title: `Tác giả: ${author.name}`,
            description: author.bio || defaultDescription,
            locale: 'vi_VN',
            images: [
                {
                    url: author.image || 'https://www.bloai.blog/images/Logo/android-chrome-512x512.png',
                    width: 800,
                    height: 800,
                    alt: `Tác giả ${author.name}`,
                },
            ],
        },
        twitter: {
            card: 'summary',
            site: '@Bloai_Team',
            title: `Tác giả: ${author.name}`,
            description: author.bio || defaultDescription,
            images: [author.image || 'https://www.bloai.blog/images/Logo/android-chrome-512x512.png'],
        },
    }
}

export default async function AuthorPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const authorName = decodeURIComponent(username).replace(/-/g, ' ');
    
    const author = await db.user.findFirst({
        where: { name: { equals: authorName, mode: 'insensitive' } },
        include: {
            _count: {
                select: { blogs: true }
            }
        }
    });

    if (!author) {
        notFound();
    }

    const blogs = await db.blog.findMany({
        where: { authorId: author.id },
        orderBy: { publishDate: 'desc' },
        include: {
            tags: true,
            author: true,
        }
    });

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <section className="max-w-7xl mx-auto w-full px-4 min-[375px]:px-6 md:px-8 pt-16 pb-10 lg:pt-24 lg:pb-12">
                <Breadcrumbs items={[
                    { label: 'TÁC GIẢ' },
                    { label: author.name || authorName }
                ]} />
                
                {/* Author Info */}
                <div className="mb-12 border-[1.5px] border-black p-6 bg-white flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
                    <Avatar className='h-24 w-24 rounded-none border-[1.5px] border-black bg-white'>
                        <AvatarImage 
                            src={author.image || ''} 
                            alt={`${author.name}'s avatar`}
                            className="object-cover rounded-none"
                        />
                        <AvatarFallback className="bg-white text-black rounded-none flex items-center justify-center h-full w-full">
                        {author.name ? (
                            <span className="text-2xl font-bold uppercase tracking-widest">{author.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                        ) : (
                            <FaUser className="w-10 h-10 text-black" />
                        )}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-widest uppercase text-black mb-2">
                            {author.name}
                        </h1>
                        <p className="text-gray-600 font-medium mb-4 max-w-2xl">
                            {author.bio || 'Tác giả này chưa cập nhật tiểu sử.'}
                        </p>
                        <div className="inline-block border-[1.5px] border-black bg-black text-white px-4 py-2 font-bold uppercase tracking-widest text-xs">
                            {author._count.blogs} BÀI VIẾT
                        </div>
                    </div>
                </div>

                <div className="mb-8 flex items-center border-t-[3px] border-black pt-6">
                    <div className="w-2 h-8 md:h-10 bg-black mr-4"></div>
                    <h2 className="text-xl md:text-3xl font-extrabold tracking-widest uppercase text-black">
                        Bài viết của tác giả
                    </h2>
                </div>

                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 pb-16 pt-8 border-t-2 border-black">
                        {blogs.map((blog) => (
                            <Link href={`/blog/${blog.slug}`} key={blog.id} className="block h-full group">
                                <BlogCard blog={blog as any} />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-[1.5px] border-black">
                        <p className="text-xl font-bold text-gray-800 uppercase tracking-widest">Chưa có bài viết nào</p>
                    </div>
                )}
            </section>
        </main>
    );
}
