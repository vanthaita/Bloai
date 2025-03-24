'use client'
import React, { useCallback, useState, useEffect, Suspense, lazy } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Separator } from '@/components/ui/separator'
import { Dropzone } from '@/components/Dropzone'
import slugify from 'slugify'
import { HelpCircle, TrashIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  generateMetaDescription,
  generateSEOKeywords,
  generateOpenGraphTitle,
  generateOpenGraphDescription,
  generateTitleBlog,
  generateExcerpt
} from '@/lib/action'
import Spinner from '@/components/Snipper'
import { env } from '@/env'
import { api } from '@/trpc/react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import useRefetch from '@/hook/use-refresh'
import { FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce'; 

const MDEditorComponent = lazy(() => import('@uiw/react-md-editor'));

const NewPost = () => {
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [content, setContent] = useState('**Xin chào thế giới!!!**')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [description, setDescription] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [ogTitle, setOgTitle] = useState('')
  const [ogDescription, setOgDescription] = useState('')
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false)
  const [readTime, setReadTime] = useState(0)
  const [isGeneratingMetaDescription, setIsGeneratingMetaDescription] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [isGeneratingOgTitle, setIsGeneratingOgTitle] = useState(false);
  const [isGeneratingOgDescription, setIsGeneratingOgDescription] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);
  const [isAutoCanonical, setIsAutoCanonical] = useState(true);
  const { mutateAsync: createPost } = api.blog.create.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const refresh = useRefetch();
  const router = useRouter();

  const [debouncedContent] = useDebounce(content, 300); 

  useEffect(() => {
    if (isAutoCanonical && slug) {
      setCanonicalUrl(`${env.NEXT_PUBLIC_APP_URL}/blog/${slug}`);
    }
  }, [slug, isAutoCanonical]);

  useEffect(() => {
    if (title && !isGeneratingSlug) {
      const generatedSlug = slugify(title, {
        lower: true,
        strict: true,
        trim: true
      })
      setSlug(generatedSlug)
    }
  }, [title, isGeneratingSlug])

  useEffect(() => {
    const words = debouncedContent.split(/\s+/).length; 
    const time = Math.ceil(words / 200)
    setReadTime(time)
  }, [debouncedContent]) 

  useEffect(() => {
    if (!ogTitle) setOgTitle(title)
    if (!ogDescription) setOgDescription(metaDescription || description)
  }, [title, metaDescription, description])

  const handleTagKeyDown = useCallback((e: React.KeyboardEvent) => { 
    if (['Enter', ','].includes(e.key) && tagInput.trim()) {
      e.preventDefault()
      if (tags.length < 5) {
        setTags(prevTags => [...prevTags, tagInput.trim()]) 
        setTagInput('')
      }
    }
  }, [tagInput, tags]) 

  const validateSEO = useCallback(() => { 
    return (
      metaDescription.length >= 120 &&
      metaDescription.length <= 160 &&
      title.length > 0 &&
      slug.length > 0
    )
  }, [metaDescription, slug, title])

  const uploadImageToCloudinary = useCallback(async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
      if (!response) {
        console.error('Cloudinary upload failed:', response);
        return null;
      }
      const data = await response.data.url;
      return data;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  }, []) 

  const handleSubmit = useCallback(async (isDraft: boolean) => { 
    if (!validateSEO()) {
      toast.error('Vui lòng điền đầy đủ các trường SEO bắt buộc (Tiêu đề, Slug, Meta Description từ 120-160 ký tự).', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    setIsLoading(true);

    try {
      const url = await uploadImageToCloudinary(thumbnail as File) as string;
      const formData = {
        title,
        slug,
        content,
        tags,
        thumbnail: url,
        metaDescription,
        imageAlt,
        description,
        canonicalUrl,
        ogTitle,
        ogDescription,
        readTime,
      };

      await createPost(formData);
      toast.success('Bài viết đã được xuất bản thành công!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.push(`/blog/${slug}`)
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Đã xảy ra lỗi khi tạo bài viết. Vui lòng thử lại!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
      refresh();
    }
  }, [validateSEO, uploadImageToCloudinary, thumbnail, title, slug, content, tags, metaDescription, imageAlt, description, canonicalUrl, ogTitle, ogDescription, createPost, router, refresh]);

  const removeTag = useCallback((index: number) => {
    setTags(prevTags => prevTags.filter((_, i) => i !== index)) 
  }, []); 

  const handleFileDrop = useCallback((acceptedFiles: File[]) => {
    setThumbnail(acceptedFiles[0] as any)
  }, []); 

  const insertMarkdown = useCallback((format: string) => {
    const examples: Record<string, string> = {
      bold: '**chữ đậm**',
      italic: '*chữ nghiêng*',
      link: '[tiêu đề](https://)',
      code: '`mã`',
      image: '![alt](https://)',
      list: '- Mục danh sách',
    }
    setContent(prevContent => prevContent + ` ${examples[format]}`) 
  }, []);


  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsGeneratingSlug(false);
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  const handleMetaDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetaDescription(e.target.value);
  }, []);

  const handleKeywordsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value.split(/,\s*/));
  }, []);

  const handleImageAltChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImageAlt(e.target.value.slice(0, 125));
  }, []);

  const handleCanonicalUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCanonicalUrl(e.target.value);
    setIsAutoCanonical(false);
  }, []);

  const handleOgTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setOgTitle(e.target.value);
  }, []);

  const handleOgDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOgDescription(e.target.value);
  }, []);

  const handleTagInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  }, []);

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
  }, []);

  return (
    <div className="bg-white min-h-screen p-1">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            Tạo Bài Viết Mới
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Điền đầy đủ các trường thông tin bắt buộc (*) và tối ưu hóa metadata SEO để bài viết hiển thị tốt hơn trên các công cụ tìm kiếm.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  Tiêu đề *
                  <span className="text-xs text-muted-foreground">(Tối ưu hóa SEO)</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={async () => {
                      setIsGeneratingTitle(true);
                      try {
                        const generated = await generateTitleBlog(content);
                        generated && setTitle(generated);
                      } finally {
                        setIsGeneratingTitle(false);
                      }
                    }}
                    disabled={isGeneratingTitle}
                  >
                    {isGeneratingTitle ? (
                      <div className="flex items-center gap-2">
                        <Spinner className="h-4 w-4" />
                        Đang tạo...
                      </div>
                    ) : (
                      "Tạo bằng AI"
                    )}
                  </Button>
                </Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề bài viết"
                  value={title}
                  onChange={handleTitleChange}
                  className="text-lg font-medium"
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="slug" className="flex items-center gap-2">
                  Đường dẫn thân thiện (Slug) *
                  <button
                    type="button"
                    onClick={() => setIsGeneratingSlug(!isGeneratingSlug)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {isGeneratingSlug ? 'Tắt tự động tạo' : 'Chỉnh sửa thủ công'}
                  </button>
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={handleSlugChange} 
                  disabled={!isGeneratingSlug}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  Mô tả ngắn *
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={async () => {
                      setIsGeneratingExcerpt(true);
                      try {
                        const generated = await generateExcerpt(content);
                        generated && setDescription(generated);
                      } finally {
                        setIsGeneratingExcerpt(false);
                      }
                    }}
                    disabled={isGeneratingExcerpt}
                  >
                    {isGeneratingExcerpt ? (
                      <div className="flex items-center gap-2">
                        <Spinner className="h-4 w-4" />
                        Đang tạo...
                      </div>
                    ) : (
                      "Tạo bằng AI"
                    )}
                  </Button>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Viết một đoạn mô tả ngắn gọn..."
                  rows={3}
                  value={description}
                  onChange={handleDescriptionChange} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="flex items-center gap-2">
                  Meta Mô tả *
                  <span className="text-xs text-muted-foreground">({metaDescription.length}/160 ký tự)</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={async () => {
                      setIsGeneratingMetaDescription(true);
                      try {
                        const generated = await generateMetaDescription(content);
                        generated && setMetaDescription(generated);
                      } finally {
                        setIsGeneratingMetaDescription(false);
                      }
                    }}
                    disabled={isGeneratingMetaDescription}
                  >
                    {isGeneratingMetaDescription ? (
                      <div className="flex items-center gap-2">
                        <Spinner className="h-4 w-4" />
                        Đang tạo...
                      </div>
                    ) : (
                      "Tạo bằng AI"
                    )}
                  </Button>
                </Label>

                <textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={handleMetaDescriptionChange} 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={3}
                  maxLength={160}
                  placeholder="Nhập meta mô tả hoặc tạo bằng AI"
                />

                <div className="space-y-2">
                  <Label htmlFor="keywords" className="flex items-center gap-2">
                    Từ khóa SEO
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                      onClick={async () => {
                        setIsGeneratingKeywords(true);
                        try {
                          const generated = await generateSEOKeywords(content);
                          generated && setTags(generated.split(',').map(tag => tag.trim()));
                        } finally {
                          setIsGeneratingKeywords(false);
                        }
                      }}
                      disabled={isGeneratingKeywords}
                    >
                      {isGeneratingKeywords ? (
                        <div className="flex items-center gap-2">
                          <Spinner className="h-4 w-4" />
                          Đang tạo...
                        </div>
                      ) : (
                        "Tạo bằng AI"
                      )}
                    </Button>
                  </Label>
                  <Input
                    id="keywords"
                    placeholder="Nhập từ khóa, cách nhau bằng dấu phẩy"
                    value={tags.join(', ')}
                    onChange={handleKeywordsChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    {tags.length}/15 từ khóa (đề xuất)
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-start">
                <div className="group relative h-full min-h-[200px]">
                  <Dropzone
                    onDrop={handleFileDrop} 
                    accept="image/png, image/jpeg, image/webp, image/avif"
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                  />
                </div>
                <div className="hidden lg:block mx-4">
                  <div className="h-full w-px bg-border" />
                </div>
                {thumbnail ? (
                  <div className="relative space-y-4 h-full">
                    <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-muted">
                      <img
                        src={URL.createObjectURL(thumbnail)}
                        alt="Xem trước ảnh thu nhỏ"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setThumbnail(null)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Alt Text (SEO)
                        <span className="text-sm text-muted-foreground">
                          {imageAlt.length}/125 ký tự
                        </span>
                      </Label>
                      <Textarea
                        placeholder="Mô tả hình ảnh cho SEO..."
                        value={imageAlt}
                        onChange={handleImageAltChange} 
                        rows={2}
                        className="resize-none"
                      />
                      <p className="text-sm text-muted-foreground">
                        Ví dụ: "Ảnh chụp màn hình giao diện developer đang làm việc với React và TypeScript"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="hidden lg:flex items-center justify-center h-full min-h-[200px] border-2 border-dashed rounded-lg text-muted-foreground">
                    Xem trước ảnh thu nhỏ sẽ hiển thị ở đây
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="flex items-center gap-2">
                  Nội dung *
                  <span className="text-sm text-muted-foreground">
                    Thời gian đọc ước tính: {readTime} phút
                  </span>
                </Label>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div data-color-mode="light">
                      <Suspense fallback={<>Loading Editor...</>}> 
                        <MDEditorComponent
                          value={content}
                          onChange={(val) => setContent(val || '')}
                          height={500}
                          previewOptions={{}}
                        />
                      </Suspense>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => insertMarkdown('bold')}>
                      Đậm
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => insertMarkdown('italic')}>
                      Nghiêng
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => insertMarkdown('link')}>
                      Liên kết
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => insertMarkdown('image')}>
                      Hình ảnh
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => insertMarkdown('code')}>
                      Mã
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => insertMarkdown('list')}>
                      Danh sách
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Xem trước SEO</Label>
              <div className="p-4 bg-background rounded-lg border">
                <p className="font-medium text-blue-600">{title || 'Tiêu đề của bạn'}</p>
                <p className="text-sm text-muted-foreground">
                  {slug || 'duong-dan-than-thien'} • {readTime} phút đọc
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {metaDescription || 'Xem trước meta mô tả...'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">SEO Nâng cao</Label>
              <div className="space-y-2">
                <Label htmlFor="canonicalUrl" className="flex items-center gap-2">
                  URL Canonical
                  {!isAutoCanonical && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                      onClick={() => setIsAutoCanonical(true)}
                    >
                      Đặt về tự động
                    </Button>
                  )}
                </Label>
                <Input
                  id="canonicalUrl"
                  placeholder="https://bloai.blog/blog/[slug]"
                  value={canonicalUrl}
                  onChange={handleCanonicalUrlChange}
                />
                {isAutoCanonical && (
                  <p className="text-sm text-muted-foreground">
                    Tự động tạo từ đường dẫn thân thiện (slug)
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogTitle" className="flex items-center gap-2">
                  Tiêu đề Open Graph (OG Title)
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={async () => {
                      setIsGeneratingOgTitle(true);
                      try {
                        const generated = await generateOpenGraphTitle(content);
                        generated && setOgTitle(generated);
                      } finally {
                        setIsGeneratingOgTitle(false);
                      }
                    }}
                    disabled={isGeneratingOgTitle}
                  >
                    {isGeneratingOgTitle ? (
                      <div className="flex items-center gap-2">
                        <Spinner className="h-4 w-4" />
                        Đang tạo...
                      </div>
                    ) : (
                      "Tạo bằng AI"
                    )}
                  </Button>
                </Label>
                <Input
                  id="ogTitle"
                  value={ogTitle}
                  onChange={handleOgTitleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogDescription" className="flex items-center gap-2">
                  Mô tả Open Graph (OG Description)
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={async () => {
                      setIsGeneratingOgDescription(true);
                      try {
                        const generated = await generateOpenGraphDescription(content);
                        generated && setOgDescription(generated);
                      } finally {
                        setIsGeneratingOgDescription(false);
                      }
                    }}
                    disabled={isGeneratingOgDescription}
                  >
                    {isGeneratingOgDescription ? (
                      <div className="flex items-center gap-2">
                        <Spinner className="h-4 w-4" />
                        Đang tạo...
                      </div>
                    ) : (
                      "Tạo bằng AI"
                    )}
                  </Button>
                </Label>
                <Textarea
                  id="ogDescription"
                  value={ogDescription}
                  onChange={handleOgDescriptionChange} 
                  rows={2}
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label>Tags</Label>
              <Input
                value={tagInput}
                onChange={handleTagInputChange} 
                onKeyDown={handleTagKeyDown}
                placeholder="Thêm tag (nhấn Enter để thêm)"
              />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => removeTag(index)} 
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {validateSEO() ? ( 
              <span className="text-green-600">✓ Đã Tối ưu SEO</span>
            ) : (
              <span className="text-yellow-600">⚠ Cần Chú ý SEO</span>
            )}
          </div>
          <div className="flex gap-4">
            <Button onClick={() => handleSubmit(false)} className='bg-black text-white' disabled={isLoading}>{isLoading ? 
              (
                <FiLoader className="animate-spin inline-block align-middle" size={20} />
              ) : (
                "Xuất bản Ngay"
              )}</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NewPost;