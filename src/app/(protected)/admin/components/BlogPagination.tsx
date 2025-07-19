import React from "react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPaginationProps {
  pagination: any;
  setPagination: (p: any) => void;
  blogData: any;
}

const BlogPagination: React.FC<BlogPaginationProps> = ({ pagination, setPagination, blogData }) => (
  <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
    <div className="text-sm text-muted-foreground">
      Hiển thị <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span>-<span className="font-medium">{Math.min(pagination.page * pagination.pageSize, blogData.totalCount)}</span> trong tổng số <span className="font-medium">{blogData.totalCount}</span> bài viết
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
);

export default BlogPagination; 