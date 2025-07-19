import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogTableProps {
  filteredBlogs: any[];
  isBlogLoading: boolean;
  setEditBlog: (b: any) => void;
  setEditBlogTitle: (t: string) => void;
  setEditBlogStatus: (s: string) => void;
  setEditBlogTags: (tags: string[]) => void;
  setDeleteBlog: (b: any) => void;
}

const BlogTable: React.FC<BlogTableProps> = ({ filteredBlogs, isBlogLoading, setEditBlog, setEditBlogTitle, setEditBlogStatus, setEditBlogTags, setDeleteBlog }) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead>Tiêu đề</TableHead>
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
              <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-[80px]" /></TableCell>
            </TableRow>
          ))
        ) : filteredBlogs.length ? (
          filteredBlogs.map(blog => (
            <TableRow key={blog.id} className="hover:bg-gray-50">
              <TableCell className="font-medium truncate max-w-[300px]">
                <a href={`/blog/${blog.slug}`} target="_blank" className="hover:text-blue-600 hover:underline">
                  {blog.title}
                </a>
              </TableCell>
              <TableCell>{blog.author}</TableCell>
              <TableCell>{new Date(blog.publishDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
              <TableCell>{blog.views.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={blog.status === 'Featured' ? 'default' : blog.status === 'Published' ? 'secondary' : 'outline'} className={blog.status === 'Featured' ? 'bg-purple-100 text-purple-800' : blog.status === 'Published' ? 'bg-green-100 text-green-800' : ''}>{blog.status}</Badge>
              </TableCell>
              <TableCell className="text-right flex gap-2 justify-end">
                <Button size="sm" variant="outline" onClick={() => {
                  setEditBlog(blog)
                  setEditBlogTitle(blog.title)
                  setEditBlogStatus(blog.status)
                  setEditBlogTags([])
                }}>Sửa</Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteBlog(blog)}>Xóa</Button>
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
);

export default BlogTable; 