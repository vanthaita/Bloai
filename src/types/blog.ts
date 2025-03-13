export interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  publishDate: string;
  readTime: string;
  image: string;
  tags: string[];
  comments: Comment[];
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
