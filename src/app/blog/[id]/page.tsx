import React from 'react';
import RelatedPosts from '@/components/blog/RelatedPosts';
import BlogContent from '@/components/blog/BlogContent';
import Discussion from '@/components/blog/Discussion';
import { Blog } from '@/types/blog';

// Thêm params để lấy id từ URL
interface PageProps {
  params: {
    id: string;
  };
}

// Tạm thời mock data, sau này sẽ fetch từ API/Database
async function fetchBlogData(id: string): Promise<Blog> {
  // Mock data with longer content and random image
  return {
    id,
    title: "Chat with Posts Using AI: Transforming Communication",
    content: `
      ### Introduction

      In the ever-evolving world of technology, artificial intelligence (AI) has become a pivotal force in transforming how we communicate. From chatbots to virtual assistants, AI is reshaping the landscape of digital interaction. In this blog post, we will explore how AI is being used to enhance communication, particularly through the use of chat with posts.

      ### The Rise of AI in Communication

      Over the past decade, AI has made significant strides in natural language processing (NLP), enabling machines to understand and respond to human language with increasing accuracy. This advancement has paved the way for AI-driven communication tools that can engage users in meaningful conversations.

      One of the most notable applications of AI in communication is the development of chatbots. These AI-powered programs are designed to simulate human conversation, providing users with instant responses to their queries. Chatbots are now widely used in customer service, marketing, and even healthcare, where they assist patients in scheduling appointments and accessing medical information.

      ### Enhancing User Experience with AI

      AI's ability to analyze vast amounts of data in real-time allows it to personalize communication experiences for users. By understanding user preferences and behavior, AI can tailor responses to meet individual needs, creating a more engaging and satisfying interaction.

      For instance, AI-driven chat platforms can recommend content based on a user's interests, ensuring that they receive relevant information. This level of personalization not only enhances user experience but also increases engagement and retention.

      ### Challenges and Ethical Considerations

      While AI offers numerous benefits in communication, it also presents challenges and ethical considerations. One major concern is the potential for AI to perpetuate biases present in the data it is trained on. If not carefully managed, AI systems can inadvertently reinforce stereotypes and discrimination.

      Additionally, the use of AI in communication raises questions about privacy and data security. As AI systems collect and analyze user data, it is crucial to ensure that this information is handled responsibly and transparently.

      ### The Future of AI in Communication

      Looking ahead, the future of AI in communication is promising. As technology continues to advance, we can expect AI to play an even more integral role in how we interact with digital platforms. From improving accessibility for individuals with disabilities to enabling real-time language translation, the possibilities are endless.

      In conclusion, AI is revolutionizing the way we communicate, offering new opportunities for engagement and interaction. As we continue to explore the potential of AI in communication, it is essential to address the challenges and ethical considerations that come with it. By doing so, we can harness the power of AI to create a more connected and inclusive world.

      ### Conclusion

      The integration of AI into communication is not just a trend; it is a transformative shift that is here to stay. As we embrace this change, it is important to remain mindful of the impact AI has on our interactions and to strive for a future where technology enhances, rather than hinders, our ability to connect with one another.
    `,
    author: {
      name: "John Doe",
      avatar: `https://picsum.photos/100/100?random=${Math.floor(Math.random() * 1000)}` // Random avatar image
    },
    publishDate: "2024-03-15",
    readTime: "5 min read",
    image: `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 1000)}`,
    comments: [],
    tags: ["AI", "Technology"]
  };
}

async function fetchRelatedPosts(id: string): Promise<Blog[]> {
  // Mock data with random images
  return [
    {
      id: "1",
      title: "Related Post 1",
      content: "Short content for related post 1...",
      author: {
        name: "Jane Smith",
        avatar: "/avatar.jpg"
      },
      publishDate: "2024-03-14",
      readTime: "3 min read",
      image: `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 1000)}`,
      comments: [],
      tags: ["AI", "Programming"]
    },
    // Thêm các related posts khác...
  ];
}

export default async function BlogPost({ params }: PageProps) {
  // Đảm bảo params.id tồn tại trước khi sử dụng
  if (!params?.id) {
    return <div>Invalid blog ID</div>;
  }

  try {
    const blogData = await fetchBlogData(params.id);
    const relatedPosts = await fetchRelatedPosts(params.id);

    if (!blogData) {
      return <div>Blog not found</div>;
    }

    return (
      <div className="flex min-h-screen">
        {/* Main content */}
        <div className="flex-1 max-w-4xl mx-auto px-4 py-6">
          <BlogContent blog={blogData} />
          <Discussion comments={blogData.comments} />
        </div>
        
        {/* Right sidebar - Related posts */}
        <div className="hidden lg:block w-80 p-6 border-l">
          <RelatedPosts posts={relatedPosts} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return <div>Error loading blog</div>;
  }
}
