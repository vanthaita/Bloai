import React from 'react'
import NewPostContent from './components/NewPostContent'
import { AIProvider } from '@/context/AIContext'

const NewPostPage = () => {
  return (
    <AIProvider>
      <NewPostContent />
    </AIProvider>
  )
}

export default NewPostPage