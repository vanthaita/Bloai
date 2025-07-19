import React from "react";
import { Button } from "@/components/ui/button";

interface DeleteBlogModalProps {
  deleteBlog: any;
  setDeleteBlog: (b: any) => void;
  deleteBlogMutation: any;
}

const DeleteBlogModal: React.FC<DeleteBlogModalProps> = ({ deleteBlog, setDeleteBlog, deleteBlogMutation }) => {
  if (!deleteBlog) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[350px]">
        <div className="mb-4 font-semibold text-lg">Xác nhận xóa bài viết</div>
        <div className="mb-6 text-muted-foreground">Bạn có chắc chắn muốn xóa bài viết <b>{deleteBlog.title}</b> không?</div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setDeleteBlog(null)}>Hủy</Button>
          <Button variant="destructive" disabled={deleteBlogMutation.status === 'pending'} onClick={() => deleteBlogMutation.mutate({ id: deleteBlog.id })}>Xóa</Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBlogModal; 