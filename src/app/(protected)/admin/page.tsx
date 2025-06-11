'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Plus, RefreshCw, Settings, Globe, Book, Clock, FileText, Users, Tag as TagIcon, MessageSquare, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '@/trpc/react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('blogs')
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    search: '',
    sortBy: 'publishDate' as const,
    sortOrder: 'desc' as const,
    status: 'all' as const,
  })

  const { data: blogData, refetch: refetchBlogs, isLoading: isBlogLoading } = 
    api.admin.getAdminViewBlogs.useQuery(pagination)

  const fetchAllData = () => {
    refetchBlogs()
  }

  const handleStatusFilter = (value: string) => {
    setPagination({...pagination, status: value as any, page: 1})
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    setPagination({...pagination, sortBy: sortBy as any, sortOrder: sortOrder as any})
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="blogs">
            <FileText className="w-4 h-4 mr-2" />
            Bài viết
          </TabsTrigger>
          <TabsTrigger value="tags">
            <TagIcon className="w-4 h-4 mr-2" />
            Thẻ
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="w-4 h-4 mr-2" />
            Bình luận
          </TabsTrigger>
          <TabsTrigger value="newsletter">
            <Users className="w-4 h-4 mr-2" />
            Newsletter
          </TabsTrigger>
          <TabsTrigger value="crawl">
            <Globe className="w-4 h-4 mr-2" />
            Crawl dữ liệu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blogs">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Quản lý bài viết</span>
                </CardTitle>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm bài viết..."
                      value={pagination.search}
                      onChange={(e) => setPagination({...pagination, search: e.target.value, page: 1})}
                      className="pl-9 w-full"
                    />
                  </div>
                  <Button variant="outline" onClick={fetchAllData} className="shrink-0">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Làm mới
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Select onValueChange={handleStatusFilter} value={pagination.status}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Lọc trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="Published">Đã xuất bản</SelectItem>
                    <SelectItem value="Draft">Bản nháp</SelectItem>
                    <SelectItem value="Featured">Nổi bật</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select onValueChange={handleSortChange} value={`${pagination.sortBy}-${pagination.sortOrder}`}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publishDate-desc">Mới nhất</SelectItem>
                    <SelectItem value="publishDate-asc">Cũ nhất</SelectItem>
                    <SelectItem value="views-desc">Lượt xem (cao-thấp)</SelectItem>
                    <SelectItem value="views-asc">Lượt xem (thấp-cao)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[40%]">Tiêu đề</TableHead>
                      <TableHead>Tác giả</TableHead>
                      <TableHead>Ngày đăng</TableHead>
                      <TableHead>Lượt xem</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isBlogLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-4 w-[80px]" /></TableCell>
                        </TableRow>
                      ))
                    ) : blogData?.blogs.length ? (
                      blogData.blogs.map((blog) => (
                        <TableRow key={blog.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium truncate max-w-[300px]">
                            <a href={`/blog/${blog.slug}`} target="_blank" className="hover:text-blue-600 hover:underline">
                              {blog.title}
                            </a>
                          </TableCell>
                          <TableCell>{blog.author}</TableCell>
                          <TableCell>
                            {new Date(blog.publishDate).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>{blog.views.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                blog.status === 'Featured' ? 'default' : 
                                blog.status === 'Published' ? 'secondary' : 'outline'
                              }
                              className={
                                blog.status === 'Featured' ? 'bg-purple-100 text-purple-800' : 
                                blog.status === 'Published' ? 'bg-green-100 text-green-800' : ''
                              }
                            >
                              {blog.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4 mr-1" />
                              Quản lý
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Không tìm thấy bài viết nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {blogData && blogData.totalCount > 0 && (
                <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span>-<span className="font-medium">
                      {Math.min(pagination.page * pagination.pageSize, blogData.totalCount)}
                    </span> trong tổng số <span className="font-medium">{blogData.totalCount}</span> bài viết
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Trước
                    </Button>
                    <div className="px-4 text-sm">
                      Trang {pagination.page} / {Math.ceil(blogData.totalCount / pagination.pageSize)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page * pagination.pageSize >= blogData.totalCount}
                      onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                    >
                      Sau <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardFooter>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}