// components/ui/dropzone.tsx
"use client"

import React, { useState, useCallback, useRef } from 'react'
import { UploadIcon } from 'lucide-react' // Hoặc import SVG tự tạo

interface DropzoneProps {
  onDrop: (files: File[]) => void
  accept?: string
  maxFiles?: number
}

export const Dropzone = ({ onDrop, accept, maxFiles }: DropzoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = (files: File[]) => {
    let acceptedFiles = files

    // Lọc theo định dạng file
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      acceptedFiles = files.filter(file => acceptedTypes.includes(file.type))
    }

    // Giới hạn số lượng file
    if (maxFiles) {
      acceptedFiles = acceptedFiles.slice(0, maxFiles)
    }

    if (acceptedFiles.length > 0) {
      onDrop(acceptedFiles)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files))
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragActive 
          ? 'border-primary bg-primary/10' 
          : 'border-muted-foreground/30 hover:border-muted-foreground/50'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={maxFiles ? maxFiles > 1 : undefined}
        onChange={handleInputChange}
      />
      <div className="flex flex-col items-center gap-2">
        <UploadIcon className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Kéo thả ảnh vào đây hoặc click để upload
        </p>
        {accept && (
          <p className="text-xs text-muted-foreground/70">
            Định dạng hỗ trợ: {accept.replaceAll('image/', '')}
          </p>
        )}
      </div>
    </div>
  )
}