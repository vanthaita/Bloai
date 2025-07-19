import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BlogFilterBarProps {
  pagination: any;
  setPagination: (p: any) => void;
  handleStatusFilter: (v: string) => void;
  handleSortChange: (v: string) => void;
}

const BlogFilterBar: React.FC<BlogFilterBarProps> = ({ pagination, setPagination, handleStatusFilter, handleSortChange }) => (
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
    <Input
      placeholder="Tìm kiếm bài viết..."
      value={pagination.search}
      onChange={e => setPagination({ ...pagination, search: e.target.value, page: 1 })}
      className="w-full md:w-1/3"
    />
    <div className="flex gap-2 items-center">
      <Select value={pagination.status} onValueChange={handleStatusFilter}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="Published">Đã xuất bản</SelectItem>
          <SelectItem value="Featured">Nổi bật</SelectItem>
          <SelectItem value="Draft">Bản nháp</SelectItem>
        </SelectContent>
      </Select>
      <Select value={`${pagination.sortBy}-${pagination.sortOrder}`} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="publishDate-desc">Mới nhất</SelectItem>
          <SelectItem value="publishDate-asc">Cũ nhất</SelectItem>
          <SelectItem value="views-desc">Lượt xem nhiều</SelectItem>
          <SelectItem value="views-asc">Lượt xem ít</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default BlogFilterBar; 