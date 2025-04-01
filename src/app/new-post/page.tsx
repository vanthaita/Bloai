'use client'
import React, { useCallback, useState, useEffect, Suspense, lazy, useMemo } from 'react'
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
  const [isGeneratingSlugManually, setIsGeneratingSlugManually] = useState(false);
  const [readTime, setReadTime] = useState(0)
  const [isGeneratingMetaDescription, setIsGeneratingMetaDescription] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [isGeneratingOgTitle, setIsGeneratingOgTitle] = useState(false);
  const [isGeneratingOgDescription, setIsGeneratingOgDescription] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);
  const [isAutoCanonical, setIsAutoCanonical] = useState(true);
  const { mutateAsync: createPost } = api.blog.create.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const refresh = useRefetch();
  const router = useRouter();

  const [debouncedContent] = useDebounce(content, 500); 

  useEffect(() => {
    if (isAutoCanonical && slug) {
      setCanonicalUrl(`${env.NEXT_PUBLIC_APP_URL}/blog/${slug}`);
    }
  }, [slug, isAutoCanonical]);

  useEffect(() => {
    if (title && !isGeneratingSlugManually) {
      const generatedSlug = slugify(title, {
        lower: true,
        strict: true,
        trim: true
      })
      setSlug(generatedSlug)
    }
  }, [title, isGeneratingSlugManually])

  useEffect(() => {
    const words = debouncedContent.split(/\s+/).filter(Boolean).length;
    const time = Math.ceil(words / 200) 
    setReadTime(time)
  }, [debouncedContent])

  useEffect(() => {
    if (!ogTitle) setOgTitle(title)
  }, [title, ogTitle]) 

  useEffect(() => {
    if (!ogDescription) setOgDescription(metaDescription || description)
  }, [metaDescription, description, ogDescription])


  const handleTagKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ','].includes(e.key) && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim();
      if (tags.length < 15 && !tags.includes(newTag)) { 
        setTags(prevTags => [...prevTags, newTag])
      }
      setTagInput('')
    }
  }, [tagInput, tags])

  const isSEOValid = useMemo(() => {
    return (
      metaDescription.length >= 120 &&
      metaDescription.length <= 160 &&
      title.trim().length > 0 &&
      slug.trim().length > 0 &&
      thumbnail !== null 
    )
  }, [metaDescription, slug, title, thumbnail])

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
        return null;
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  }, []) 


  const handleSubmit = useCallback(async () => {
    if (!isSEOValid) {
      let errorMessage = 'Vui lòng điền đầy đủ thông tin và tối ưu SEO:';
      if (!title.trim()) errorMessage += '\n- Tiêu đề còn trống.';
      if (!slug.trim()) errorMessage += '\n- Đường dẫn (Slug) còn trống.';
      if (!thumbnail) errorMessage += '\n- Ảnh thu nhỏ chưa được chọn.';
      if (metaDescription.length < 120 || metaDescription.length > 160) {
        errorMessage += `\n- Meta Description phải từ 120-160 ký tự (hiện tại ${metaDescription.length}).`;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 7000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { whiteSpace: 'pre-line' } 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!thumbnail) {
          throw new Error("Thumbnail file is missing.");
      }
      const imageUrl = await uploadImageToCloudinary(thumbnail);

      if (!imageUrl) {
        throw new Error("Không thể tải ảnh lên Cloudinary.");
      }

      const postData = {
        title: title.trim(),
        slug: slug.trim(),
        content,
        tags,
        thumbnail: imageUrl,
        metaDescription: metaDescription.trim(),
        imageAlt: imageAlt.trim().slice(0, 125), 
        description: description.trim(),
        canonicalUrl: canonicalUrl.trim() || `${env.NEXT_PUBLIC_APP_URL}/blog/${slug.trim()}`,
        ogTitle: ogTitle.trim() || title.trim(), 
        ogDescription: ogDescription.trim() || metaDescription.trim() || description.trim(),
        readTime,
      };

      await createPost(postData);
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
      refresh(); 
      router.push(`/blog/${postData.slug}`)
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(`Đã xảy ra lỗi: ${error.message || 'Vui lòng thử lại!'}`, {
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
      setIsSubmitting(false);
    }
  }, [isSEOValid, uploadImageToCloudinary, thumbnail, title, slug, content, tags, metaDescription, imageAlt, description, canonicalUrl, ogTitle, ogDescription, readTime, createPost, router, refresh]); 

  const removeTag = useCallback((indexToRemove: number) => {
    setTags(prevTags => prevTags.filter((_, index) => index !== indexToRemove))
  }, []);

  const handleFileDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setThumbnail(acceptedFiles[0] as File); 
    }
  }, []);

  const insertMarkdown = useCallback((format: string) => {
    const examples: Record<string, string> = {
      bold: '**chữ đậm**',
      italic: '*chữ nghiêng*',
      link: '[tiêu đề](https://)',
      code: '`mã`',
      image: '![alt](https://)',
      list: '\n- Mục danh sách', 
    }
    setContent(prevContent => prevContent + ` ${examples[format]}`)
  }, []);

  const handleInputChange = useCallback((setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsGeneratingSlugManually(false); 
  }, []);

  const handleCanonicalUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCanonicalUrl(e.target.value);
    setIsAutoCanonical(!e.target.value);
  }, []);

  const handleImageAltChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setImageAlt(e.target.value.slice(0, 125));
  }, []);

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitizedSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setSlug(sanitizedSlug);
      setIsGeneratingSlugManually(true);
  }, []);


  const AIGenerationButton = React.memo(({ label, action, generatingState, setGeneratingState, disabled }: { label: string, action: (content: string) => Promise<string | null | undefined>, generatingState: boolean, setGeneratingState: React.Dispatch<React.SetStateAction<boolean>>, disabled?: boolean }) => {
      const handleClick = useCallback(async () => {
        if (!content) {
          toast.info("Vui lòng nhập nội dung trước khi tạo bằng AI.");
          return;
        }
        setGeneratingState(true);
        try {
          const generated = await action(content);
          if (generated) {
             if (label === "Tiêu đề") setTitle(generated);
             else if (label === "Mô tả ngắn") setDescription(generated);
             else if (label === "Meta Mô tả") setMetaDescription(generated);
             else if (label === "Từ khóa SEO") setTags(generated.split(/,\s*/).map(tag => tag.trim()));
             else if (label === "OG Title") setOgTitle(generated);
             else if (label === "OG Description") setOgDescription(generated);
          } else {
             toast.warn("AI không thể tạo nội dung. Vui lòng thử lại hoặc viết thủ công.");
          }
        } catch (error) {
            console.error(`Error generating ${label}:`, error);
            toast.error(`Lỗi khi tạo ${label} bằng AI.`);
        } finally {
          setGeneratingState(false);
        }
      }, [action, content, setGeneratingState, label]);

      return (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 h-auto px-2 py-1 text-xs"
          onClick={handleClick}
          disabled={generatingState || disabled}
          aria-label={`Tạo ${label} bằng AI`}
        >
          {generatingState ? (
            <span className="flex items-center gap-1">
              <Spinner className="h-3 w-3" />
              Đang tạo...
            </span>
          ) : (
            "Tạo AI"
          )}
        </Button>
      );
  });
  AIGenerationButton.displayName = 'AIGenerationButton'; 


  const thumbnailPreviewUrl = useMemo(() => {
      return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  useEffect(() => {
      const url = thumbnailPreviewUrl;
      return () => {
          if (url) {
              URL.revokeObjectURL(url);
          }
      };
  }, [thumbnailPreviewUrl]);


  return (
    <TooltipProvider>
      <div className="bg-white min-h-screen p-1 md:p-4"> 
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
              Tạo Bài Viết Mới
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-5 h-5">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Điền đầy đủ các trường (*) và tối ưu SEO.</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="lg:col-span-3 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="flex items-center gap-2 text-base">
                  Tiêu đề *
                  <AIGenerationButton
                    label="Tiêu đề"
                    action={generateTitleBlog}
                    generatingState={isGeneratingTitle}
                    setGeneratingState={setIsGeneratingTitle}
                  />
                </Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề bài viết"
                  value={title}
                  onChange={handleTitleChange}
                  className="text-lg font-medium"
                  maxLength={70} 
                  required
                  aria-required="true"
                />
                 <p className="text-xs text-muted-foreground">Còn lại {70 - title.length} ký tự (khuyến nghị SEO)</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug" className="flex items-center gap-2 text-base">
                  Đường dẫn (Slug) *
                  <button
                    type="button"
                    onClick={() => setIsGeneratingSlugManually(!isGeneratingSlugManually)}
                    className="text-xs text-blue-600 hover:underline focus:outline-none"
                  >
                    {isGeneratingSlugManually ? 'Tạo tự động' : 'Chỉnh sửa'}
                  </button>
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={handleSlugChange}
                  disabled={!isGeneratingSlugManually}
                  required
                  aria-required="true"
                  placeholder="duong-dan-bai-viet"
                />
              </div>

              <div className="space-y-1.5">
                 <Label htmlFor="description" className="flex items-center gap-2 text-base">
                  Mô tả ngắn (Excerpt)
                  <AIGenerationButton
                    label="Mô tả ngắn"
                    action={generateExcerpt}
                    generatingState={isGeneratingExcerpt}
                    setGeneratingState={setIsGeneratingExcerpt}
                  />
                </Label>
                <Textarea
                  id="description"
                  placeholder="Viết một đoạn mô tả ngắn gọn, hấp dẫn về bài viết..."
                  rows={3}
                  value={description}
                  onChange={handleInputChange(setDescription)}
                  maxLength={300} 
                />
                 <p className="text-xs text-muted-foreground">Còn lại {300 - description.length} ký tự</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="metaDescription" className="flex items-center gap-2 text-base">
                  Meta Mô tả *
                   <span className={`text-xs ${metaDescription.length >= 120 && metaDescription.length <= 160 ? 'text-green-600' : 'text-yellow-600'}`}>
                    ({metaDescription.length}/160 ký tự)
                  </span>
                  <AIGenerationButton
                    label="Meta Mô tả"
                    action={generateMetaDescription}
                    generatingState={isGeneratingMetaDescription}
                    setGeneratingState={setIsGeneratingMetaDescription}
                  />
                </Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={handleInputChange(setMetaDescription)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={3}
                  maxLength={160}
                  placeholder="Tối ưu cho SEO, khoảng 120-160 ký tự."
                  required
                  aria-required="true"
                />
                 {!isSEOValid && metaDescription.length > 0 && (metaDescription.length < 120 || metaDescription.length > 160) && (
                   <p className="text-xs text-red-600">Độ dài Meta Description chưa tối ưu (cần 120-160 ký tự).</p>
                 )}
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                 <div className="space-y-1.5">
                   <Label htmlFor="thumbnail-dropzone" className="text-base">Ảnh thu nhỏ *</Label>
                   <Dropzone
                      id="thumbnail-dropzone"
                      onDrop={handleFileDrop}
                      accept="image/png, image/jpeg, image/webp, image/avif"
                      maxFiles={1}
                      maxSize={5 * 1024 * 1024}
                      aria-label="Tải lên ảnh thu nhỏ"
                    />
                   {!isSEOValid && !thumbnail && <p className="text-xs text-red-600 pt-1">Vui lòng chọn ảnh thu nhỏ.</p>}
                 </div>

                 <div className="space-y-4">
                    {thumbnailPreviewUrl ? (
                       <div className="relative space-y-2">
                         <p className="text-sm font-medium text-muted-foreground">Xem trước:</p>
                         <div className="relative aspect-video rounded-lg overflow-hidden border border-dashed border-muted">
                           <img
                             src={thumbnailPreviewUrl}
                             alt="Xem trước ảnh thu nhỏ"
                             className="object-cover w-full h-full"
                           />
                           <Button
                             variant="destructive"
                             size="icon"
                             className="absolute top-1 right-1 h-6 w-6" 
                             onClick={() => setThumbnail(null)}
                             aria-label="Xóa ảnh thu nhỏ đã chọn"
                           >
                             <TrashIcon className="w-3.5 h-3.5" />
                           </Button>
                         </div>
                          <div className="space-y-1.5 pt-2">
                             <Label htmlFor="imageAlt" className="flex items-center gap-2 text-base">
                                Alt Text (SEO)
                               <span className="text-xs text-muted-foreground">
                                 ({imageAlt.length}/125 ký tự)
                               </span>
                             </Label>
                             <Textarea
                               id="imageAlt"
                               placeholder="Mô tả hình ảnh cho SEO..."
                               value={imageAlt}
                               onChange={handleImageAltChange}
                               rows={2}
                               className="resize-none text-sm"
                               maxLength={125}
                             />
                             <p className="text-xs text-muted-foreground">
                               Mô tả ngắn gọn nội dung ảnh.
                             </p>
                           </div>
                       </div>
                    ) : (
                       <div className="flex items-center justify-center h-full min-h-[150px] border border-dashed rounded-lg text-muted-foreground text-sm bg-muted/40">
                         Xem trước ảnh thu nhỏ
                       </div>
                    )}
                 </div>
               </div>

              <div className="space-y-1.5">
                <Label htmlFor="content-editor" className="flex items-center gap-2 text-base">
                  Nội dung *
                  <span className="text-sm text-muted-foreground">
                    (~{readTime} phút đọc)
                  </span>
                </Label>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div data-color-mode="light" className='min-h-[400px]'>
                      <Suspense fallback={<div className="flex items-center justify-center h-96 border rounded-md"><Spinner /> Loading Editor...</div>}>
                        <MDEditorComponent
                          value={content}
                          onChange={(val) => setContent(val || '')}
                          height={500} 
                          preview="live" 
                          aria-labelledby="content-editor"
                        />
                      </Suspense>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onSelect={() => insertMarkdown('bold')}>Đậm</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('italic')}>Nghiêng</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('link')}>Liên kết</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('image')}>Hình ảnh</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('code')}>Mã</ContextMenuItem>
                    <ContextMenuItem onSelect={() => insertMarkdown('list')}>Danh sách</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            </div>

            <div className="space-y-6 lg:border-l lg:pl-6"> 
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Xem trước SEO (Google)</Label>
                <div className="p-4 bg-background rounded-lg border space-y-1 text-sm">
                  <p className="font-medium text-blue-700 truncate">{title || 'Tiêu đề bài viết'}</p>
                  <p className="text-xs text-green-700 truncate">
                    {`${env.NEXT_PUBLIC_APP_URL}/blog/${slug || 'duong-dan-bai-viet'}`}
                  </p>
                  <p className="text-gray-600 line-clamp-2"> 
                    {metaDescription || 'Meta mô tả của bài viết sẽ hiển thị ở đây. Tối ưu độ dài khoảng 120-160 ký tự.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">SEO Nâng cao</Label>
                <div className="space-y-1.5">
                  <Label htmlFor="canonicalUrl" className="flex items-center gap-2 text-sm">
                    URL Canonical
                    {!isAutoCanonical && (
                      <Button
                        type="button"
                        variant="link" 
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 h-auto p-0 text-xs"
                        onClick={() => { setIsAutoCanonical(true); if(slug) setCanonicalUrl(`${env.NEXT_PUBLIC_APP_URL}/blog/${slug}`); }} // Reset to auto
                      >
                        Đặt lại tự động
                      </Button>
                    )}
                  </Label>
                  <Input
                    id="canonicalUrl"
                    placeholder="Để trống để tạo tự động"
                    value={canonicalUrl}
                    onChange={handleCanonicalUrlChange}
                    className="text-sm"
                  />
                  {isAutoCanonical && (
                    <p className="text-xs text-muted-foreground">
                      Tự động tạo từ đường dẫn (slug).
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ogTitle" className="flex items-center gap-2 text-sm">
                    OG Title
                     <AIGenerationButton
                      label="OG Title"
                      action={generateOpenGraphTitle}
                      generatingState={isGeneratingOgTitle}
                      setGeneratingState={setIsGeneratingOgTitle}
                    />
                  </Label>
                  <Input
                    id="ogTitle"
                    value={ogTitle}
                    onChange={handleInputChange(setOgTitle)}
                    placeholder="Tiêu đề hiển thị khi chia sẻ mạng xã hội"
                    className="text-sm"
                    maxLength={60}
                  />
                   <p className="text-xs text-muted-foreground">Còn lại {60 - ogTitle.length} ký tự</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ogDescription" className="flex items-center gap-2 text-sm">
                    OG Description
                    <AIGenerationButton
                      label="OG Description"
                      action={generateOpenGraphDescription}
                      generatingState={isGeneratingOgDescription}
                      setGeneratingState={setIsGeneratingOgDescription}
                    />
                  </Label>
                  <Textarea
                    id="ogDescription"
                    value={ogDescription}
                    onChange={handleInputChange(setOgDescription)}
                    rows={2}
                    placeholder="Mô tả hiển thị khi chia sẻ mạng xã hội"
                    className="text-sm"
                  />
                   <p className="text-xs text-muted-foreground">Còn lại {155 - ogDescription.length} ký tự</p>
                </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="keywords" className="flex items-center gap-2 text-sm">
                      Từ khóa SEO (Tags)
                       <AIGenerationButton
                        label="Từ khóa SEO"
                        action={generateSEOKeywords}
                        generatingState={isGeneratingKeywords}
                        setGeneratingState={setIsGeneratingKeywords}
                      />
                    </Label>
                    <Input
                      id="tagInput" 
                      placeholder="Nhập tag và nhấn Enter/dấu phẩy"
                      value={tagInput}
                      onChange={handleInputChange(setTagInput)}
                      onKeyDown={handleTagKeyDown}
                      className="text-sm"
                      aria-label="Thêm từ khóa SEO hoặc tag"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors text-xs px-2 py-0.5" 
                          onClick={() => removeTag(index)}
                          title={`Xóa tag "${tag}"`}
                        >
                          {tag}
                          <span aria-hidden="true" className="ml-1">×</span>
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tags.length}/15 tags (khuyến nghị)
                    </p>
                  </div>
              </div>
              <Separator />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
            <div className="text-sm text-muted-foreground">
              {isSEOValid ? (
                <span className="text-green-600 font-medium">✓ Tối ưu SEO cơ bản</span>
              ) : (
                <span className="text-yellow-600 font-medium">⚠ Kiểm tra lại SEO</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                className='bg-black text-white hover:bg-gray-800'
                disabled={isSubmitting || !isSEOValid} 
                aria-disabled={isSubmitting || !isSEOValid}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin mr-2" size={18} />
                    Đang xuất bản...
                  </>
                ) : (
                  "Xuất bản Ngay"
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  )
}

export default NewPost;