import { Metadata } from 'next'
import React from 'react'
import TagsContent from './TagsContent'
import { api, HydrateClient } from "@/trpc/server"

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Chủ đề AI phổ biến | Bloai Blog",
    description: "Khám phá các chủ đề AI hot nhất với hơn 100 tags về Machine Learning, Deep Learning, ChatGPT và ứng dụng thực tế",
    keywords: ["tags AI", "chủ đề AI", "thẻ AI", "machine learning tags"],
    authors: [{ name: "Bloai Team" }],
    alternates: {
      canonical: 'https://www.bloai.blog/tags',
    },
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      url: 'https://www.bloai.blog/tags',
      siteName: 'Bloai Blog',
      title: "Chủ đề AI phổ biến — Bloai Blog",
      description: "Khám phá các chủ đề AI hot nhất với hơn 100 tags về Machine Learning, Deep Learning, ChatGPT và ứng dụng thực tế.",
      images: [
        {
          url: 'https://www.bloai.blog/images/Logo/android-chrome-512x512.png',
          width: 1200,
          height: 630,
          alt: 'Bloai Blog - Kiến Thức AI',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Bloai_Team',
      title: "Chủ đề AI phổ biến — Bloai Blog",
      description: "Khám phá các chủ đề AI hot nhất với Machine Learning, Deep Learning và ChatGPT.",
      images: ['https://www.bloai.blog/images/Logo/android-chrome-512x512.png'],
    },
  }
}
const TagPage = async () => {
  await api.blog.getAllTags.prefetch({
    page: 1,
    limit: 100,
  });

  return (
    <HydrateClient>
      <TagsContent />
    </HydrateClient>
  )
}

export default TagPage

