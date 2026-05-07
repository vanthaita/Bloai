# Script Cập Nhật Thời Gian Bài Viết

## Mô tả

Script này giúp cập nhật thời gian xuất bản (`publishDate`) cho tất cả bài viết blog trong database với các đặc điểm:

- ⏰ Random thời gian từ **1/3/2026** đến **5/5/2026**
- 📅 Tối đa **2 bài mỗi ngày**
- 🎲 Phân bổ ngẫu nhiên và đều đặn
- ⏱️ Thời gian trong ngày từ 8h sáng đến 8h tối
- 💾 **Tự động backup trước khi cập nhật**

## Cách sử dụng

### 1. Cập nhật thời gian (có backup tự động)

```bash
npm run db:update-dates
```

Script sẽ:
- ✅ Tự động tạo file backup trong `scripts/backups/`
- ✅ Cập nhật thời gian cho tất cả bài viết
- ✅ Hiển thị thống kê chi tiết

### 2. Xem danh sách backup

```bash
npm run db:restore-dates
```

Hoặc:

```bash
node scripts/restore-blog-dates.js
```

Kết quả:

```
📁 Các file backup có sẵn:

1. blog-dates-backup-2026-05-07T10-30-00-000Z.json
   Ngày backup: 7/5/2026, 17:30:00
   Số bài viết: 50

2. blog-dates-backup-2026-05-06T14-15-30-000Z.json
   Ngày backup: 6/5/2026, 21:15:30
   Số bài viết: 50
```

### 3. Khôi phục từ backup

```bash
node scripts/restore-blog-dates.js blog-dates-backup-2026-05-07T10-30-00-000Z.json
```

## Cấu trúc file backup

File backup được lưu tại: `scripts/backups/blog-dates-backup-[timestamp].json`

Cấu trúc JSON:

```json
{
  "backupDate": "2026-05-07T10:30:00.000Z",
  "totalBlogs": 50,
  "blogs": [
    {
      "id": "clx123abc",
      "title": "Hướng dẫn Next.js",
      "slug": "huong-dan-nextjs",
      "publishDate": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-15T10:00:00.000Z"
    }
  ]
}
```

## Output mẫu

### Khi cập nhật:

```
🚀 Bắt đầu cập nhật thời gian bài viết...

📝 Tìm thấy 50 bài viết

💾 Đã backup dữ liệu cũ vào: scripts/backups/blog-dates-backup-2026-05-07T10-30-00-000Z.json

📅 Khoảng thời gian: 66 ngày (từ 1/3/2026 đến 5/5/2026)

⏳ Đang cập nhật database...

✅ Hướng dẫn Next.js cho người mới
   Cũ: 1/1/2026, 10:00:00
   Mới: 3/3/2026, 14:23:45

...

🎉 Hoàn thành! Đã cập nhật 50 bài viết

📊 Thống kê phân bổ:
   1/3/2026: 2 bài
   2/3/2026: 2 bài
   ...
```

### Khi restore:

```
🔄 Bắt đầu khôi phục thời gian bài viết...

📂 Đang restore từ: blog-dates-backup-2026-05-07T10-30-00-000Z.json
📅 Ngày backup: 7/5/2026, 17:30:00
📝 Số bài viết: 50

✅ Hướng dẫn Next.js cho người mới
   Đã khôi phục: 1/1/2026, 10:00:00

...

🎉 Hoàn thành!
   ✅ Thành công: 50 bài
```

## Lưu ý

- 💾 **Tự động backup**: Mỗi lần chạy update sẽ tự động tạo file backup
- 📁 **Vị trí backup**: `scripts/backups/blog-dates-backup-[timestamp].json`
- ⚠️ Script sẽ cập nhật **TẤT CẢ** bài viết trong database
- 🔄 Có thể chạy nhiều lần để random lại thời gian
- 📝 Mỗi lần chạy sẽ tạo ra kết quả khác nhau do tính ngẫu nhiên
- ↩️ Có thể restore về trạng thái cũ bất cứ lúc nào

## Workflow khuyến nghị

1. **Chạy update**: `npm run db:update-dates`
2. **Kiểm tra kết quả** trong database hoặc website
3. **Nếu không hài lòng**: Restore lại và chạy update mới
   ```bash
   npm run db:restore-dates  # Xem danh sách backup
   node scripts/restore-blog-dates.js <tên-file>  # Restore
   npm run db:update-dates  # Update lại
   ```

## Tùy chỉnh

Để thay đổi khoảng thời gian, sửa trong file `update-blog-dates.js`:

```javascript
// Thay đổi ngày bắt đầu và kết thúc
const startDate = new Date('2026-03-01T00:00:00');
const endDate = new Date('2026-05-05T23:59:59');

// Thay đổi số bài tối đa mỗi ngày
if (postsPerDay >= 2) { // Đổi số 2 thành số khác
  dateIndex++;
  postsPerDay = 0;
}

// Thay đổi khung giờ xuất bản
const randomHour = 8 + Math.floor(Math.random() * 12); // 8-19h
```

## Yêu cầu

- Node.js
- Prisma Client
- Database đã được setup và có bài viết

## Troubleshooting

### Lỗi: "Cannot find module '@prisma/client'"

```bash
npm install
npx prisma generate
```

### Lỗi: "Database connection failed"

Kiểm tra file `.env` và đảm bảo `DATABASE_URL` đúng.
