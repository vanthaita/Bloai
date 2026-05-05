import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { Author } from '@/types/helper.type';

interface AuthorCardProps {
    author: Author | null;
    className?: string;
    imageSize?: number;
    showSocials?: boolean;
}

const AuthorCard: React.FC<AuthorCardProps> = ({
    author,
    className = '',
    imageSize = 96,
    showSocials = true,
}) => {
    if (!author) return null;

    const socialLinks = [
        { platform: 'Twitter', url: author.socials?.twitter, Icon: FaTwitter, label: "Author's Twitter Profile" },
        { platform: 'Facebook', url: author.socials?.facebook, Icon: FaFacebook, label: "Author's Facebook Profile" },
        { platform: 'LinkedIn', url: author.socials?.linkedin, Icon: FaLinkedin, label: "Author's LinkedIn Profile" },
    ].filter(link => link.url);

    return (
        <div className={`flex flex-col sm:flex-row items-center text-center sm:text-left border-[1.5px] border-black p-8 bg-white gap-8 w-full ${className}`}>
            <div className="shrink-0">
                <Image
                    src={author.image || '/images/fallback-avatar.png'}
                    alt={author.name ? `${author.name}'s Avatar` : 'Author Avatar'}
                    width={imageSize}
                    height={imageSize}
                    className="rounded-none object-cover border-[1.5px] border-black"
                    priority={imageSize > 80}
                    quality={80}
                    unoptimized={!author.image || author.image.startsWith('/')}
                />
            </div>
            <div className="flex flex-col flex-1 items-center sm:items-start">
                <h3 className="text-xl font-bold uppercase tracking-widest text-black mb-4">{author.name || 'Unknown Author'}</h3>
                <p className="text-black font-medium mb-6 leading-relaxed max-w-lg">
                    {author.bio || 'The author shares insights on AI, machine learning, and tech.'}
                </p>
                {showSocials && socialLinks.length > 0 && (
                     <div className="flex gap-3 items-center justify-center sm:justify-start">
                        {socialLinks.map(({ platform, url, Icon, label }) => (
                             <Link
                                 key={platform}
                                 href={url!}
                                 className="p-2 border-[1.5px] border-black hover:bg-black hover:text-white text-black bg-white transition-colors rounded-none"
                                 target="_blank"
                                 rel="noopener noreferrer nofollow"
                                 aria-label={label}
                                 title={label}
                                >
                                <Icon className="w-4 h-4" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthorCard;