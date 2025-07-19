"use client"
import { useForm } from 'react-hook-form'
import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Activity, Database } from 'lucide-react'
import { api as trpcApi } from '@/trpc/react'
import CrawlSourceForm from './CrawlSourceForm'
import CrawlSourceTable from './CrawlSourceTable'
import BlogLinksFetcher from './BlogLinksFetcher'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'

export default function AdminCrawlSection() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [creating, setCreating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const createCrawlSource = trpcApi.crawlSource.create.useMutation()
  const { data: crawlSources, refetch: refetchCrawlSources, isLoading: isCrawlSourcesLoading } = trpcApi.admin.getAllCrawlSources.useQuery()
  const [selectedSource, setSelectedSource] = useState<string>('')
  const [customUrl, setCustomUrl] = useState('')
  const [crawlResult, setCrawlResult] = useState<any>(null)
  const [crawling, setCrawling] = useState(false)
  const crawlMutation = trpcApi.crawlSource.crawl.useMutation()
  const saveCrawledBlog = trpcApi.crawlSource.saveCrawledBlog.useMutation()
  const [saveStatus, setSaveStatus] = useState<string>('')
  const [blogLinks, setBlogLinks] = useState<any[]>([]);
  const [blogLinksLoading, setBlogLinksLoading] = useState(false);
  const [blogLinksError, setBlogLinksError] = useState('');
  const [blogLinksUrl, setBlogLinksUrl] = useState('');
  const crawlBlogLinksMutation = trpcApi.crawlSource.crawlBlogLinks.useMutation();
  const crawlAndSaveSelectedBlogsMutation = trpcApi.crawlSource.crawlAndSaveSelectedBlogs.useMutation();

  // State cho filter danh sách blog đã crawl
  const [filterSource, setFilterSource] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');
  const [filterTopic, setFilterTopic] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [searchBlog, setSearchBlog] = useState<string>('');
  const [blogListLimit] = useState(50);
  const crawledBlogsQuery = trpcApi.crawlSource.getCrawledBlogs.useQuery({
    crawlSourceId: filterSource || undefined,
    tag: filterTag || undefined,
    topic: filterTopic || undefined,
    priority: filterPriority || undefined,
    search: searchBlog || undefined,
    limit: blogListLimit,
    offset: 0,
  });
  // Lấy tất cả tag/topic/priority có thể từ dữ liệu (hoặc hardcode demo)
  const allTags = Array.from(new Set((crawledBlogsQuery.data?.blogs || []).flatMap((b: any) => b.tags || [])));
  const allTopics = Array.from(new Set((crawledBlogsQuery.data?.blogs || []).map((b: any) => b.topic).filter(Boolean)));
  const allPriorities = Array.from(new Set((crawledBlogsQuery.data?.blogs || []).map((b: any) => b.priority).filter(Boolean)));

  const [saveListStatus, setSaveListStatus] = useState<string>('');
  const [savingList, setSavingList] = useState(false);
  const crawlAndSaveBlogsMutation = trpcApi.crawlSource.crawlAndSaveBlogsFromList.useMutation();
  const [saveMaxPages, setSaveMaxPages] = useState(1);
  const [selectedBlogIndexes, setSelectedBlogIndexes] = useState<number[]>([]);
  const [showDetail, setShowDetail] = useState<{ open: boolean, blog: any | null }>({ open: false, blog: null });
  const allSelectableIndexes = blogLinks.map((_, idx) => idx);
  const allSelected = selectedBlogIndexes.length === blogLinks.length && blogLinks.length > 0;
  const toggleSelectAll = () => setSelectedBlogIndexes(allSelected ? [] : allSelectableIndexes);
  const toggleSelect = (idx: number) => setSelectedBlogIndexes(selectedBlogIndexes.includes(idx) ? selectedBlogIndexes.filter(i => i !== idx) : [...selectedBlogIndexes, idx]);
  const removeBlogFromList = (idx: number) => {
    setSelectedBlogIndexes(selectedBlogIndexes.filter(i => i !== idx));
    setBlogLinks(blogLinks.filter((_, i) => i !== idx));
  };

  const [selectedCrawledIndexes, setSelectedCrawledIndexes] = useState<string[]>([]);
  const allCrawledIds = crawledBlogsQuery.data?.blogs?.map((b: any) => b.id) || [];
  const allCrawledSelected = selectedCrawledIndexes.length === allCrawledIds.length && allCrawledIds.length > 0;
  const toggleSelectAllCrawled = () => setSelectedCrawledIndexes(allCrawledSelected ? [] : allCrawledIds);
  const toggleSelectCrawled = (id: string) => setSelectedCrawledIndexes(selectedCrawledIndexes.includes(id) ? selectedCrawledIndexes.filter(i => i !== id) : [...selectedCrawledIndexes, id]);
  const [deleting, setDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('');
  const deleteBlogMutation = trpcApi.crawlSource.deleteCrawledBlog?.useMutation?.();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMarkdownDialog, setShowMarkdownDialog] = useState(false);
  const [markdownPreview, setMarkdownPreview] = useState('');
  const [markdownTitle, setMarkdownTitle] = useState('');
  const [markdownImages, setMarkdownImages] = useState<string[]>([]);
  const [markdownUrl, setMarkdownUrl] = useState('');
  const [markdownLoading, setMarkdownLoading] = useState(false);
  const [markdownError, setMarkdownError] = useState('');
  const enhanceMutation = trpcApi.crawlSource.enhanceAndTranslateBlogContent.useMutation();

  // State để điều khiển chế độ xem preview markdown
  const [markdownPreviewMode, setMarkdownPreviewMode] = useState<{ open: boolean, title: string, content: string, images: string[], url: string }>({ open: false, title: '', content: '', images: [], url: '' });

  // Handler cho form thêm CrawlSource
  const onSubmit = async (values: any) => {
    setCreating(true)
    setErrorMsg('')
    try {
      await createCrawlSource.mutateAsync(values)
      reset()
      refetchCrawlSources()
    } catch (e: any) {
      setErrorMsg(e?.message || 'Có lỗi xảy ra')
    } finally {
      setCreating(false)
    }
  }

  // Handler crawl blog
  const handleCrawl = async () => {
    setCrawling(true)
    setCrawlResult(null)
    try {
      const url = customUrl || (crawlSources?.find((s: any) => s.id === selectedSource)?.url)
      if (!url) throw new Error('Vui lòng nhập URL hoặc chọn nguồn')
      const res = await crawlMutation.mutateAsync({ url })
      setCrawlResult(res.data)
    } catch (e: any) {
      setCrawlResult({ error: e?.message || 'Crawl thất bại' })
    } finally {
      setCrawling(false)
    }
  }

  // Handler lưu vào DB
  const handleSaveCrawledBlog = async () => {
    setSaveStatus('')
    if (!crawlResult || !crawlResult.title || !crawlResult.content) {
      setSaveStatus('Dữ liệu không hợp lệ')
      return
    }
    try {
      const crawlSourceId = selectedSource || undefined
      const res = await saveCrawledBlog.mutateAsync({
        title: crawlResult.title,
        content: crawlResult.content,
        sourceUrl: customUrl || (crawlSources?.find((s: any) => s.id === selectedSource)?.url) || '',
        crawlSourceId,
      })
      setSaveStatus(res.success ? 'Đã lưu vào DB!' : 'Lưu thất bại')
    } catch (e: any) {
      setSaveStatus(e?.message || 'Lưu thất bại')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <span>Quản lý nguồn Crawl</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CrawlSourceForm
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            creating={creating}
            errorMsg={errorMsg}
            reset={reset}
          />
          <CrawlSourceTable
            crawlSources={crawlSources || []}
            isCrawlSourcesLoading={isCrawlSourcesLoading}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <span>Lấy danh sách blog từ trang list</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BlogLinksFetcher
            crawlSources={crawlSources || []}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            blogLinksUrl={blogLinksUrl}
            setBlogLinksUrl={setBlogLinksUrl}
            blogLinks={blogLinks}
            setBlogLinks={setBlogLinks}
            blogLinksLoading={blogLinksLoading}
            setBlogLinksLoading={setBlogLinksLoading}
            blogLinksError={blogLinksError}
            setBlogLinksError={setBlogLinksError}
            crawlBlogLinksMutation={crawlBlogLinksMutation}
            selectedBlogIndexes={selectedBlogIndexes}
            setSelectedBlogIndexes={setSelectedBlogIndexes}
            allSelectableIndexes={allSelectableIndexes}
            allSelected={allSelected}
            toggleSelectAll={toggleSelectAll}
            toggleSelect={toggleSelect}
            removeBlogFromList={removeBlogFromList}
            crawlAndSaveSelectedBlogsMutation={crawlAndSaveSelectedBlogsMutation}
            savingList={savingList}
            setSavingList={setSavingList}
            saveListStatus={saveListStatus}
            setSaveListStatus={setSaveListStatus}
            saveMaxPages={saveMaxPages}
            setSaveMaxPages={setSaveMaxPages}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <span>Danh sách blog đã crawl</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4 items-end">
            <Select value={filterSource} onValueChange={v => setFilterSource(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Chọn nguồn" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tất cả nguồn</SelectItem>
                {crawlSources?.map((src: any) => (
                  <SelectItem key={src.id} value={src.id}>{src.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterTag} onValueChange={v => setFilterTag(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Tag" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tất cả tag</SelectItem>
                {allTags.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterTopic} onValueChange={v => setFilterTopic(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Topic" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tất cả topic</SelectItem>
                {allTopics.map(topic => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={v => setFilterPriority(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tất cả priority</SelectItem>
                {allPriorities.map(priority => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input value={searchBlog} onChange={e => setSearchBlog(e.target.value)} placeholder="Tìm kiếm tiêu đề, url..." className="w-[220px]" />
            <Button variant="destructive" size="sm" disabled={selectedCrawledIndexes.length === 0 || deleting} onClick={() => setShowDeleteDialog(true)}>
              Xóa các blog đã chọn
            </Button>
            <Button size="sm" onClick={() => crawledBlogsQuery.refetch()} disabled={crawledBlogsQuery.isLoading}>Làm mới</Button>
            <span className="text-sm text-gray-600 ml-2">Đã chọn: {selectedCrawledIndexes.length}</span>
            {deleteStatus && <span className="text-green-600 ml-2">{deleteStatus}</span>}
          </div>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận xóa blog</DialogTitle>
              </DialogHeader>
              <div>Bạn có chắc chắn muốn xóa <b>{selectedCrawledIndexes.length}</b> blog đã chọn khỏi database?</div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Hủy</Button>
                <Button variant="destructive"
                  disabled={deleting}
                  onClick={async () => {
                    setShowDeleteDialog(false);
                    setDeleting(true);
                    setDeleteStatus('');
                    try {
                      for (const id of selectedCrawledIndexes) {
                        await deleteBlogMutation.mutateAsync({ id });
                      }
                      setDeleteStatus('Đã xóa các blog đã chọn.');
                      setSelectedCrawledIndexes([]);
                      await crawledBlogsQuery.refetch();
                    } catch (e: any) {
                      setDeleteStatus(e?.message || 'Xóa thất bại');
                    } finally {
                      setDeleting(false);
                    }
                  }}
                >Xóa</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {crawledBlogsQuery.isLoading ? (
            <div>Đang tải...</div>
          ) : crawledBlogsQuery.data?.blogs?.length ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead><Checkbox checked={allCrawledSelected} onCheckedChange={toggleSelectAllCrawled} /></TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày crawl</TableHead>
                    <TableHead>Nguồn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crawledBlogsQuery.data.blogs.map((blog: any) => (
                    <TableRow key={blog.id}>
                      <TableCell><Checkbox checked={selectedCrawledIndexes.includes(blog.id)} onCheckedChange={() => toggleSelectCrawled(blog.id)} /></TableCell>
                      <TableCell className="max-w-[220px] truncate" title={blog.title}>{blog.title}</TableCell>
                      <TableCell className="max-w-[220px] truncate"><a href={blog.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{blog.sourceUrl}</a></TableCell>
                      <TableCell>{(blog.tags || []).map((tag: string) => <span key={tag} className="inline-block bg-gray-200 rounded px-2 py-0.5 mr-1 text-xs">{tag}</span>)}</TableCell>
                      <TableCell>{blog.topic}</TableCell>
                      <TableCell>{blog.priority}</TableCell>
                      <TableCell>{blog.status}</TableCell>
                      <TableCell>{new Date(blog.createdAt).toLocaleString('vi-VN')}</TableCell>
                      <TableCell>{crawlSources?.find((src: any) => src.id === blog.crawlSourceId)?.name || <span className="text-gray-400">N/A</span>}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={async () => {
                            if (blog.id) {
                              window.open(`/admin/crawl/${blog.id}`, '_blank');
                            } else {
                              try {
                                const res = await saveCrawledBlog.mutateAsync({
                                  title: blog.title,
                                  content: blog.content || '',
                                  sourceUrl: blog.sourceUrl,
                                  crawlSourceId: blog.crawlSourceId || undefined,
                                });
                                if (res.success && res.crawledBlog) {
                                  window.open(`/admin/crawl/${res.crawledBlog.id}`, '_blank');
                                }
                              } catch (e: any) {
                                alert(e?.message || 'Lỗi khi tạo crawlBlog.');
                              }
                            }
                          }}
                        >Tạo crawlBlog</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div>Không có blog nào.</div>
          )}
        </CardContent>
      </Card>
      {markdownPreviewMode.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <div className="font-bold text-xl mb-2">Preview blog markdown</div>
            <div className="mb-4 text-gray-600">URL: {markdownPreviewMode.url}</div>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto max-h-96 whitespace-pre-wrap text-sm">{markdownPreviewMode.content}</pre>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setMarkdownPreviewMode({ open: false, title: '', content: '', images: [], url: '' })}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 