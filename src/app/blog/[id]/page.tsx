'use client'
import React, { useState, useEffect } from 'react';
import { Share, EyeIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/hook/use-current-user';
import { FaComments, FaFacebook, FaLinkedin, FaTwitter, FaUser } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface BlogPost {
  title: string;
  description: string;
  content: string;
  date: Date;
  author: string;
  tags: string[];
}

interface Author {
  name: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  social: {
    twitter: string;
    linkedin: string;
  };
}
interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  replies: Comment[];
}
const CommentForm = ({ onSubmit }: { onSubmit: (content: string) => void }) => {
  const [content, setContent] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(content);
        setContent('');
      }}
    >
      <div className='flex justify-start items-start gap-x-4'>
        <FaUser className="w-8 h-8 text-gray-600 mt-2" />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className='w-full p-2 border-2 border-black resize-none rounded-xl'
          placeholder='Write your comment here...'
          rows={4}
          required
        />
      </div>
      <div className='flex gap-4 justify-end mt-4'>
        <button
          type='submit'
          className='px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded-xl'
        >
          Post Comment
        </button>
      </div>
    </form>
  );
};
const CommentComponent = ({ comment, level, activeReplyId, setActiveReplyId, handleReplySubmit }: {
  comment: Comment;
  level: number;
  activeReplyId: string | null;
  setActiveReplyId: (id: string | null) => void;
  handleReplySubmit: (parentId: string, content: string) => void;
}) => {
  const [replyContent, setReplyContent] = useState('');

  return (
    <div className={`relative ml-${level * 8}`}>
      <div className='border-b border-gray-200 pb-4'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-2'>
            <FaUser className="w-5 h-5 text-gray-600" />
            <span className='font-semibold'>{comment.author}</span>
          </div>
          <span className='text-sm text-gray-500'>{comment.timestamp}</span>
        </div>
        <p className='text-gray-700 ml-7'>{comment.content}</p>

        <button
          onClick={() => setActiveReplyId(comment.id)}
          className='ml-7 mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1'
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Reply
        </button>

        {activeReplyId === comment.id && (
          <div className='ml-7 mt-4'>
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder='Write your reply...'
              className='mb-2'
            />
            <div className='flex gap-2 justify-end'>
              <button
                onClick={() => {
                  handleReplySubmit(comment.id, replyContent);
                  setReplyContent('');
                  setActiveReplyId(null);
                }}
                className='px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg text-sm'
              >
                Post Reply
              </button>
              <button
                onClick={() => setActiveReplyId(null)}
                className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm'
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {comment.replies.map((reply) => (
        <CommentComponent
          key={reply.id}
          comment={reply}
          level={level + 1}
          activeReplyId={activeReplyId}
          setActiveReplyId={setActiveReplyId}
          handleReplySubmit={handleReplySubmit}
        />
      ))}
    </div>
  );
};


export default function BlogPostPage() {
  const [views, setViews] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const user = useCurrentUser();
  console.log(user);
  const blogPost: BlogPost = {
    title: 'Boost Your Coding Velocity: Unleashing the Power of AI with Cursor IDE',
    description: 'Discover how Cursor IDE leverages cutting-edge AI to revolutionize your coding workflow, from instant code generation to intelligent debugging, making development faster and more intuitive than ever.',
    content: `
  ## The Dawn of AI-Powered Development: Meet Cursor IDE

  In the ever-evolving world of software development, efficiency and speed are paramount.  We're constantly searching for tools that not only simplify our tasks but also amplify our creative potential. Enter **Cursor IDE**, a revolutionary code editor that's rapidly changing the way developers write code, thanks to its deeply integrated and incredibly powerful AI.

  Cursor IDE isn't just another text editor with a few AI bells and whistles. It's built from the ground up with AI at its core, transforming mundane coding tasks into effortless flows. Forget endless boilerplate, repetitive function writing, or wrestling with syntax errors for hours. Cursor empowers you to focus on the bigger picture – architecture, logic, and innovation – while its AI engine takes care of the nitty-gritty.

  ### Code Generation That Feels Like Magic

  Imagine typing a comment describing a function you need, and Cursor IDE instantly generates the code, often perfectly tailored to your project's context. Sounds like science fiction? With Cursor, it's everyday reality. Whether you're crafting utility functions, complex algorithms, or even entire components, the AI-powered code generation is astoundingly accurate and context-aware.

  **Example:** Need a function to fetch data from an API and handle errors? Simply comment:

  \`\`\`javascript
  // Function to fetch user data from /api/users and handle fetch errors
  \`\`\`

  ...and watch as Cursor intelligently generates a robust function complete with error handling, promises, and type hints (if you're using TypeScript). It's not just about saving keystrokes; it's about drastically reducing cognitive load and keeping your momentum high.

  ### Beyond Autocomplete: Intelligent Code Completion and Suggestions

  Traditional autocomplete is helpful, but Cursor's AI-driven completion is on a different level. It anticipates not just keywords but entire code blocks, understanding your coding style and the patterns within your codebase. It suggests code completions that are not only syntactically correct but also semantically relevant to what you're building.

  This "smart completion" extends to suggesting relevant functions, variables, and even code snippets based on your project's structure and imported libraries. It's like having a senior developer pair programming with you, constantly offering insightful suggestions to accelerate your coding process.

  ### AI-Powered Debugging and Code Explanation

  Stuck with a bug you can't quite decipher? Cursor’s AI debugging assistant can step in to analyze your code, identify potential issues, and suggest solutions.  It goes beyond simple linting and delves into the logic of your code to help pinpoint elusive errors.

  Furthermore, the AI can explain complex code snippets in plain English.  Encounter a piece of legacy code you don't understand, or struggling to grasp a complex library function?  Cursor can provide clear and concise explanations, breaking down the code's functionality step by step. This feature is invaluable for onboarding new team members, understanding unfamiliar codebases, or simply solidifying your own understanding of intricate logic.

  ### Refactoring and Code Optimization Made Easy

  Refactoring is a crucial but often tedious part of development. Cursor’s AI assists in streamlining this process, suggesting intelligent refactorings to improve code readability, performance, and maintainability.  It can identify opportunities to simplify complex logic, extract reusable components, or optimize code for better performance, often with just a few clicks.

  Imagine highlighting a block of code and asking Cursor to "refactor this for readability."  The AI analyzes the code, proposes cleaner structures, and implements the refactoring, saving you valuable time and ensuring a more polished and maintainable codebase.

  ### The Future is Intelligent: Embrace Cursor IDE

  Cursor IDE isn't just the next step in code editors; it's a leap forward. It’s a testament to how AI can truly augment human creativity and productivity in software development. By offloading repetitive tasks, providing intelligent assistance, and fostering a more intuitive coding experience, Cursor empowers developers to build better software, faster.

  If you're looking to experience the future of coding today,  give Cursor IDE a try. Prepare to be amazed at how AI can transform your development workflow and unlock a new level of coding velocity.  The age of AI-powered development is here, and Cursor IDE is leading the charge.
    `,
    date: new Date('2024-03-15'),
    author: 'Sarah Johnson',
    tags: ['ai', 'ide', 'cursor', 'coding', 'productivity', 'developer tools']
  };

  const author: Author = {
    name: 'Sarah Johnson',
    bio: 'Senior Full Stack Developer specializing in modern web technologies. Passionate about developer experience and clean code.',
    avatar: 'https://picsum.photos/id/237/200/200',
    followers: 2845,
    following: 342,
    social: {
      twitter: '@sarah_dev',
      linkedin: 'in/sarah-johnson-dev'
    }
  };
  const techCategories = [
    { title: "Smartphones & Accessories", amount: 150 },
    { title: "Laptops & Ultrabooks", amount: 120 },
    { title: "Tablets & E-Readers", amount: 95 },
    { title: "Smartwatches & Wearables", amount: 85 },
    { title: "Gaming Consoles & VR", amount: 55 },
    { title: "Computer Components", amount: 75 },
    { title: "PC Peripherals", amount: 200 },
    { title: "Drones & Robotics", amount: 30 },
    { title: "Smart Home Devices", amount: 110 },
    { title: "4K Monitors", amount: 90 },
    { title: "Networking Equipment", amount: 70 },
    { title: "3D Printers", amount: 40 },
    { title: "External Storage", amount: 115 },
    { title: "Camera & Photography", amount: 65 },
    { title: "Audio Equipment", amount: 180 }
  ];
  useEffect(() => {
    setViews(prev => prev + Math.floor(Math.random() * 100));
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'John Doe',
      content: 'This is a sample comment. The design looks great!',
      timestamp: '2 hours ago',
      replies: [
        {
          id: '1-1',
          author: 'Jane Smith',
          content: 'I completely agree! The AI features are amazing.',
          timestamp: '1 hour ago',
          replies: []
        }
      ]
    },
    {
      id: '2',
      author: 'Alex Johnson',
      content: 'Really love this discussion. Thanks for sharing!',
      timestamp: '1 day ago',
      replies: []
    }
  ]);

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const handleCommentSubmit = (content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      content,
      timestamp: 'Just now',
      replies: []
    };
    setComments([...comments, newComment]);
  };

  const handleReplySubmit = (parentId: string, content: string) => {
    const newReply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: 'Current User',
      content,
      timestamp: 'Just now',
      replies: []
    };

    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === parentId) {
          return { ...comment, replies: [...comment.replies, newReply] };
        } else if (comment.replies.length > 0) {
          return { ...comment, replies: updateComments(comment.replies) };
        } else {
          return comment;
        }
      });
    };

    setComments(updateComments(comments));
    setActiveReplyId(null);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex gap-12">
        <main className="flex-1 ">
          <div className="sticky top-28 hidden lg:block float-left -ml-20 mr-6 h-[calc(100vh-10rem)]">
            <div className="flex flex-col items-center gap-8 h-full">
              <div className="flex flex-col gap-6">
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                  aria-label="Share article"
                >
                  <Share className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                </button>

                <div className="flex flex-col items-center gap-2 text-gray-600">
                  <EyeIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{views.toLocaleString()}</span>
                </div>

                <div className="h-px w-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />

                <div className="flex flex-col gap-4">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Share on Twitter">
                    <FaTwitter className="w-5 h-5 text-gray-600 hover:text-[#1DA1F2]" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Share on Facebook">
                    <FaFacebook className="w-5 h-5 text-gray-600 hover:text-[#1877F2]" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Share on LinkedIn">
                    <FaLinkedin className="w-5 h-5 text-gray-600 hover:text-[#0A66C2]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <article className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex gap-2 mb-6">
                {blogPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-sm font-medium text-blue-600 rounded-full"
                  >
                    #{tag.toUpperCase()}
                  </span>
                ))}
              </div>

              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {blogPost.title}
              </h1>

              <div className="flex items-center gap-4 text-gray-500 mb-8">
                <span className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {blogPost.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="h-1 w-1 bg-gray-400 rounded-full" />
                <span>{blogPost.author}</span>
              </div>
            </div>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {blogPost.description}
            </p>

            <div className="prose prose-lg max-w-none text-gray-700 mb-12">
              {blogPost.content}
            </div>
            <div className='w-full grid grid-cols-4 gap-4'>
              {[
                { emotion: 'love', label: 'IN LOVE' },
                { emotion: 'happy-face', label: 'HAPPY' },
                { emotion: 'depressed', label: 'NOT SURE' },
                { emotion: 'shocked', label: 'OMG' }
              ].map(({ emotion, label }) => (
                <div key={emotion} className='h-44 w-full p-1 flex rounded-2xl flex-col bg-black'>
                  <div className='p-2 rounded-xl bg-white flex justify-center items-center flex-1'>
                    <div className='flex flex-col gap-y-2'>
                      <Image
                        src={`/images/${emotion}.png`}
                        alt={label}
                        width={80}
                        height={80}
                        className="w-20 h-20 mx-auto"
                      />
                      <p className='text-center'>7</p>
                    </div>
                  </div>
                  <div className='mt-2'>
                    <p className='text-center font-medium text-white'>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/*  */}
            <div className='w-full flex items-center justify-center'>
              <div className="flex flex-col justify-center items-center text-center mt-8">
                <div className="flex gap-2 mb-6">
                  {blogPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-sm font-medium text-blue-600 rounded-full"
                    >
                      #{tag.toUpperCase()}
                    </span>
                  ))}
                </div>
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={146}
                  height={146}
                  className="rounded-full object-cover mb-4 border-4 border-white shadow-lg"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{author.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
                  {author.bio}
                </p>
                <div className="flex gap-3 w-full items-center justify-center">
                  <div className="flex gap-2">
                    <a
                      href={`https://twitter.com/${author.social.twitter}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter Profile"
                    >
                      <FaTwitter className="w-5 h-5 " />
                    </a>
                    <a
                      href={`https://linkedin.com/${author.social.linkedin}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile"
                    >
                      <FaFacebook className="w-5 h-5 " />
                    </a>
                  </div>
                </div>
              </div>

            </div>
            <div className='w-full h-auto mt-4'>
              <div className='border-2 border-black p-4 rounded-xl'>
                <div className='w-full flex flex-col justify-center items-center'>
                  <div className='mb-4'>
                    <FaComments className='w-14 h-14' />
                  </div>
                  <h1 className='text-center text-xl font-medium mb-4'>WHAT DO YOU THINK?</h1>

                </div>

                <div className='space-y-6'>
                  {comments.map((comment) => (
                    <CommentComponent
                      key={comment.id}
                      comment={comment}
                      level={0}
                      activeReplyId={activeReplyId}
                      setActiveReplyId={setActiveReplyId}
                      handleReplySubmit={handleReplySubmit}
                    />
                  ))}
                </div>

                <div className='mt-8'>
                  <CommentForm onSubmit={handleCommentSubmit} />
                </div>
              </div>
            </div>
          </article>
        </main>

        <aside className="hidden lg:block w-80 xl:w-96 shrink-0">
          <div className='bg-black p-1 rounded-2xl relative'>
            <div className="flex flex-row absolute w-full justify-between gap-4 right-0 p-1 top-[40%]">
              <div className='flex flex-col gap-y-[2px] items-start'>
                {[15, 15, 20, 30, 20, 15, 10].map((width, index) => (
                  <div
                    className={`h-1 bg-black ${index === 3 ? 'w-[30px]' : `w-[${width}px]`}`}
                    key={index}
                  />
                ))}
              </div>
              <div className='flex flex-col gap-y-[2px] items-end transform -scale-y-180'>
                {[10, 15, 20, 30, 20, 15, 10].map((width, index) => (
                  <div
                    className={`h-1 bg-black ${index === 3 ? 'w-[30px]' : `w-[${width}px]`}`}
                    key={index}
                  />
                ))}
              </div>
            </div>
            <div className="p-2 bg-white rounded-xl ">
              <div className="flex flex-col items-center text-center">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover mb-4 border-4 border-white shadow-lg"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{author.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {author.bio}
                </p>

                <div className="flex gap-3 w-full items-center justify-center">
                  <div className="flex gap-2">
                    <a
                      href={`https://twitter.com/${author.social.twitter}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter Profile"
                    >
                      <FaTwitter className="w-5 h-5 " />
                    </a>
                    <a
                      href={`https://linkedin.com/${author.social.linkedin}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile"
                    >
                      <FaLinkedin className="w-5 h-5 " />
                    </a>
                  </div>
                </div>
              </div>

            </div>
            <div className='bg-black top-28  rounded-b-xl mt-1'>
              <h2 className='text-white font-medium text-xl text-center'>ABOUT ME</h2>
            </div>
          </div>

          <div className='bg-black p-1 rounded-2xl relative mt-10'>
            <div className=" top-28 p-2 bg-white rounded-xl ">
              {techCategories.map((techCategory) => {
                return (
                  <div key={techCategory.title} className="flex gap-3 relative w-full rounded-xl items-center  mb-4 text-sm  border-2  border-black font-medium">
                    <Link
                      href={`#${techCategory.title.toLowerCase()}`}
                      className="py-1 px-2 rounded-lg transition-colors"
                    >
                      {techCategory.title.toUpperCase()}
                    </Link>
                    <div className='p-1 border-2 border-black h-full rounded-xl rounded-l-[10px] absolute -right-[1.5px] cursor-pointer text-center bg-yellow-400'>
                      {techCategory.amount}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='bg-black top-28  rounded-b-xl mt-1'>
              <h2 className='text-white font-medium text-xl text-center'>CATEGORIES</h2>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}