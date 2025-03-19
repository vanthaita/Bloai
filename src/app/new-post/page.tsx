'use client'
import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
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
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Dropzone } from '@/components/Dropzone'
import slugify from 'slugify'
import { HelpCircle, Info, TrashIcon } from 'lucide-react'
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
const NewPost = () => {
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [content, setContent] = useState('**Hello world!!!**')
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
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);
  const [isAutoCanonical, setIsAutoCanonical] = useState(true);
  const { mutateAsync: createPost } = api.blog.create.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [routeToUrl, setRouteToUrl] = useState('');
  const router = useRouter();
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
    const words = content.split(/\s+/).length
    const time = Math.ceil(words / 200)
    setReadTime(time)
  }, [content])

  useEffect(() => {
    if (!ogTitle) setOgTitle(title)
    if (!ogDescription) setOgDescription(metaDescription || description)
  }, [title, metaDescription, description])

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (['Enter', ','].includes(e.key) && tagInput.trim()) {
      e.preventDefault()
      if (tags.length < 5) {
        setTags([...tags, tagInput.trim()])
        setTagInput('')
      }
    }
  }

  const validateSEO = () => {
    return (
      metaDescription.length >= 120 &&
      metaDescription.length <= 160 &&
      title.length > 0 &&
      slug.length > 0
    )
  }
  const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
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
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  };


const handleSubmit = async (isDraft: boolean) => {
  if (!validateSEO()) {
    alert('Please fill required SEO fields');
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

    const result = await createPost(formData);
    setRouteToUrl(formData.slug);
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('An error occurred while submitting the form.');
  } finally {
    setIsLoading(false); 
    router.push(`/blog/${routeToUrl}`)
  }
};
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const handleFileDrop = (acceptedFiles: File[]) => {
    setThumbnail(acceptedFiles[0] as any)
  }

  const insertMarkdown = (format: string) => {
    const examples: Record<string, string> = {
      bold: '**bold text**',
      italic: '*italicized text*',
      link: '[title](https://)',
      code: '`code`',
      image: '![alt](https://)',
      list: '- List item',
    }
    setContent(content + ` ${examples[format]}`)
  }
  return (
    <div className="bg-white min-h-screen p-1">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            Create New Post
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fill required fields (*) and optimize SEO metadata for better visibility</p>
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
                  Title *
                  <span className="text-xs text-muted-foreground">(Optimized for SEO)</span>
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
                        Generating...
                      </div>
                    ) : (
                      "Generate with AI"
                    )}
                  </Button>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setIsGeneratingSlug(false)
                  }}
                  className="text-lg font-medium"
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="slug" className="flex items-center gap-2">
                  Slug *
                  <button
                    type="button"
                    onClick={() => setIsGeneratingSlug(!isGeneratingSlug)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {isGeneratingSlug ? 'Disable auto-generate' : 'Edit manually'}
                  </button>
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={!isGeneratingSlug}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  Description *
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
                        Generating...
                      </div>
                    ) : (
                      "Generate with AI"
                    )}
                  </Button>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Write a short excerpt..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="flex items-center gap-2">
                  Meta Description *
                  <span className="text-xs text-muted-foreground">({metaDescription.length}/160)</span>
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
                        Generating...
                      </div>
                    ) : (
                      "Generate with AI"
                    )}
                  </Button>
                </Label>

                <textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={3}
                  maxLength={160}
                  placeholder="Enter meta description or generate with AI"
                />

                <div className="space-y-2">
                  <Label htmlFor="keywords" className="flex items-center gap-2">
                    SEO Keywords
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
                          Generating...
                        </div>
                      ) : (
                        "Generate with AI"
                      )}
                    </Button>
                  </Label>
                  <Input
                    id="keywords"
                    placeholder="Comma-separated keywords"
                    value={tags.join(', ')}
                    onChange={(e) => setTags(e.target.value.split(/,\s*/))}
                  />
                  <p className="text-sm text-muted-foreground">
                    {tags.length}/15 keywords (recommended)
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
                        alt="Preview"
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
                          {imageAlt.length}/125 characters
                        </span>
                      </Label>
                      <Textarea
                        placeholder="Mô tả hình ảnh cho SEO..."
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value.slice(0, 125))}
                        rows={2}
                        className="resize-none"
                      />
                      <p className="text-sm text-muted-foreground">
                        Ví dụ: "Một developer đang làm việc với React và TypeScript"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="hidden lg:flex items-center justify-center h-full min-h-[200px] border-2 border-dashed rounded-lg text-muted-foreground">
                    Preview sẽ hiển thị ở đây
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="flex items-center gap-2">
                  Content *
                  <span className="text-sm text-muted-foreground">
                    Estimated read time: {readTime} mins
                  </span>
                </Label>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div data-color-mode="light">
                      <MDEditor
                        value={content}
                        onChange={(val) => setContent(val || '')}
                        height={500}
                        previewOptions={{
                          // transformLinkUri: (uri) => {
                          //   try {
                          //     new URL(uri)
                          //     return uri
                          //   } catch {
                          //     return `https://${uri}`
                          //   }
                          // }
                        }}
                      />
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => insertMarkdown('bold')}>
                      Bold
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => insertMarkdown('italic')}>
                      Italic
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => insertMarkdown('link')}>
                      Link
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => insertMarkdown('image')}>
                      Image
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => insertMarkdown('code')}>
                      Code
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => insertMarkdown('list')}>
                      List
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">SEO Preview</Label>
              <div className="p-4 bg-background rounded-lg border">
                <p className="font-medium text-blue-600">{title || 'Your Title'}</p>
                <p className="text-sm text-muted-foreground">
                  {slug || 'your-slug'} • {readTime} min read
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {metaDescription || 'Meta description preview...'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Advanced SEO</Label>
              <div className="space-y-2">
                <Label htmlFor="canonicalUrl" className="flex items-center gap-2">
                  Canonical URL
                  {!isAutoCanonical && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                      onClick={() => setIsAutoCanonical(true)}
                    >
                      Reset to auto
                    </Button>
                  )}
                </Label>
                <Input
                  id="canonicalUrl"
                  placeholder="https://bloai.blog/blog/[slug]"
                  value={canonicalUrl}
                  onChange={(e) => {
                    setCanonicalUrl(e.target.value);
                    setIsAutoCanonical(false);
                  }}
                />
                {isAutoCanonical && (
                  <p className="text-sm text-muted-foreground">
                    Auto-generated from slug
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogTitle" className="flex items-center gap-2">
                  Open Graph Title
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
                        Generating...
                      </div>
                    ) : (
                      "Generate with AI"
                    )}
                  </Button>
                </Label>
                <Input
                  id="ogTitle"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogDescription" className="flex items-center gap-2">
                  Open Graph Description
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
                        Generating...
                      </div>
                    ) : (
                      "Generate with AI"
                    )}
                  </Button>
                </Label>
                <Textarea
                  id="ogDescription"
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label>Tags</Label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags (press Enter to add)"
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

            <div className="space-y-4">
              <Label>Publish Settings</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm">Schedule Publish</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Featured Post</span>
                <Switch />
              </div>
            </div>

          </div>


        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {validateSEO() ? (
              <span className="text-green-600">✓ SEO Optimized</span>
            ) : (
              <span className="text-yellow-600">⚠ Needs SEO Attention</span>
            )}
          </div>
          <div className="flex gap-4">
            {/* <Button variant="outline" className='bg-black text-white' onClick={() => handleSubmit(true)}>
              Save Draft
            </Button> */}
            <Button onClick={() => handleSubmit(false)} className='bg-black text-white' disabled={isLoading}>Publish Now</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NewPost