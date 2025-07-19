"use client"
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api as trpcApi } from '@/trpc/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminCommentsSection() {
  const [commentPage, setCommentPage] = useState(1)
  const [commentSearch, setCommentSearch] = useState('')
  const { data: commentData, isLoading: isCommentLoading, refetch: refetchComments } = trpcApi.admin.getAdminViewComments.useQuery({ page: commentPage, pageSize: 10, search: commentSearch })

  const comments = commentData?.comments || []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Quản lý bình luận</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <Input
              placeholder="Tìm kiếm bình luận..."
              value={commentSearch}
              onChange={e => { setCommentSearch(e.target.value); setCommentPage(1) }}
              className="w-full md:w-1/3"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Bài viết</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isCommentLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    </TableRow>
                  ))
                ) : comments.length ? (
                  comments.map(comment => (
                    <TableRow key={comment.id}>
                      <TableCell>{comment.content}</TableCell>
                      <TableCell>{comment.author?.name || comment.author?.email}</TableCell>
                      <TableCell>{comment.blog?.title}</TableCell>
                      <TableCell>{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy bình luận nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {commentData && commentData.totalCount > 0 && (
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
              <div className="text-sm text-muted-foreground">
                Hiển thị <span className="font-medium">{(commentPage - 1) * 10 + 1}</span>-<span className="font-medium">{Math.min(commentPage * 10, commentData.totalCount)}</span> trong tổng số <span className="font-medium">{commentData.totalCount}</span> bình luận
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={commentPage === 1} onClick={() => setCommentPage(commentPage - 1)}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </Button>
                <div className="px-4 text-sm">Trang {commentPage} / {Math.ceil(commentData.totalCount / 10)}</div>
                <Button variant="outline" size="sm" disabled={commentPage * 10 >= commentData.totalCount} onClick={() => setCommentPage(commentPage + 1)}>
                  Sau <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardFooter>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 