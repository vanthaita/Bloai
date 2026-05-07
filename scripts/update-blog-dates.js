import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Hàm tạo ngày ngẫu nhiên trong khoảng thời gian
function getRandomDate(startDate, endDate) {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
}

// Hàm shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Hàm tạo danh sách ngày từ startDate đến endDate
function generateDateRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

async function updateBlogDates() {
  try {
    console.log('🚀 Bắt đầu cập nhật thời gian bài viết...\n');

    // Lấy tất cả bài blog
    const blogs = await prisma.blog.findMany({
      orderBy: { publishDate: 'asc' }
    });

    if (blogs.length === 0) {
      console.log('❌ Không có bài viết nào trong database');
      return;
    }

    console.log(`📝 Tìm thấy ${blogs.length} bài viết\n`);

    // Tạo backup trước khi cập nhật
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `blog-dates-backup-${timestamp}.json`);

    const backupData = {
      backupDate: new Date().toISOString(),
      totalBlogs: blogs.length,
      blogs: blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        publishDate: blog.publishDate.toISOString(),
        updatedAt: blog.updatedAt.toISOString()
      }))
    };

    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf-8');
    console.log(`💾 Đã backup dữ liệu cũ vào: ${backupFile}\n`);

    // Định nghĩa khoảng thời gian
    const startDate = new Date('2026-03-01T00:00:00');
    const endDate = new Date('2026-05-05T23:59:59');

    // Tạo danh sách tất cả các ngày
    const allDates = generateDateRange(startDate, endDate);
    console.log(`📅 Khoảng thời gian: ${allDates.length} ngày (từ 1/3/2026 đến 5/5/2026)\n`);

    // Shuffle blogs để random
    const shuffledBlogs = shuffleArray(blogs);

    // Phân bổ blogs vào các ngày (tối đa 2 bài/ngày)
    const dateAssignments = [];
    let dateIndex = 0;
    let postsPerDay = 0;

    for (const blog of shuffledBlogs) {
      if (dateIndex >= allDates.length) {
        // Nếu hết ngày, quay lại từ đầu
        dateIndex = 0;
      }

      const baseDate = allDates[dateIndex];
      
      // Tạo thời gian ngẫu nhiên trong ngày (từ 8h sáng đến 8h tối)
      const randomHour = 8 + Math.floor(Math.random() * 12); // 8-19h
      const randomMinute = Math.floor(Math.random() * 60);
      const randomSecond = Math.floor(Math.random() * 60);
      
      const publishDate = new Date(baseDate);
      publishDate.setHours(randomHour, randomMinute, randomSecond);

      dateAssignments.push({
        id: blog.id,
        title: blog.title,
        oldDate: blog.publishDate,
        newDate: publishDate
      });

      postsPerDay++;
      
      // Nếu đã có 2 bài trong ngày, chuyển sang ngày tiếp theo
      if (postsPerDay >= 2) {
        dateIndex++;
        postsPerDay = 0;
      }
    }

    // Cập nhật database
    console.log('⏳ Đang cập nhật database...\n');
    
    for (const assignment of dateAssignments) {
      await prisma.blog.update({
        where: { id: assignment.id },
        data: { 
          publishDate: assignment.newDate,
          updatedAt: assignment.newDate
        }
      });

      console.log(`✅ ${assignment.title}`);
      console.log(`   Cũ: ${assignment.oldDate.toLocaleString('vi-VN')}`);
      console.log(`   Mới: ${assignment.newDate.toLocaleString('vi-VN')}\n`);
    }

    console.log(`\n🎉 Hoàn thành! Đã cập nhật ${dateAssignments.length} bài viết`);
    
    // Thống kê
    const stats = {};
    dateAssignments.forEach(assignment => {
      const dateKey = assignment.newDate.toLocaleDateString('vi-VN');
      stats[dateKey] = (stats[dateKey] || 0) + 1;
    });

    console.log('\n📊 Thống kê phân bổ:');
    Object.entries(stats)
      .sort(([a], [b]) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')))
      .forEach(([date, count]) => {
        console.log(`   ${date}: ${count} bài`);
      });

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy script
updateBlogDates();
