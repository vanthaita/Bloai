"use client"
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { api as trpcApi } from '@/trpc/react'
import BlogFilterBar from './BlogFilterBar'
import BlogTable from './BlogTable'
import BlogPagination from './BlogPagination'
import EditBlogModal from './EditBlogModal'
import DeleteBlogModal from './DeleteBlogModal'

export default function AdminBlogsSection() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    search: '',
    sortBy: 'publishDate' as const,
    sortOrder: 'desc' as const,
    status: 'all' as const,
  })
  const { data: blogData, refetch: refetchBlogs, isLoading: isBlogLoading } = trpcApi.admin.getAdminViewBlogs.useQuery(pagination)
  const [editBlog, setEditBlog] = useState<any>(null)
  const [editBlogTitle, setEditBlogTitle] = useState('')
  const [editBlogStatus, setEditBlogStatus] = useState('Published')
  const [editBlogTags, setEditBlogTags] = useState<string[]>([])
  const [deleteBlog, setDeleteBlog] = useState<any>(null)
  const updateBlogMutation = trpcApi.admin.updateBlog.useMutation({
    onSuccess: () => { setEditBlog(null); refetchBlogs() },
  })
  const deleteBlogMutation = trpcApi.admin.deleteBlog.useMutation({
    onSuccess: () => { setDeleteBlog(null); refetchBlogs() },
  })

  // Handler filter, sort
  const handleStatusFilter = (value: string) => {
    setPagination({...pagination, status: value as any, page: 1})
  }
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    setPagination({...pagination, sortBy: sortBy as any, sortOrder: sortOrder as any})
  }

  const filteredBlogs = blogData?.blogs || []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Quản lý bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogFilterBar
            pagination={pagination}
            setPagination={setPagination}
            handleStatusFilter={handleStatusFilter}
            handleSortChange={handleSortChange}
          />
          <BlogTable
            filteredBlogs={filteredBlogs}
            isBlogLoading={isBlogLoading}
            setEditBlog={setEditBlog}
            setEditBlogTitle={setEditBlogTitle}
            setEditBlogStatus={setEditBlogStatus}
            setEditBlogTags={setEditBlogTags}
            setDeleteBlog={setDeleteBlog}
          />
          {blogData && blogData.totalCount > 0 && (
            <BlogPagination
              pagination={pagination}
              setPagination={setPagination}
              blogData={blogData}
            />
          )}
        </CardContent>
      </Card>
      <EditBlogModal
        editBlog={editBlog}
        setEditBlog={setEditBlog}
        editBlogTitle={editBlogTitle}
        setEditBlogTitle={setEditBlogTitle}
        editBlogStatus={editBlogStatus}
        setEditBlogStatus={setEditBlogStatus}
        editBlogTags={editBlogTags}
        setEditBlogTags={setEditBlogTags}
        updateBlogMutation={updateBlogMutation}
      />
      <DeleteBlogModal
        deleteBlog={deleteBlog}
        setDeleteBlog={setDeleteBlog}
        deleteBlogMutation={deleteBlogMutation}
      />
    </div>
  )
} 