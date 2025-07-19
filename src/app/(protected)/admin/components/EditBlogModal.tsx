import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface EditBlogModalProps {
  editBlog: any;
  setEditBlog: (b: any) => void;
  editBlogTitle: string;
  setEditBlogTitle: (t: string) => void;
  editBlogStatus: string;
  setEditBlogStatus: (s: string) => void;
  editBlogTags: string[];
  setEditBlogTags: (tags: string[]) => void;
  updateBlogMutation: any;
}

const EditBlogModal: React.FC<EditBlogModalProps> = ({ editBlog, setEditBlog, editBlogTitle, setEditBlogTitle, editBlogStatus, setEditBlogStatus, editBlogTags, setEditBlogTags, updateBlogMutation }) => {
  if (!editBlog) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] max-w-full">
        <div className="mb-4 font-semibold text-lg">Sửa bài viết</div>
        <form onSubmit={e => { e.preventDefault(); updateBlogMutation.mutate({ id: editBlog?.id, title: editBlogTitle, status: editBlogStatus as any, tags: editBlogTags }) }}>
          <div className="mb-4">
            <label className="block mb-1">Tiêu đề:</label>
            <Input value={editBlogTitle} onChange={e => setEditBlogTitle(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Trạng thái:</label>
            <Select value={editBlogStatus} onValueChange={v => setEditBlogStatus(v as any)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Published">Đã xuất bản</SelectItem>
                <SelectItem value="Featured">Nổi bật</SelectItem>
                <SelectItem value="Draft">Bản nháp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Thẻ (cách nhau bởi dấu phẩy):</label>
            <Input value={editBlogTags.join(', ')} onChange={e => setEditBlogTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))} placeholder="tag1, tag2, ..." />
          </div>
          <div className="flex gap-2 justify-end mt-6">
            <Button type="button" variant="outline" onClick={() => setEditBlog(null)}>Hủy</Button>
            <Button type="submit" disabled={updateBlogMutation.status === 'pending'}>Lưu</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogModal; 