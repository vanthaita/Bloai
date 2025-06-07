'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Plus, RefreshCw, Settings, Globe, Book, Clock } from 'lucide-react'

export default function CrawlManager() {
  const [urls, setUrls] = useState('')
  const [category, setCategory] = useState('technology')
  const [schedule, setSchedule] = useState('immediately')
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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

  const fetchJobs = async () => {
    const response = await fetch('/api/crawl')
    if (response.ok) {
      const data = await response.json()
      setJobs(data)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return (
    <div className="container mx-auto py-8">
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
              <Button variant="outline" size="sm" onClick={fetchJobs}>
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
      
      <Card className="mt-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Bài Viết Đã Dịch</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Nguồn</TableHead>
                <TableHead>Chuyên mục</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}