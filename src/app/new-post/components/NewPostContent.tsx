'use client'
import React, { useCallback, useState, useEffect, useMemo, ChangeEvent } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import slugify from 'slugify'
import { ArrowLeft, HelpCircle, Lightbulb } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button'
import { env } from '@/env'
import { api } from '@/trpc/react'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import useRefetch from '@/hook/use-refresh'
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { TitleSlugInput } from './TitleSlugInput';
import { DescriptionInputs } from './DescriptionInputs';
import { ThumbnailUploader } from './ThumbnailUploader';
import { ContentEditorWithContext } from './ContentEditorWithContext';
import { TagsManagementInput } from './TagsManagementInput';
import { SEOPreviewDisplay } from './SEOPreviewDisplay';
import { AdvancedSEOFormFields } from './AdvancedSEOFormFields';
import { SubmissionArea } from './SubmissionArea';
import { useCurrentUser } from '@/hook/use-current-user'
import Loading from '@/components/loading'

const NewPostContent = () => {
    const [tags, setTags] = useState<string[]>([])
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string>('')
    const [content, setContent] = useState('**Xin chào thế giới!!!**')
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [metaDescription, setMetaDescription] = useState('')
    const [imageAlt, setImageAlt] = useState('')
    const [canonicalUrl, setCanonicalUrl] = useState('')
    const [ogTitle, setOgTitle] = useState('')
    const [ogDescription, setOgDescription] = useState('')
    const [isGeneratingSlugManually, setIsGeneratingSlugManually] = useState(false);
    const [readTime, setReadTime] = useState(0)

    const [isGeneratingMetaDescription, setIsGeneratingMetaDescription] = useState(false);
    const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
    const [isGeneratingOgTitle, setIsGeneratingOgTitle] = useState(false);
    const [isGeneratingOgDescription, setIsGeneratingOgDescription] = useState(false);
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
    const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);
    const [isGeneratingEnhanceContent,setIsGeneratingEnhanceContent] = useState(false);

    const [isAutoCanonical, setIsAutoCanonical] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const { mutateAsync: createBlog } = api.blog.create.useMutation();
    const { mutateAsync: updateBlog } = api.blog.update.useMutation();
    const refresh = useRefetch();
    const router = useRouter();
    const [debouncedTitle] = useDebounce(title, 300);
    const [debouncedContent] = useDebounce(content, 500);

    const currentUser = useCurrentUser();
    const searchParams = useSearchParams();
    const blogSlug = searchParams.get('blogSlug') as string;
    const { data: blogData, isLoading: isBlogLoading } = api.blog.getBlog.useQuery({ slug: blogSlug }, {
        enabled: !!blogSlug,
        select: (data) => ({
            ...data,
            tags: data.tags.map(tag => tag.name), 
        }),
    });

    useEffect(() => {
        if (blogSlug && blogData && currentUser?.id !== blogData.authorId) {
            toast.error('Bạn không có quyền chỉnh sửa bài viết này');
            router.push('/');
        }
    }, [blogSlug, blogData, currentUser?.id, router]);

    useEffect(() => {
        setIsLoading(!!blogSlug && isBlogLoading);
    }, [blogSlug, isBlogLoading]);

    useEffect(() => {
        if (blogData) {
            setTitle(blogData.title || '');
            setSlug(blogData.slug || '');
            setContent(blogData.content || '');
            setTags(blogData.tags || []);
            setExistingThumbnailUrl(blogData.imageUrl || '');
            setMetaDescription(blogData.metaDescription || '');
            setImageAlt(blogData.imageAlt || '');
            setCanonicalUrl(blogData.canonicalUrl || '');
            setOgTitle(blogData.ogTitle || '');
            setOgDescription(blogData.ogDescription || '');
            setReadTime(blogData.readTime || 0);
            
            if (blogData.canonicalUrl && blogData.canonicalUrl !== `${env.NEXT_PUBLIC_APP_URL}/blog/${blogData.slug}`) {
                setIsAutoCanonical(false);
            }
        }
    }, [blogData]);

    useEffect(() => {
        if (isAutoCanonical && slug) {
            setCanonicalUrl(`${env.NEXT_PUBLIC_APP_URL}/blog/${slug}`);
        }
        if (isAutoCanonical && !canonicalUrl && slug) {
            setCanonicalUrl(`${env.NEXT_PUBLIC_APP_URL}/blog/${slug}`);
        }
    }, [slug, isAutoCanonical, canonicalUrl]);

    useEffect(() => {
        if (debouncedTitle && !isGeneratingSlugManually) {
            const generatedSlug = slugify(debouncedTitle, { lower: true, strict: true, trim: true });
            setSlug(generatedSlug);
        }
    }, [debouncedTitle, isGeneratingSlugManually]);

    useEffect(() => {
        const words = debouncedContent.split(/\s+/).filter(Boolean).length;
        const time = Math.ceil(words / 200);
        setReadTime(time);
    }, [debouncedContent]);

    useEffect(() => {
        if (!ogTitle && title) setOgTitle(title);
    }, [title, ogTitle]);

    useEffect(() => {
        if (!ogDescription) {
            const fallback = metaDescription;
            if (fallback) setOgDescription(fallback);
        }
    }, [metaDescription, ogDescription]);

    const isSEOValid = useMemo(() => {
        return (
            metaDescription.length >= 120 &&
            metaDescription.length <= 160 &&
            title.trim().length > 0 &&
            slug.trim().length > 0 &&
            (thumbnail !== null || existingThumbnailUrl !== '')
        );
    }, [metaDescription, slug, title, thumbnail, existingThumbnailUrl]);

    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        setIsGeneratingSlugManually(false); 
    }, []);

    const handleSlugChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const sanitizedSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setSlug(sanitizedSlug);
        setIsGeneratingSlugManually(true);
    }, []);

    const handleToggleManualSlug = useCallback(() => {
        setIsGeneratingSlugManually(prev => !prev);
    }, []);

    const handleMetaDescriptionChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setMetaDescription(e.target.value);
    }, []);

    const handleCanonicalUrlChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setCanonicalUrl(e.target.value);
        setIsAutoCanonical(!e.target.value);
    }, []);

    const handleOgTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setOgTitle(e.target.value);
    }, []);

    const handleOgDescriptionChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setOgDescription(e.target.value);
    }, []);

    const handleImageAltChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setImageAlt(e.target.value.slice(0, 125));
    }, []);

    const handleContentChange = useCallback((value: string | undefined) => {
        setContent(value ?? '');
    }, []);

    const handleThumbnailChange = useCallback((file: File | null) => {
        setThumbnail(file);
        if (file && !imageAlt && title) {
            setImageAlt(title.slice(0, 125));
        }
        if (!file) {
            setImageAlt(''); 
        }
    }, [imageAlt, title]); 

    const uploadImageToCloudinary = useCallback(async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
            if (response?.data?.secure_url) {
                return response.data.secure_url;
            } else {
                console.error('Cloudinary upload failed: No secure_url found', response);
                toast.error('Lỗi tải ảnh lên Cloudinary: Không nhận được URL.');
                return null;
            }
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            toast.error(`Lỗi tải ảnh lên Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return null;
        }
    }, []); 

    const handleSubmit = useCallback(async () => {
        if (!isSEOValid) {
            let errorMessages: string[] = ['Vui lòng điền đầy đủ thông tin và tối ưu SEO:'];
            if (!title.trim()) errorMessages.push('- Tiêu đề còn trống.');
            if (!slug.trim()) errorMessages.push('- Đường dẫn (Slug) còn trống.');
            if (!thumbnail && !existingThumbnailUrl) errorMessages.push('- Ảnh thu nhỏ chưa được chọn.');
            if (metaDescription.length < 120 || metaDescription.length > 160) {
                errorMessages.push(`- Meta Description phải từ 120-160 ký tự (hiện tại ${metaDescription.length}).`);
            }
            toast.error(errorMessages.join('\n'), { autoClose: 7000, style: { whiteSpace: 'pre-line' } });
            return;
        }

        setIsSubmitting(true);
        try {
            let imageUrl = existingThumbnailUrl;
            
            if (thumbnail) {
                const uploadedUrl = await uploadImageToCloudinary(thumbnail);
                if (!uploadedUrl) {
                    setIsSubmitting(false); 
                    return; 
                }
                imageUrl = uploadedUrl;
            }

            const finalSlug = slug.trim();
            const finalTitle = title.trim();
            const finalMetaDesc = metaDescription.trim();
            const finalCanonical = canonicalUrl.trim() || `${env.NEXT_PUBLIC_APP_URL}/blog/${finalSlug}`;
            const finalOgTitle = ogTitle.trim() || finalTitle; 
            const finalOgDesc = ogDescription.trim() || finalMetaDesc; 

            const postData = {
                title: finalTitle,
                slug: finalSlug,
                content: content, 
                tags: tags, 
                thumbnail: imageUrl,
                metaDescription: finalMetaDesc,
                imageAlt: imageAlt.trim().slice(0, 125),
                canonicalUrl: finalCanonical,
                ogTitle: finalOgTitle,
                ogDescription: finalOgDesc,
                readTime: readTime, 
            };

            if (blogSlug && blogData) {
                await updateBlog({
                    id: blogData.id,
                    ...postData
                });
                toast.success('Bài viết đã được cập nhật thành công!');
            } else {
                await createBlog(postData);
                toast.success('Bài viết đã được xuất bản thành công!');
            }

            refresh(); 
            router.push(`/blog/${finalSlug}`);

        } catch (error: any) {
            console.error('Error submitting form:', error);
            if (error?.message !== 'Cloudinary upload failed: No secure_url found' && !(error?.message?.includes('Lỗi tải ảnh lên Cloudinary'))) {
                toast.error(`Đã xảy ra lỗi: ${error.message || 'Vui lòng thử lại!'}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [
        isSEOValid, uploadImageToCloudinary, thumbnail, title, slug, content, tags,
        metaDescription, imageAlt, canonicalUrl, ogTitle, ogDescription,
        readTime, createBlog, updateBlog, router, refresh, blogSlug, blogData, existingThumbnailUrl
    ]);

    return (
        <TooltipProvider>
            {isLoading ? (
                <Loading />
            ) : ( 
            <div className="bg-white min-h-screen p-1 md:p-4">
               <div className="space-y-4 mb-6">
                <div 
                    onClick={() => router.back()} 
                    className="cursor-pointer group"
                    aria-label="Quay lại trang trước"
                >
                    <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 px-3 py-2 transition-all hover:bg-accent hover:pl-2"
                    >
                    <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Trở lại danh sách</span>
                    </Button>
                </div>
                <div className="bg-blue-50/80 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 mt-0.5 text-blue-600 dark:text-blue-300 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-100 mb-1.5">
                        Lưu ý quan trọng khi tạo bài viết chuẩn SEO
                        </h3>
                        <ol className="list-decimal list-inside space-y-1.5 text-sm text-blue-700 dark:text-blue-300">
                        <li>
                            <span className="font-medium">Tạo Tags trước:</span> Xác định từ khóa chính 
                            và phụ để hệ thống gợi ý nội dung phù hợp
                        </li>
                        <li>
                            <span className="font-medium">Tiêu đề (Title):</span> Chứa từ khóa chính, 
                            dưới 60 ký tự và thu hút click
                        </li>
                        <li>
                            <span className="font-medium">Mô tả (Description):</span> Tóm tắt nội dung 
                            trong 150-160 ký tự, chứa từ khóa
                        </li>
                        <li>
                            <span className="font-medium">Header (H2, H3):</span> Phân cấp rõ ràng, 
                            mỗi section nên chứa ít nhất 1 từ khóa phụ
                        </li>
                        </ol>
                    </div>
                    </div>
                </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                            {blogSlug ? 'Chỉnh Sửa Bài Viết' : 'Tạo Bài Viết Mới'}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-5 h-5 p-0">
                                        <HelpCircle className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Điền đầy đủ các trường (*) và tối ưu SEO.</p></TooltipContent>
                            </Tooltip>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                        <div className="lg:col-span-3 space-y-5">
                            <TitleSlugInput
                                title={title}
                                onTitleChange={handleTitleChange}
                                setTitle={setTitle}
                                slug={slug}
                                onSlugChange={handleSlugChange}
                                isGeneratingSlugManually={isGeneratingSlugManually}
                                onToggleManualSlug={handleToggleManualSlug}
                                isGeneratingTitle={isGeneratingTitle}
                                setIsGeneratingTitle={setIsGeneratingTitle}
                                contentForAI={content} 
                            />

                            <DescriptionInputs
                                metaDescription={metaDescription}
                                onMetaDescriptionChange={handleMetaDescriptionChange}
                                setMetaDescription={setMetaDescription} 
                                isGeneratingExcerpt={isGeneratingExcerpt}
                                setIsGeneratingExcerpt={setIsGeneratingExcerpt}
                                isGeneratingMetaDesc={isGeneratingMetaDescription}
                                setIsGeneratingMetaDesc={setIsGeneratingMetaDescription}
                                isSEOValid={isSEOValid}
                                contentForAI={content} 
                            />

                            <ThumbnailUploader
                                thumbnail={thumbnail}
                                onThumbnailChange={handleThumbnailChange}
                                imageAlt={imageAlt}
                                onImageAltChange={handleImageAltChange}
                                isSEOValid={isSEOValid}
                                existingThumbnailUrl={existingThumbnailUrl}
                            />

                            <ContentEditorWithContext
                                content={content}
                                onContentChange={handleContentChange}
                                readTime={readTime}
                                isGeneratingEnhanceContent={isGeneratingEnhanceContent}
                                setIsGeneratingEnhanceContent={(setIsGeneratingEnhanceContent)}
                            />
                        </div>

                        <div className="space-y-6 lg:border-l lg:pl-6">
                            <SEOPreviewDisplay
                                title={title}
                                slug={slug}
                                metaDescription={metaDescription}
                            />

                            <AdvancedSEOFormFields
                                canonicalUrl={canonicalUrl}
                                onCanonicalUrlChange={handleCanonicalUrlChange}
                                isAutoCanonical={isAutoCanonical}
                                setIsAutoCanonical={setIsAutoCanonical}
                                ogTitle={ogTitle}
                                onOgTitleChange={handleOgTitleChange}
                                setOgTitle={setOgTitle}
                                ogDescription={ogDescription}
                                onOgDescriptionChange={handleOgDescriptionChange}
                                setOgDescription={setOgDescription} 
                                isGeneratingOgTitle={isGeneratingOgTitle}
                                setIsGeneratingOgTitle={setIsGeneratingOgTitle}
                                isGeneratingOgDescription={isGeneratingOgDescription}
                                setIsGeneratingOgDescription={setIsGeneratingOgDescription}
                                slug={slug} 
                                contentForAI={content}
                            />

                            <TagsManagementInput
                                tags={tags}
                                setTags={setTags} 
                                isGeneratingKeywords={isGeneratingKeywords}
                                setIsGeneratingKeywords={setIsGeneratingKeywords}
                                contentForAI={content}
                            />

                            <Separator />
                        </div>
                    </CardContent>

                    <CardFooter>
                        <SubmissionArea
                            isSEOValid={isSEOValid}
                            isSubmitting={isSubmitting}
                            onSubmit={handleSubmit}
                            isUpdateMode={!!blogSlug}
                        />
                    </CardFooter>
                </Card>
            </div>)}
        </TooltipProvider>
    )
}

export default NewPostContent;