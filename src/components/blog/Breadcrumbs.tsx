'use client';
import Link from 'next/link';

interface BreadcrumbsProps {
    items: { label: string; href?: string }[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bloai.blog';

    return (
        <nav aria-label="Breadcrumb" className="mb-6 mt-2 overflow-x-auto whitespace-nowrap">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 font-medium uppercase tracking-wider text-xs">
                <li>
                    <Link href="/" className="hover:text-black hover:underline transition-colors flex items-center">
                        TRANG CHỦ
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <span className="text-gray-400">/</span>
                        {item.href ? (
                            <Link href={item.href} className="hover:text-black hover:underline transition-colors">
                                {item.label.toUpperCase()}
                            </Link>
                        ) : (
                            <span className="text-black font-bold text-wrap line-clamp-1 max-w-[200px] md:max-w-[400px]">{item.label.toUpperCase()}</span>
                        )}
                    </li>
                ))}
            </ol>
            {/* JSON-LD Schema for Breadcrumbs */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Trang chủ",
                                "item": baseUrl + "/"
                            },
                            ...items.map((item, index) => ({
                                "@type": "ListItem",
                                "position": index + 2,
                                "name": item.label,
                                ...(item.href ? { "item": baseUrl + item.href } : {})
                            }))
                        ]
                    })
                }}
            />
        </nav>
    );
};
