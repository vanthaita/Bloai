-- AlterTable
ALTER TABLE "CrawlSource" ADD COLUMN     "maxPages" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "CrawledBlog" ADD COLUMN     "priority" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "topic" TEXT;
