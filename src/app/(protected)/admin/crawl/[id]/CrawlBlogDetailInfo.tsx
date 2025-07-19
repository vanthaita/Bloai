import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

interface CrawlBlogDetailInfoProps {
  blog: any;
  viewOnly: boolean;
  editMode: boolean;
  editData: any;
  handleEditChange: (field: string, value: any) => void;
}

const CrawlBlogDetailInfo: React.FC<CrawlBlogDetailInfoProps> = ({
  blog,
  viewOnly,
  editMode,
  editData,
  handleEditChange,
}) => (
  <div className="flex-1 space-y-4">
    <div>
      <div className="text-muted-foreground text-xs mb-1">Tác giả</div>
      {viewOnly || !editMode ? (
        <div className="font-medium text-base">{blog.author || <span className="text-gray-400">Không có</span>}</div>
      ) : (
        <Input value={editData.author || ""} onChange={e => handleEditChange("author", e.target.value)} />
      )}
    </div>
    <div>
      <div className="text-muted-foreground text-xs mb-1">Chủ đề</div>
      {viewOnly || !editMode ? (
        <div className="font-medium text-base">{blog.topic || <span className="text-gray-400">Không có</span>}</div>
      ) : (
        <Input value={editData.topic || ""} onChange={e => handleEditChange("topic", e.target.value)} />
      )}
    </div>
    <div>
      <div className="text-muted-foreground text-xs mb-1">Tags</div>
      {viewOnly || !editMode ? (
        blog.tags && blog.tags.length > 0 ? (
          blog.tags.map((tag: string) => (
            <TooltipProvider key={tag}>
              <Tooltip><TooltipTrigger asChild><Badge className="mr-1 mb-1 inline-block bg-blue-100 text-blue-800 border-none cursor-pointer">{tag}</Badge></TooltipTrigger><TooltipContent>Tag: {tag}</TooltipContent></Tooltip>
            </TooltipProvider>
          ))
        ) : (
          <span className="text-gray-400">Không có</span>
        )
      ) : (
        <Input value={editData.tags ? editData.tags.join(", ") : ""} onChange={e => handleEditChange("tags", e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean))} placeholder="tag1, tag2, ..." />
      )}
    </div>
    <div>
      <div className="text-muted-foreground text-xs mb-1">Độ ưu tiên</div>
      {viewOnly || !editMode ? (
        <div className="font-medium text-base">{blog.priority || <span className="text-gray-400">Không có</span>}</div>
      ) : (
        <Input value={editData.priority || ""} onChange={e => handleEditChange("priority", e.target.value)} />
      )}
    </div>
    <div>
      <div className="text-muted-foreground text-xs mb-1">Ngôn ngữ</div>
      {viewOnly || !editMode ? (
        <div className="font-medium text-base">{blog.language || <span className="text-gray-400">Không có</span>}</div>
      ) : (
        <Input value={editData.language || ""} onChange={e => handleEditChange("language", e.target.value)} />
      )}
    </div>
    <div>
      <div className="text-muted-foreground text-xs mb-1">Trạng thái</div>
      {viewOnly || !editMode ? (
        <Badge className={`rounded px-3 py-1 font-semibold text-xs ${statusColor(blog.status)}`}>{statusOptions.find(s => s.value === blog.status)?.label || blog.status}</Badge>
      ) : (
        <Select value={editData.status || "pending"} onValueChange={v => handleEditChange("status", v)}>
          <SelectTrigger><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
          <SelectContent>
            {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
    </div>
  </div>
);

export default CrawlBlogDetailInfo; 