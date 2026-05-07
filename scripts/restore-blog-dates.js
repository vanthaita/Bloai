import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function restoreBlogDates(backupFileName) {
  try {
    console.log('🔄 Bắt đầu khôi phục thời gian bài viết...\n');

    const backupDir = path.join(__dirname, 'backups');
    
    // Nếu không có tên file, liệt kê các backup có sẵn
    if (!backupFileName) {
      if (!fs.existsSync(backupDir)) {
        console.log('❌ Không tìm thấy thư mục backup');
        return;
      }

      const backupFiles = fs.readdirSync(backupDir)
        .filter(file => file.startsWith('blog-dates-backup-') && file.endsWith('.json'))
        .sort()
        .reverse();

      if (backupFiles.length === 0) {
        console.log('❌ Không có file backup nào');
        return;
      }

      console.log('📁 Các file backup có sẵn:\n');
      backupFiles.forEach((file, index) => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        console.log(`${index + 1}. ${file}`);
        console.log(`   Ngày backup: ${new Date(data.backupDate).toLocaleString('vi-VN')}`);
        console.log(`   Số bài viết: ${data.totalBlogs}\n`);
      });

      console.log('💡 Để restore, chạy: node scripts/restore-blog-dates.js <tên-file-backup>');
      console.log('   Ví dụ: node scripts/restore-blog-dates.js blog-dates-backup-2026-05-07T10-30-00-000Z.json');
      return;
    }

    // Đọc file backup
    const backupFile = path.join(backupDir, backupFileName);
    
    if (!fs.existsSync(backupFile)) {
      console.log(`❌ Không tìm thấy file: ${backupFileName}`);
      return;
    }

    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));
    
    console.log(`📂 Đang restore từ: ${backupFileName}`);
    console.log(`📅 Ngày backup: ${new Date(backupData.backupDate).toLocaleString('vi-VN')}`);
    console.log(`📝 Số bài viết: ${backupData.totalBlogs}\n`);

    // Restore từng bài viết
    let successCount = 0;
    let errorCount = 0;

    for (const blog of backupData.blogs) {
      try {
        await prisma.blog.update({
          where: { id: blog.id },
          data: {
            publishDate: new Date(blog.publishDate),
            updatedAt: new Date(blog.updatedAt)
          }
        });

        console.log(`✅ ${blog.title}`);
        console.log(`   Đã khôi phục: ${new Date(blog.publishDate).toLocaleString('vi-VN')}\n`);
        successCount++;
      } catch (error) {
        console.log(`❌ Lỗi khi restore "${blog.title}": ${error.message}\n`);
        errorCount++;
      }
    }

    console.log(`\n🎉 Hoàn thành!`);
    console.log(`   ✅ Thành công: ${successCount} bài`);
    if (errorCount > 0) {
      console.log(`   ❌ Lỗi: ${errorCount} bài`);
    }

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Lấy tên file từ command line argument
const backupFileName = process.argv[2];
restoreBlogDates(backupFileName);
