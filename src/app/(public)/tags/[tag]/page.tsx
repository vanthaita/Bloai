'use client'
import { usePathname, useRouter } from 'next/navigation'
import Head from 'next/head'
import Image from 'next/image'
import { api } from '@/trpc/react'
import Loading from '@/components/loading'
import Link from 'next/link'
import { FaBookOpen, FaEye } from 'react-icons/fa'

const TagDetailsPage = () => {
    const router = useRouter()
    const pathname = usePathname()
    
    const slug = pathname?.split('/').filter(Boolean).pop()

    const { data: tag, isLoading, error } = api.blog.getBySlug.useQuery(
        { slug: slug as string },
        { enabled: !!slug }
    )

    if (isLoading) return <Loading />
    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-lg mb-4">Error loading tag: {error.message}</p>
            <button 
                onClick={() => window.location.reload()}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
                Try Again
            </button>
        </div>
    )

    if (!tag) return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-2xl text-gray-600 mb-2">Tag Not Found</h2>
            <p className="text-gray-500 mb-4">The tag you're looking for doesn't exist.</p>
            <button
                onClick={() => router.push('/')}
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
                Return Home
            </button>
        </div>
    )

    const metaDescription = tag.description || `Explore ${tag.blogs.length} articles tagged with ${tag.name}. Discover expert insights and latest updates on ${tag.name}.`

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${tag.name} - Tag`,
        "description": metaDescription,
        "mainEntity": tag.blogs.map(blog => ({
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.metaDescription,
            "datePublished": blog.publishDate,
            "author": {
                "@type": "Person",
                "name": blog.author.name || "Anonymous"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Your Blog Name"
            },
            "image": blog.imageUrl,
            "url": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug}`
        }))
    }

    return (
        <>
            <Head>
                <title>{`${tag.name} Tag - Bloai`}</title>
                <meta name="description" content={metaDescription} />
                <meta property="og:title" content={`${tag.name} Tag - Bloai`} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_APP_URL}${pathname}`} />
                <meta property="og:image" content={tag.blogs[0]?.imageUrl || '/default-og-image.jpg'} />
                
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${tag.name} Tag - Bloai`} />
                <meta name="twitter:description" content={metaDescription} />
                <meta name="twitter:image" content={tag.blogs[0]?.imageUrl || '/default-twitter-image.jpg'} />

                <link rel="canonical" href={`${process.env.NEXT_PUBLIC_APP_URL}${pathname}`} />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Head>

            <div className="min-h-screen bg-gray-50">
                <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">#{tag.name}</h1>
                        {tag.description && (
                            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed">
                                {tag.description}
                            </p>
                        )}
                        <div className="text-sm font-medium bg-white/10 rounded-full px-6 py-2 inline-flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            {tag.blogs.length} article{tag.blogs.length !== 1 && 's'}
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 pb-16 mt-4">
                    {tag.blogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tag.blogs.map((blog) => (
                                <Link 
                                    href={`/blog/${blog.slug}`}
                                    key={blog.id}
                                    className="group relative bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer border border-gray-100 h-full flex flex-col"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={blog.imageUrl}
                                            alt={blog.imageAlt || blog.title}
                                            fill
                                            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            placeholder="blur"
                                            blurDataURL="/placeholder-image.jpg"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                            {blog.tags.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag.name}
                                                    className={`px-3 py-1 text-white text-xs font-medium rounded-full backdrop-blur-sm`}
                                                >
                                                    #{tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#3A6B4C] transition-colors mb-2 line-clamp-2">
                                                {blog.title}
                                            </h2>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="flex items-center gap-1 whitespace-nowrap">
                                                        <FaBookOpen className="w-4 h-4 text-[#3A6B4C]" />
                                                        <span>{blog.readTime} min read</span>
                                                    </span>
                                                    <span className="hidden sm:inline">·</span>
                                                    {blog.author && (
                                                        <span className="font-medium whitespace-nowrap">
                                                            {blog.author.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right text-xs text-gray-400">
                                                {new Date(blog.publishDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )  : (
                        <div className="text-center py-20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl text-gray-600 mb-2">No articles found</h3>
                            <p className="text-gray-500">We couldn't find any articles tagged with {tag.name}.</p>
                        </div>
                    )}
                </main>
            </div>
        </>
    )
}

export default TagDetailsPage