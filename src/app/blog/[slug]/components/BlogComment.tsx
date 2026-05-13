import React, { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { api } from '@/trpc/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaUser } from '@/components/icons'

interface BlogCommentProps {
  slug: string
}
const LIMIT = 4;

const BlogComments = ({ slug }: BlogCommentProps) => {
    const { data: session } = useSession();
    const [content, setContent] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('');

    const { data: comments = [], refetch } = api.blog.listBySlug.useQuery({
        slug,
    })

    const addCommentMutation = api.blog.addComment.useMutation({
        onSuccess: () => {
            setContent('')
            setName('')
            setEmail('')
            setIsSubmitting(false)
            refetch()
        },
        onError: (err) => {
            const errorMessage = err.message || 'Đăng bình luận thất bại';
            setError(errorMessage)
            setIsSubmitting(false)
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!content.trim()) { 
            setError('Nội dung bình luận không được để trống');
            return;
        }

        if (!session) {
            if (!name.trim() || !email.trim()) {
                 setError('Vui lòng điền tên và email để đăng bình luận');
                return;
            }
             if (!/\S+@\S+\.\S+/.test(email.trim())) {
                 setError('Vui lòng nhập địa chỉ email hợp lệ');
                 return;
             }
        }

        setIsSubmitting(true)

        try {
            await addCommentMutation.mutateAsync({
                slug,
                content: content.trim(), 
                ...(session ? {} : { name: name.trim(), email: email.trim() })
            })
        } catch (err) {
        }
    }

    return (
        <div className="w-full mt-16 pt-8">
            <h2 className="text-2xl font-bold text-black uppercase tracking-widest mb-8 border-b-[3px] border-black pb-2 inline-block">
                Bình luận ({comments.length})
            </h2>

            <div className="mb-12 border-[1.5px] border-black p-6 bg-white"> 
                <div className="flex gap-4 mb-4 items-start"> 
                    {session?.user?.image ? (
                        <Image
                            src={session.user.image}
                            alt={session.user.name || 'Ảnh đại diện'}
                            width={48}
                            height={48}
                            className="rounded-none border-[1.5px] border-black object-cover flex-shrink-0" 
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-none border-[1.5px] border-black bg-black flex items-center justify-center flex-shrink-0 text-white font-bold">
                            <span className="text-xl">
                                {session?.user?.name?.charAt(0).toUpperCase() || 'K'} 
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                        <div className="flex flex-col gap-4">
                            {!session && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-black mb-2">
                                                Tên <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-3 border-[1.5px] border-black rounded-none focus:outline-none focus:ring-1 focus:ring-black bg-white text-black"
                                                placeholder="Tên của bạn..."
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-black mb-2">
                                                Email <span className="text-red-500">*</span> (Ẩn)
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-3 border-[1.5px] border-black rounded-none focus:outline-none focus:ring-1 focus:ring-black bg-white text-black" 
                                                placeholder="Email của bạn..."
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-black mb-2">
                                    Nội dung bình luận
                                </label>
                                <textarea
                                    rows={4}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={session ? "Viết bình luận của bạn..." : "Viết bình luận của bạn (bắt buộc)..."} 
                                    className="w-full px-4 py-3 border-[1.5px] border-black rounded-none focus:outline-none focus:ring-1 focus:ring-black resize-y bg-white text-black"
                                />
                            </div>

                            {error && (
                                <p className="text-sm font-bold text-red-600 bg-red-50 border border-red-200 p-3">{error}</p>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-black text-white border-[1.5px] border-black rounded-none font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white" 
                                >
                                    {isSubmitting ? 'ĐANG ĐĂNG...' : 'ĐĂNG BÌNH LUẬN'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-black italic font-medium p-6 border-[1.5px] border-black bg-gray-50 text-center">
                        Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 items-start border-[1.5px] border-black p-6 bg-white"> 
                            <div className="flex-shrink-0">
                                {comment.author?.image ? (
                                    <Avatar className='h-12 w-12 rounded-none border-[1.5px] border-black'>
                                        <AvatarImage 
                                            src={comment.author.image || 'https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_auto/v1746885273/y3hpblcst5qn3j5aah1l.svg'} 
                                            alt={comment.author.name || 'User avatar'}
                                            className="object-cover rounded-none"
                                        />
                                        <AvatarFallback className="bg-black text-white rounded-none font-bold text-lg">
                                            {comment.author.name ? (
                                            comment.author.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                                            ) : (
                                            <FaUser className="w-5 h-5 text-white" />
                                            )}
                                        </AvatarFallback>
                                        </Avatar>
                                ) : (
                                    <div className="w-12 h-12 rounded-none border-[1.5px] border-black bg-black flex items-center justify-center text-white font-bold"> 
                                        <span className="text-xl">
                                            {comment.author?.name?.charAt(0)?.toUpperCase() || 'N'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                                    <span className="font-bold text-black uppercase tracking-widest text-sm">
                                        {comment.author?.name || 'Ẩn danh'}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' 
                                        })}
                                    </span>
                                </div>

                                <p className="text-black font-medium leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default BlogComments;