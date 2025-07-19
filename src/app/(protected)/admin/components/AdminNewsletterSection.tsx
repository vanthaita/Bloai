"use client"
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api as trpcApi } from '@/trpc/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminNewsletterSection() {
  const [newsletterPage, setNewsletterPage] = useState(1)
  const [newsletterSearch, setNewsletterSearch] = useState('')
  const { data: newsletterData, isLoading: isNewsletterLoading, refetch: refetchNewsletter } = trpcApi.admin.getAdminViewNewsletter.useQuery({ page: newsletterPage, pageSize: 10, search: newsletterSearch })

  const newsletters = newsletterData?.subscribers || []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Quản lý newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <Input
              placeholder="Tìm kiếm email..."
              value={newsletterSearch}
              onChange={e => { setNewsletterSearch(e.target.value); setNewsletterPage(1) }}
              className="w-full md:w-1/3"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isNewsletterLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                    </TableRow>
                  ))
                ) : newsletters.length ? (
                  newsletters.map(news => (
                    <TableRow key={news.id}>
                      <TableCell>{news.email}</TableCell>
                      <TableCell>{new Date(news.subscribedAt).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell>
                        <Badge variant={news.active ? 'secondary' : 'outline'} className={news.active ? 'bg-green-100 text-green-800' : ''}>{news.active ? 'Đang nhận' : 'Đã hủy'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy email nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {newsletterData && newsletterData.totalCount > 0 && (
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
              <div className="text-sm text-muted-foreground">
                Hiển thị <span className="font-medium">{(newsletterPage - 1) * 10 + 1}</span>-<span className="font-medium">{Math.min(newsletterPage * 10, newsletterData.totalCount)}</span> trong tổng số <span className="font-medium">{newsletterData.totalCount}</span> email
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={newsletterPage === 1} onClick={() => setNewsletterPage(newsletterPage - 1)}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </Button>
                <div className="px-4 text-sm">Trang {newsletterPage} / {Math.ceil(newsletterData.totalCount / 10)}</div>
                <Button variant="outline" size="sm" disabled={newsletterPage * 10 >= newsletterData.totalCount} onClick={() => setNewsletterPage(newsletterPage + 1)}>
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