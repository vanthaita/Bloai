/*
  Warnings:

  - You are about to drop the column `notifySubscribers` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "notifySubscribers";

-- CreateTable
CREATE TABLE "CrawlSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrawlSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawledBlog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "crawlSourceId" TEXT,
    "language" TEXT,
    "translatedContent" TEXT,
    "improvedContent" TEXT,

    CONSTRAINT "CrawledBlog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawledBlogProcessLog" (
    "id" TEXT NOT NULL,
    "crawledBlogId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrawledBlogProcessLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CrawledBlog" ADD CONSTRAINT "CrawledBlog_crawlSourceId_fkey" FOREIGN KEY ("crawlSourceId") REFERENCES "CrawlSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawledBlogProcessLog" ADD CONSTRAINT "CrawledBlogProcessLog_crawledBlogId_fkey" FOREIGN KEY ("crawledBlogId") REFERENCES "CrawledBlog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
