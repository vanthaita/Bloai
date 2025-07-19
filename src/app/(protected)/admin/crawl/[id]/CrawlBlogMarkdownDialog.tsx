import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CrawlBlogMarkdownDialogProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  content: string;
}

const CrawlBlogMarkdownDialog: React.FC<CrawlBlogMarkdownDialogProps> = ({ open, setOpen, content }) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Nội dung Markdown</DialogTitle>
      </DialogHeader>
      <pre className="bg-zinc-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm max-h-[60vh] whitespace-pre-wrap border border-zinc-800 shadow-inner">
        {content || ""}
      </pre>
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>Đóng</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default CrawlBlogMarkdownDialog; 