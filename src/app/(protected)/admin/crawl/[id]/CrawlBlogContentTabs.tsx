import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Languages, Sparkles, Copy } from "lucide-react";
import { toast } from "react-toastify";

interface CrawlBlogContentTabsProps {
  blog: any;
}

const CrawlBlogContentTabs: React.FC<CrawlBlogContentTabsProps> = ({ blog }) => (
  <Tabs defaultValue="original" className="w-full mb-8">
    <TabsList className="w-full flex gap-2 bg-muted/50 p-1 rounded-lg mb-4">
      <TabsTrigger value="original" className="flex-1 flex items-center gap-2 text-base font-semibold"><FileText className="w-5 h-5 text-primary" />Nội dung gốc</TabsTrigger>
      <TabsTrigger value="translated" className="flex-1 flex items-center gap-2 text-base font-semibold"><Languages className="w-5 h-5 text-blue-500" />Nội dung dịch</TabsTrigger>
      <TabsTrigger value="improved" className="flex-1 flex items-center gap-2 text-base font-semibold"><Sparkles className="w-5 h-5 text-yellow-500" />Nội dung cải tiến</TabsTrigger>
    </TabsList>
    <TabsContent value="original">
      <Card className="bg-white/95 border border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-5 px-5">
          <FileText className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg text-primary">Nội dung gốc</span>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => {navigator.clipboard.writeText(blog.content || ''); toast.success('Đã copy nội dung gốc!')}}><Copy className="w-5 h-5" /></Button>
        </CardHeader>
        <CardContent className="pt-0 px-5 pb-5">
          <Textarea value={blog.content || ""} readOnly className="bg-muted min-h-[200px] max-h-[600px] font-mono text-[15px] resize-none focus:ring-2 focus:ring-primary/30" style={{height: 'auto'}} />
        </CardContent>
      </Card>
    </TabsContent>
    <TabsContent value="translated">
      <Card className="bg-white/95 border border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-5 px-5">
          <Languages className="w-6 h-6 text-blue-500" />
          <span className="font-bold text-lg text-blue-600">Nội dung dịch</span>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => {navigator.clipboard.writeText(blog.translatedContent || ''); toast.success('Đã copy nội dung dịch!')}}><Copy className="w-5 h-5" /></Button>
        </CardHeader>
        <CardContent className="pt-0 px-5 pb-5">
          <Textarea value={blog.translatedContent || ""} readOnly className="bg-muted min-h-[200px] max-h-[600px] font-mono text-[15px] resize-none focus:ring-2 focus:ring-blue-200" style={{height: 'auto'}} />
        </CardContent>
      </Card>
    </TabsContent>
    <TabsContent value="improved">
      <Card className="bg-white/95 border border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-5 px-5">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <span className="font-bold text-lg text-yellow-600">Nội dung cải tiến</span>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => {navigator.clipboard.writeText(blog.improvedContent || ''); toast.success('Đã copy nội dung cải tiến!')}}><Copy className="w-5 h-5" /></Button>
        </CardHeader>
        <CardContent className="pt-0 px-5 pb-5">
          <Textarea value={blog.improvedContent || ""} readOnly className="bg-muted min-h-[200px] max-h-[600px] font-mono text-[15px] resize-none focus:ring-2 focus:ring-yellow-200" style={{height: 'auto'}} />
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
);

export default CrawlBlogContentTabs; 