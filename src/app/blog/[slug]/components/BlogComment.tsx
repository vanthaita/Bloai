import React, { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { api } from '@/trpc/react'

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
        <div className="max-w-2xl mx-auto mt-12 px-4 sm:px-0">
            <h2 className="text-2xl font-bold mb-6 text-[#3A6B4C]">Bình luận ({comments.length})</h2>

            <div className="mb-8 border border-gray-200 rounded-lg p-4"> 
                <div className="flex gap-4 mb-4 items-start"> 
                    {session?.user?.image ? (
                        <Image
                            src={session.user.image}
                            alt={session.user.name || 'Ảnh đại diện'}
                            width={40}
                            height={40}
                            className="rounded-full object-cover flex-shrink-0" 
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-[#3A6B4C]/70 font-semibold">
                            <span className="text-lg">
                                {session?.user?.name?.charAt(0).toUpperCase() || 'K'} 
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            {!session && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Tên <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6B4C]/50 focus:border-[#3A6B4C]"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email <span className="text-red-500">*</span> (sẽ không hiển thị công khai)
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6B4C]/50 focus:border-[#3A6B4C]" 
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <textarea
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={session ? "Viết bình luận của bạn..." : "Viết bình luận của bạn (bắt buộc)..."} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6B4C]/50 focus:border-[#3A6B4C] resize-none"
                            />

                            {error && (
                                <p className="mt-2 text-sm text-red-600">{error}</p>
                            )}

                            <div className="mt-3 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-[#3A6B4C] text-white rounded-md hover:bg-[#2e543c] focus:outline-none focus:ring-2 focus:ring-[#3A6B4C]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out" 
                                >
                                    {isSubmitting ? 'Đang đăng...' : 'Đăng bình luận'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-gray-500 text-center italic">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 items-start"> 
                            <div className="flex-shrink-0">
                                {comment.author?.image ? (
                                    <Image
                                        src={comment.author.image}
                                        alt={comment.author.name || 'Ảnh đại diện'}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[#3A6B4C]/70 font-semibold"> 
                                        <span className="text-lg">
                                            {comment.author?.name?.charAt(0)?.toUpperCase() || 'N'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200"> 
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-800">
                                            {comment.author?.name || 'Ẩn danh'}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 mb-2 leading-relaxed">{comment.content}</p>

                                    <div className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default BlogComments;