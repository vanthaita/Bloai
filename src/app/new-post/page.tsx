'use client'
import React from 'react'
import { useState } from 'react'
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


const NewPost = () => {
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [content, setContent] = useState('**Hello world!!!**')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (['Enter', 'Comma'].includes(e.key) && tagInput.trim()) {
      e.preventDefault()
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

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
    <div className="max-w-8xl mx-auto p-6 bg-[#e8e8e8]">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Post</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Write a short description..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Thumbnail *</Label>
              <Dropzone
                onDrop={handleFileDrop}
                accept="image/png, image/jpeg, image/gif"
                maxFiles={1}
                />
              {thumbnail && (
                <div className="mt-4 relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="Thumbnail preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <ContextMenu>
                <ContextMenuTrigger>
                  <div data-color-mode="light">
                    <MDEditor
                      value={content}
                      onChange={(val) => setContent(val || '')}
                      height={400}
                      visibleDragbar={false}
                      previewOptions={{
                        // linkTarget: '_blank',
                        // transformLinkUri: null
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
          <div className="space-y-6">
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

            <Separator />

            <div className="space-y-4">
              <Label>Preview</Label>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">{title || 'Title Preview'}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {description || 'Description preview...'}
                </p>
                {thumbnail && (
                  <div className="mt-4 aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="Thumbnail preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="prose max-w-none">
                    <MDEditor.Markdown
                        source={content}
                        style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px', color: 'black'  }}
                    />
                </div>
              </Card>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" className='bg-black text-white'>Save Draft</Button>
          <Button>Publish Now</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NewPost