'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { getNodeText, Heading } from '@/types/helper.type';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';

const DynamicReactMarkdown = dynamic(
    () => import('react-markdown').then(mod => mod.default),
    {
        loading: () => <div className='prose max-w-none'><p>Loading content...</p></div>,
    }
);

interface BlogContentRendererProps {
    content: string;
    headings: Heading[];
}

const BlogContentRenderer: React.FC<BlogContentRendererProps> = ({ content, headings }) => {
    const CustomHeadingRenderer = useCallback(
        ({
            level,
            children,
            ...props
        }: {
            level: 1 | 2 | 3;
            children?: React.ReactNode;
            [key: string]: any;
        }) => {
            const text = children ? getNodeText(children) : '';
            const matchedHeading = headings.find((h) => h.text === text && h.level === level);
            const finalId = matchedHeading?.id;

            const Tag = `h${level}` as keyof JSX.IntrinsicElements;

            if (!finalId) {
                console.warn(`Heading ID not found for level ${level}: "${text}"`);
                return <Tag {...props}>{children || ''}</Tag>;
            }

            return (
                <Tag id={finalId} {...props} key={finalId}>
                    {children || ''}
                </Tag>
            );
        },
        [headings]
    );

    return (
        <div className="prose prose-slate max-w-none lg:prose-lg prose-headings:scroll-mt-40 
            prose-img:rounded-none prose-img:border-2 prose-img:border-black prose-img:shadow-none prose-img:max-w-full prose-img:h-auto 
            prose-a:text-black prose-a:underline prose-a:underline-offset-2 hover:prose-a:bg-black hover:prose-a:text-white prose-a:transition-colors 
            prose-a:duration-150 prose-code:before:content-none prose-code:after:content-none 
            prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:pr-4
            prose-headings:font-extrabold prose-headings:text-black
            mb-12"
        >
            <DynamicReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                    // Remap h1 → h2 inside article content:
                    // The page's true H1 is the article title in BlogHeader.
                    // Any "# heading" in markdown would create a second H1, triggering Ahrefs "Multiple H1 tags".
                    h1: (props) => <CustomHeadingRenderer level={2} {...props} />,
                    h2: (props) => <CustomHeadingRenderer level={2} {...props} />,
                    h3: (props) => <CustomHeadingRenderer level={3} {...props} />,
                    // Automatically add alt text to images to fix Ahrefs "Missing alt text" warnings
                    img: ({ node, ...props }) => (
                        <img 
                            {...props} 
                            alt={props.alt || "Bloai Blog Article Image"} 
                            loading="lazy" 
                        />
                    ),
                    // Convert relative markdown links (e.g. docs/windows.md) to absolute GitHub links to fix 404s
                    a: ({ node, href, ...props }) => {
                        const isRelativeMd = href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#');
                        // If it's a relative link (like docs/setup.md), point it to the GitHub repository to avoid 404s
                        const finalHref = isRelativeMd ? `https://github.com/TDevUIT/Bloai/tree/main/${href}` : href;
                        return (
                            <a 
                                href={finalHref} 
                                target={isRelativeMd || href?.startsWith('http') ? '_blank' : undefined} 
                                rel={isRelativeMd || href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                {...props} 
                            />
                        );
                    },
                }}
            >
                {content}
            </DynamicReactMarkdown>
        </div>
    );
};

export default BlogContentRenderer;