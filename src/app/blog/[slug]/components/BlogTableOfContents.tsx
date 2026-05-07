'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';
import { Heading } from '@/types/helper.type';

const DynamicReactMarkdown = dynamic(
    () => import('react-markdown').then(mod => mod.default)
);

interface BlogTableOfContentsProps {
    headings: Heading[];
}

const BlogTableOfContents: React.FC<BlogTableOfContentsProps> = ({ headings }) => {
    if (!headings || headings.length === 0) {
        return null;
    }

    return (
        <div className="mb-10 p-6 border-[1.5px] border-black rounded-none md:block hidden bg-white">
            <Label className="text-sm font-bold uppercase tracking-widest text-black mb-6 flex items-center gap-2 pb-4 border-b-[1.5px] border-black">
                Mục lục
            </Label>
            <nav aria-label="Table of contents">
                <ul className="space-y-0 text-sm max-h-auto overflow-auto scroll-custom pr-3">
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            className="relative"
                        >
                            <Link
                                href={`#${heading.id}`}
                                className={`
                                    block text-black hover:bg-black hover:text-white
                                    transition-all duration-200 px-3 py-2.5 rounded-none
                                    focus:outline-none focus:bg-black focus:text-white
                                    ${heading.level === 1 ?
                                        'font-bold text-xs uppercase tracking-widest border-b border-gray-200 last:border-b-0' :
                                        ''
                                    }
                                    ${heading.level === 2 ? 'pl-6 text-xs font-bold border-l-2 border-black ml-3' : ''}
                                    ${heading.level === 3 ? 'pl-10 text-xs font-medium border-l-2 border-gray-300 ml-3 text-gray-600 hover:text-white' : ''}
                                `}
                                >
                                <span className="flex items-center">
                                    <DynamicReactMarkdown components={{ p: React.Fragment }}>
                                        {heading.level === 3 ? `— ${heading.text}` : heading.text}
                                    </DynamicReactMarkdown>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default BlogTableOfContents;