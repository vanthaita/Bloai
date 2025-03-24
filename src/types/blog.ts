interface BlogPost {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  imageUrl: string | null;
  imageAlt: string | null;
  authorId: string;
  publishDate: Date;
  updatedAt: Date;
  readTime: number;
  views: number;
  likes: number;
  keywords: string[];
  canonicalUrl: string | null;
  structuredData: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  twitterCard: string | null;
  featured: boolean;
  tags: { id: string; name: string; description: string | null }[];
  author: {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    bio: string | null;
  } | null;
}


export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}
