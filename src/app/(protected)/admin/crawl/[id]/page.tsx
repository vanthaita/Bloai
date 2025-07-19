"use client";
import React, { useState } from "react";
import { api as trpcApi } from "@/trpc/react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CrawlBlogHeader from "./CrawlBlogHeader";
import CrawlBlogDetailInfo from "./CrawlBlogDetailInfo";
import CrawlBlogMetaInfo from "./CrawlBlogMetaInfo";
import CrawlBlogContentTabs from "./CrawlBlogContentTabs";
import CrawlBlogMarkdownDialog from "./CrawlBlogMarkdownDialog";

const editableFields = [
  "author",
  "status",
  "tags",
  "topic",
  "priority",
  "language",
];

const CrawlBlogDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const safeId = id || "";
  const { data: blog, isLoading, error, refetch } = trpcApi.crawlSource.getCrawledBlog.useQuery(
    { id: safeId },
    { enabled: !!safeId }
  );
  const updateMutation = trpcApi.crawlSource.updateCrawledBlog.useMutation();

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [viewOnly, setViewOnly] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);

  React.useEffect(() => {
    if (blog) setEditData({ ...blog, author: blog.author ?? '', language: blog.language ?? '' });
  }, [blog]);

  const handleEditChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaveStatus("");
    if (!blog) return;
    try {
      await updateMutation.mutateAsync({
        id: blog.id,
        ...editableFields.reduce((acc, field) => {
          if (field === 'author' || field === 'language') {
            acc[field] = editData[field] ?? '';
          } else {
            acc[field] = editData[field];
          }
          return acc;
        }, {} as any),
      });
      setSaveStatus("Lưu thành công!");
      setEditMode(false);
      refetch();
    } catch (e: any) {
      setSaveStatus(e?.message || "Lưu thất bại");
    }
  };

  if (isLoading)
    return (
      <div className="p-8 flex justify-center">
        <span className="text-muted-foreground">Đang tải...</span>
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-red-600 flex justify-center">{error.message}</div>
    );
  if (!blog)
    return (
      <div className="p-8 flex justify-center">Không tìm thấy blog.</div>
    );

  return (
    <div className="mx-auto py-8 px-2 md:px-0">
      <Card className="shadow-xl rounded-2xl border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white rounded-t-2xl border-b border-gray-100 pb-4">
          <CrawlBlogHeader
            blog={blog}
            router={router}
            setShowMarkdown={setShowMarkdown}
            refetch={refetch}
            viewOnly={viewOnly}
            setViewOnly={setViewOnly}
            editMode={editMode}
            setEditMode={setEditMode}
            handleSave={handleSave}
            setEditData={setEditData}
            setSaveStatus={setSaveStatus}
          />
          <div className="text-muted-foreground text-sm mt-2 ml-12 md:ml-0">Nguồn: <a href={blog.sourceUrl || ""} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 break-all">{blog.sourceUrl || ""}</a></div>
        </CardHeader>
        <CardContent className="pt-6 pb-8 px-4 md:px-8">
          {saveStatus && (
            <div className={`mb-2 ${saveStatus.includes("thành công") ? "text-green-600" : "text-red-600"}`}>{saveStatus}</div>
          )}
          <div className="mb-8 flex flex-col md:flex-row gap-8">
            <CrawlBlogDetailInfo
              blog={blog}
              viewOnly={viewOnly}
              editMode={editMode}
              editData={editData}
              handleEditChange={handleEditChange}
            />
            <CrawlBlogMetaInfo blog={blog} />
          </div>
          <Separator className="my-8" />
          <CrawlBlogContentTabs blog={blog} />
        </CardContent>
      </Card>
      <CrawlBlogMarkdownDialog open={showMarkdown} setOpen={setShowMarkdown} content={blog.content || ""} />
    </div>
  );
};

export default CrawlBlogDetailPage; 