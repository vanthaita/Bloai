-- DropForeignKey
ALTER TABLE "CrawledBlog" DROP CONSTRAINT "CrawledBlog_crawlSourceId_fkey";

-- DropForeignKey
ALTER TABLE "CrawledBlogProcessLog" DROP CONSTRAINT "CrawledBlogProcessLog_crawledBlogId_fkey";

-- DropTable
DROP TABLE "CrawlSource";

-- DropTable
DROP TABLE "CrawledBlog";

-- DropTable
DROP TABLE "CrawledBlogProcessLog";

