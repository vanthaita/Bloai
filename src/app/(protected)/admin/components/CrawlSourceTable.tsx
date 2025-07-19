import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface CrawlSourceTableProps {
  crawlSources: any[];
  isCrawlSourcesLoading: boolean;
}

const CrawlSourceTable: React.FC<CrawlSourceTableProps> = ({ crawlSources, isCrawlSourcesLoading }) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead>Tên nguồn</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Loại</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày tạo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isCrawlSourcesLoading ? (
          <TableRow><TableCell colSpan={5}>Đang tải...</TableCell></TableRow>
        ) : crawlSources?.length ? (
          crawlSources.map((src: any) => (
            <TableRow key={src.id}>
              <TableCell>{src.name}</TableCell>
              <TableCell className="truncate max-w-[200px]">{src.url}</TableCell>
              <TableCell>{src.type}</TableCell>
              <TableCell>{src.active ? 'Hoạt động' : 'Tạm dừng'}</TableCell>
              <TableCell>{new Date(src.createdAt).toLocaleString('vi-VN')}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow><TableCell colSpan={5}>Chưa có nguồn nào</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

export default CrawlSourceTable; 