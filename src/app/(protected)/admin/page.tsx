'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Plus, RefreshCw, Settings, Globe, Book, Clock, FileText, Users, Tag as TagIcon, MessageSquare } from 'lucide-react'

export default function AdminDashboard() {
  const [urls, setUrls] = useState('')
  const [category, setCategory] = useState('technology')
  const [schedule, setSchedule] = useState('immediately')
  const [jobs, setJobs] = useState([])
  const [blogs, setBlogs] = useState([])
  const [tags, setTags] = useState([])
  const [comments, setComments] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('blogs')

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: urls.split('\n').filter(url => url.trim()),
          category,
          schedule
        })
      })
      
      if (response.ok) {
        alert('Crawl job created successfully')
        setUrls('')
        fetchJobs()
      } else {
        throw new Error('Failed to create job')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating crawl job')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      const [jobsRes, blogsRes, tagsRes, commentsRes, subsRes] = await Promise.all([
        fetch('/api/crawl'),
        fetch('/api/blogs'),
        fetch('/api/tags'),
        fetch('/api/comments'),
        fetch('/api/newsletter')
      ])

      if (jobsRes.ok) setJobs(await jobsRes.json())
      if (blogsRes.ok) setBlogs(await blogsRes.json())
      if (tagsRes.ok) setTags(await tagsRes.json())
      if (commentsRes.ok) setComments(await commentsRes.json())
      if (subsRes.ok) setSubscriptions(await subsRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Quản lý bài viết</span>
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => fetchData()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Làm mới
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Tác giả</TableHead>
                    <TableHead>Ngày đăng</TableHead>
                    <TableHead>Lượt xem</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog: any) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">{blog.title}</TableCell>
                      <TableCell>{blog.author?.name || 'Unknown'}</TableCell>
                      <TableCell>{new Date(blog.publishDate).toLocaleDateString()}</TableCell>
                      <TableCell>{blog.views}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          blog.featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {blog.featured ? 'Nổi bật' : 'Bình thường'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <TagIcon className="w-5 h-5" />
                  <span>Quản lý thẻ</span>
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => fetchData()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Làm mới
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên thẻ</TableHead>
                    <TableHead>Số bài viết</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags.map((tag: any) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">{tag.name}</TableCell>
                      <TableCell>{tag.blogs?.length || 0}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Quản lý bình luận</span>
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => fetchData()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Làm mới
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Bài viết</TableHead>
                    <TableHead>Tác giả</TableHead>
                    <TableHead>Ngày đăng</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment: any) => (
                    <TableRow key={comment.id}>
                      <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                      <TableCell className="max-w-xs truncate">{comment.blog?.title}</TableCell>
                      <TableCell>{comment.author?.name || 'Anonymous'}</TableCell>
                      <TableCell>{new Date(comment.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Quản lý Newsletter</span>
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => fetchData()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Làm mới
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Ngày đăng ký</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub: any) => (
                    <TableRow key={sub.id}>
                      <TableCell>{sub.email}</TableCell>
                      <TableCell>{new Date(sub.subscribedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          sub.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {sub.active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crawl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span>Crawl Bài Viết Mới</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">URLs (mỗi URL một dòng)</label>
                    <Input
                      as="textarea"
                      rows={5}
                      value={urls}
                      onChange={(e) => setUrls(e.target.value)}
                      placeholder="https://example.com/blog/post-1\nhttps://example.com/blog/post-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Chuyên mục</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="technology">Công nghệ</option>
                      <option value="business">Kinh doanh</option>
                      <option value="health">Sức khỏe</option>
                      <option value="education">Giáo dục</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Lịch trình</label>
                    <select
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="immediately">Ngay lập tức</option>
                      <option value="daily">Hàng ngày</option>
                      <option value="weekly">Hàng tuần</option>
                    </select>
                  </div>
                  
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <RefreshCw className="animate-spin mr-2" /> : <Plus className="mr-2" />}
                    Tạo Job Crawl
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5" />
                    <span>Lịch Sử Crawl</span>
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => fetchData()}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Làm mới
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Số URL</TableHead>
                      <TableHead>Chuyên mục</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job: any) => (
                      <TableRow key={job._id}>
                        <TableCell>
                          {new Date(job.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{job.urls.length}</TableCell>
                        <TableCell>
                          <span className="capitalize">{job.category}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            job.status === 'completed' ? 'bg-green-100 text-green-800' :
                            job.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status === 'completed' ? 'Hoàn thành' :
                             job.status === 'failed' ? 'Lỗi' : 'Đang xử lý'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4 mr-1" />
                            Chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}