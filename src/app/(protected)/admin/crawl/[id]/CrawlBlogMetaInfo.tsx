import React from "react";

interface CrawlBlogMetaInfoProps {
  blog: any;
}

const CrawlBlogMetaInfo: React.FC<CrawlBlogMetaInfoProps> = ({ blog }) => (
  <div className="flex-1 space-y-4">
    <div>
      <div className="text-muted-foreground text-xs mb-1">Ngày tạo</div>
      <div className="font-medium text-base">{blog.createdAt ? new Date(blog.createdAt).toLocaleString("vi-VN") : ""}</div>
    </div>
    <div>
      <div className="text-muted-foreground text-xs mb-1">Ngày cập nhật</div>
      <div className="font-medium text-base">{blog.updatedAt ? new Date(blog.updatedAt).toLocaleString("vi-VN") : ""}</div>
    </div>
    <div>
      <div className="text-muted-foreground text-xs mb-1">Ngày xuất bản</div>
      <div className="font-medium text-base">{blog.publishedAt ? new Date(blog.publishedAt).toLocaleString("vi-VN") : <span className="text-gray-400">Không có</span>}</div>
    </div>
    <div>
      <div className="text-muted-foreground text-xs mb-1">Nguồn Crawl</div>
      <div className="font-medium text-base">{blog.crawlSourceId || <span className="text-gray-400">Không có</span>}</div>
    </div>
    <div>
      <div className="text-muted-foreground text-xs mb-1">ID</div>
      <div className="font-mono text-xs text-gray-500">{blog.id}</div>
    </div>
  </div>
);

export default CrawlBlogMetaInfo; 