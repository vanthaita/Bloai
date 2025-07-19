"use client"
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RefreshCw, Tag as TagIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { api as trpcApi } from '@/trpc/react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminTagsSection() {
  const [tagPage, setTagPage] = useState(1)
  const [tagSearch, setTagSearch] = useState('')
  const [editTag, setEditTag] = useState<any>(null)
  const [deleteTag, setDeleteTag] = useState<any>(null)
  const [editTagName, setEditTagName] = useState('')
  const [filterCount, setFilterCount] = useState('')
  const [filterType, setFilterType] = useState('>=')
  const { data: tagData, isLoading: isTagLoading, refetch: refetchTags } = trpcApi.blog.getAllTags.useQuery({ page: tagPage, limit: 10 })
  const deleteTagMutation = trpcApi.admin.deleteTag.useMutation({ onSuccess: () => { setDeleteTag(null); refetchTags() } })
  const updateTagMutation = trpcApi.admin.updateTag.useMutation({ onSuccess: () => { setEditTag(null); refetchTags() } })

  let filteredTags = tagData?.tags || []
  if (filterCount && !isNaN(Number(filterCount))) {
    filteredTags = filteredTags.filter(tag =>
      filterType === '>=' ? tag._count.blogs >= Number(filterCount) : tag._count.blogs <= Number(filterCount)
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <TagIcon className="w-5 h-5" />
              <span>Quản lý thẻ</span>
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto items-center">
              <div className="flex items-center gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=">=">≥</SelectItem>
                    <SelectItem value="<=">≤</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={0}
                  placeholder="Số bài viết"
                  value={filterCount}
                  onChange={e => setFilterCount(e.target.value)}
                  className="w-[120px]"
                />
              </div>
              <Button onClick={() => refetchTags()} variant="outline" className="shrink-0">
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Tên thẻ</TableHead>
                  <TableHead>Số bài viết</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isTagLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-[80px]" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredTags.length ? (
                  filteredTags.map(tag => (
                    <TableRow key={tag.id}>
                      <TableCell>{tag.name}</TableCell>
                      <TableCell>{tag._count.blogs}</TableCell>
                      <TableCell className="text-right flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => { setEditTag(tag); setEditTagName(tag.name) }}>Sửa</Button>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteTag(tag)}>Xóa</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy thẻ nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {tagData && tagData.totalTags > 0 && (
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
              <div className="text-sm text-muted-foreground">
                Hiển thị <span className="font-medium">{(tagPage - 1) * 10 + 1}</span>-<span className="font-medium">{Math.min(tagPage * 10, tagData.totalTags)}</span> trong tổng số <span className="font-medium">{tagData.totalTags}</span> thẻ
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={tagPage === 1} onClick={() => setTagPage(tagPage - 1)}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </Button>
                <div className="px-4 text-sm">Trang {tagPage} / {tagData.totalPages}</div>
                <Button variant="outline" size="sm" disabled={tagPage * 10 >= tagData.totalTags} onClick={() => setTagPage(tagPage + 1)}>
                  Sau <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardFooter>
          )}
        </CardContent>
      </Card>
      {/* Modal Sửa Thẻ */}
      <Sheet open={!!editTag} onOpenChange={v => { if (!v) setEditTag(null) }}>
        <SheetContent side="right" className="w-[350px]">
          <SheetHeader>
            <SheetTitle>Sửa tên thẻ</SheetTitle>
          </SheetHeader>
          <form onSubmit={e => { e.preventDefault(); updateTagMutation.mutate({ id: editTag?.id, name: editTagName }) }}>
            <Input value={editTagName} onChange={e => setEditTagName(e.target.value)} className="mb-4" required />
            <SheetFooter>
              <Button type="submit" disabled={updateTagMutation.status === 'pending'}>Lưu</Button>
              <SheetClose asChild>
                <Button type="button" variant="outline" onClick={() => setEditTag(null)}>Hủy</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      {/* Modal Xác nhận Xóa Thẻ */}
      {deleteTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[350px]">
            <div className="mb-4 font-semibold text-lg">Xác nhận xóa thẻ</div>
            <div className="mb-6 text-muted-foreground">Bạn có chắc chắn muốn xóa thẻ <b>{(deleteTag as any).name}</b> không?</div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteTag(null)}>Hủy</Button>
              <Button variant="destructive" disabled={deleteTagMutation.status === 'pending'} onClick={() => deleteTagMutation.mutate({ id: (deleteTag as any).id })}>Xóa</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 