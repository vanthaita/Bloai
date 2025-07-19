import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CrawlSourceFormProps {
  register: any;
  handleSubmit: any;
  onSubmit: (values: any) => void;
  creating: boolean;
  errorMsg: string;
  reset: () => void;
}

const CrawlSourceForm: React.FC<CrawlSourceFormProps> = ({ register, handleSubmit, onSubmit, creating, errorMsg }) => (
  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-end mb-8">
    <Input {...register('name', { required: true })} placeholder="Tên nguồn" className="w-full md:w-1/4" />
    <Input {...register('url', { required: true })} placeholder="URL nguồn" className="w-full md:w-1/2" />
    <Input {...register('type', { required: true })} placeholder="Loại (ví dụ: blog, news)" className="w-full md:w-1/6" />
    <Button type="submit" disabled={creating}>Thêm nguồn</Button>
    {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
  </form>
);

export default CrawlSourceForm; 