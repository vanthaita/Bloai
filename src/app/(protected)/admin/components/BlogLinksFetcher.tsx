import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface BlogLinksFetcherProps {
  crawlSources: any[];
  selectedSource: string;
  setSelectedSource: (v: string) => void;
  blogLinksUrl: string;
  setBlogLinksUrl: (v: string) => void;
  blogLinks: any[];
  setBlogLinks: (v: any[]) => void;
  blogLinksLoading: boolean;
  setBlogLinksLoading: (v: boolean) => void;
  blogLinksError: string;
  setBlogLinksError: (v: string) => void;
  crawlBlogLinksMutation: any;
  selectedBlogIndexes: number[];
  setSelectedBlogIndexes: (v: number[]) => void;
  allSelectableIndexes: number[];
  allSelected: boolean;
  toggleSelectAll: () => void;
  toggleSelect: (idx: number) => void;
  removeBlogFromList: (idx: number) => void;
  crawlAndSaveSelectedBlogsMutation: any;
  savingList: boolean;
  setSavingList: (v: boolean) => void;
  saveListStatus: string;
  setSaveListStatus: (v: string) => void;
  saveMaxPages: number;
  setSaveMaxPages: (v: number) => void;
}

const BlogLinksFetcher: React.FC<BlogLinksFetcherProps> = ({
  crawlSources, selectedSource, setSelectedSource, blogLinksUrl, setBlogLinksUrl, blogLinks, setBlogLinks, blogLinksLoading, setBlogLinksLoading, blogLinksError, setBlogLinksError, crawlBlogLinksMutation, selectedBlogIndexes, setSelectedBlogIndexes, allSelectableIndexes, allSelected, toggleSelectAll, toggleSelect, removeBlogFromList, crawlAndSaveSelectedBlogsMutation, savingList, setSavingList, saveListStatus, setSaveListStatus, saveMaxPages, setSaveMaxPages
}) => (
  <div>
    <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
      <Select value={selectedSource || '__none__'} onValueChange={val => {
        if (val === '__none__') {
          setSelectedSource('');
          setBlogLinksUrl('');
        } else {
          setSelectedSource(val);
          const src = crawlSources?.find((s: any) => s.id === val);
          if (src) setBlogLinksUrl(src.url);
        }
      }}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Chọn nguồn để lấy URL" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">Chọn nguồn</SelectItem>
          {crawlSources?.map((src: any) => (
            <SelectItem key={src.id} value={src.id}>{src.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-muted-foreground">hoặc</span>
      <Input value={blogLinksUrl} onChange={e => setBlogLinksUrl(e.target.value)} placeholder="Nhập URL trang list blog" className="w-full md:w-1/2" />
      <Button
        onClick={async () => {
          setBlogLinksError('');
          setBlogLinks([]);
          setBlogLinksLoading(true);
          try {
            const res = await crawlBlogLinksMutation.mutateAsync({ url: blogLinksUrl });
            setBlogLinks(res.links || []);
            if (!res.success) setBlogLinksError('Lấy danh sách thất bại');
          } catch (e: any) {
            setBlogLinksError(e?.message || 'Lỗi khi crawl');
          } finally {
            setBlogLinksLoading(false);
          }
        }}
        disabled={blogLinksLoading || !blogLinksUrl}
      >{blogLinksLoading ? 'Đang lấy...' : 'Lấy danh sách blog'}</Button>
    </div>
    {blogLinksError && <div className="text-red-500 mb-2">{blogLinksError}</div>}
    {blogLinks.length > 0 && (
      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} /></TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogLinks.map((link, idx) => (
              <TableRow key={idx}>
                <TableCell><input type="checkbox" checked={selectedBlogIndexes.includes(idx)} onChange={() => toggleSelect(idx)} /></TableCell>
                <TableCell className="truncate max-w-[400px]">{link}</TableCell>
                <TableCell><Button size="sm" variant="destructive" onClick={() => removeBlogFromList(idx)}>Xóa</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex gap-2 items-center mt-4">
          <Input type="number" min={1} value={saveMaxPages} onChange={e => setSaveMaxPages(Number(e.target.value))} className="w-20" />
          <Button
            onClick={async () => {
              setSaveListStatus('');
              setSavingList(true);
              try {
                await crawlAndSaveSelectedBlogsMutation.mutateAsync({ links: selectedBlogIndexes.map(idx => blogLinks[idx]), maxPages: saveMaxPages });
                setSaveListStatus('Đã lưu thành công!');
              } catch (e: any) {
                setSaveListStatus(e?.message || 'Lưu thất bại');
              } finally {
                setSavingList(false);
              }
            }}
            disabled={savingList || selectedBlogIndexes.length === 0}
          >{savingList ? 'Đang lưu...' : 'Lưu các blog đã chọn'}</Button>
          {saveListStatus && <span className={saveListStatus.includes('thành công') ? 'text-green-600' : 'text-red-600'}>{saveListStatus}</span>}
        </div>
      </div>
    )}
  </div>
);

export default BlogLinksFetcher; 