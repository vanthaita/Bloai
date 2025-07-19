import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

const statusOptions = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "processed", label: "Đã xử lý" },
  { value: "translated", label: "Đã dịch" },
  { value: "approved", label: "Đã duyệt" },
  { value: "published", label: "Đã xuất bản" },
  { value: "failed", label: "Lỗi" },
];

const statusColor = (status: string) => {
  switch (status) {
    case "published": return "bg-green-100 text-green-800";
    case "approved": return "bg-blue-100 text-blue-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "failed": return "bg-red-100 text-red-800";
    case "translated": return "bg-purple-100 text-purple-800";
    case "processed": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

interface CrawlBlogHeaderProps {
  blog: any;
  router: any;
  setShowMarkdown: (v: boolean) => void;
  refetch: () => void;
  viewOnly: boolean;
  setViewOnly: (v: (prev: boolean) => boolean) => void;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  handleSave: () => void;
  setEditData: (data: any) => void;
  setSaveStatus: (msg: string) => void;
}

const CrawlBlogHeader: React.FC<CrawlBlogHeaderProps> = ({
  blog,
  router,
  setShowMarkdown,
  refetch,
  viewOnly,
  setViewOnly,
  editMode,
  setEditMode,
  handleSave,
  setEditData,
  setSaveStatus,
}) => (
  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
    <div className="flex items-center gap-3 mb-2 md:mb-0">
      <Button variant="ghost" size="icon" onClick={() => router.push('/admin/crawl')} className="mr-2"><ArrowLeft className="w-5 h-5" /></Button>
      <span className="text-2xl font-bold text-primary flex items-center gap-2">📝 {blog.title || "Chi tiết Crawl Blog"}</span>
    </div>
    <div className="flex flex-wrap gap-2 items-center">
      <Badge className={`rounded px-3 py-1 font-semibold text-xs ${statusColor(blog.status)}`}>{statusOptions.find(s => s.value === blog.status)?.label || blog.status}</Badge>
      <Button variant="outline" size="sm" onClick={() => setShowMarkdown(true)}><Copy className="w-4 h-4 mr-1" />Xem Markdown</Button>
      <Button variant="outline" size="sm" onClick={() => {navigator.clipboard.writeText(blog.content || ''); toast.success('Đã copy nội dung gốc!')}}><Copy className="w-4 h-4 mr-1" />Copy nội dung</Button>
      <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="w-4 h-4 mr-1" />Làm mới</Button>
      <Button variant={viewOnly ? "default" : "secondary"} size="sm" onClick={() => setViewOnly((v) => !v)}>{viewOnly ? "Đang chỉ xem" : "Chỉ xem crawl"}</Button>
      {!viewOnly && !editMode && (<Button variant="outline" size="sm" onClick={() => setEditMode(true)}>Chỉnh sửa</Button>)}
      {!viewOnly && editMode && (<Button variant="default" size="sm" onClick={handleSave}>Lưu</Button>)}
      {!viewOnly && editMode && (<Button variant="secondary" size="sm" onClick={() => { setEditMode(false); setEditData({ ...blog }); setSaveStatus(""); }}>Huỷ</Button>)}
    </div>
  </div>
);

export default CrawlBlogHeader; 