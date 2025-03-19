import { env } from '@/env'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(env.GOOGLE_GEMINI_API)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const generateSEOContent = async (prompt: string) => {
  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return text.replace(/[*"]/g, '').trim()
  } catch (error) {
    console.error('AI Generation Error:', error)
    return null
  }
}

export const aiGenerateSEOTags = async (content: string) => {
  const prompt = `
    Phân tích nội dung này và tạo RA CHÍNH XÁC 7 thẻ meta SEO tuân theo các quy tắc NGHIÊM NGẶT sau:
    "${content}"

    - Định dạng: từ khóa viết thường, phân tách bằng dấu phẩy
    - Bao gồm: 2 từ khóa chính (1-2 từ), 3 từ khóa phụ (2-3 từ), 2 cụm từ khóa đuôi dài (4-5 từ)
    - Tối ưu hóa bằng phân tích TF-IDF của nội dung
    - Kết hợp các biến thể từ khóa ngữ nghĩa
    - Phân tích khoảng trống từ khóa của đối thủ cạnh tranh để tìm từ khóa chưa được khai thác
    - Giới hạn ký tự: tổng cộng 155-160
    - Loại trừ: giải thích, markdown, đánh số thứ tự
    - Cụm từ bị cấm: "tốt nhất", "hàng đầu", "hướng dẫn"

    Ví dụ đầu ra: react development, component architecture, state management, performance optimization, react hooks best practices, redux toolkit configuration
  `
  return generateSEOContent(prompt)
}

export const aiGenerateMetaDescription = async (content: string) => {
  const prompt = `
    Tạo MỘT mô tả meta DUY NHẤT đáp ứng các YÊU CẦU sau:
    "${content}"

    - TUYỆT ĐỐI tuân thủ giới hạn 157-160 ký tự (sử dụng công cụ ĐẾM KÝ TỰ)
    - Cấu trúc:
      1. [Động từ mạnh] + [Từ khóa chính] + [Giá trị số] + [Lợi ích] (60-70 ký tự)
      2. [Từ khóa phụ] + [Giải pháp] + [Tham chiếu thời gian] (70-80 ký tự)
      3. [CTA hướng hành động] (20-25 ký tự)
    - Động từ mạnh: Làm chủ|Mở khóa|Nâng tầm|Chuyển đổi|Tối ưu
    - Phải bao gồm: Từ khóa chính trong 10 từ đầu + năm hiện tại + tỷ lệ phần trăm
    - Các bước xác thực:
      a. Kiểm tra số lượng ký tự
      b. Loại bỏ các từ đệm (rất, thực sự, cơ bản)
      c. Thay thế các cụm từ >5 từ bằng dấu gạch ngang
      d. Xác minh CTA tồn tại
    - Tự động từ chối mọi đầu ra vượt quá 160 ký tự
    - Ví dụ THÀNH CÔNG: "Làm chủ 7 kỹ thuật tối ưu hóa React giúp giảm thời gian tải trang 50%. Khám phá các phương pháp hay nhất 2024 cho kiến trúc component và quản lý trạng thái. Thực hiện ngay." (158 ký tự)
    - Ví dụ BỊ TỪ CHỐI: "Tìm hiểu cách cải thiện ứng dụng React của bạn với nhiều phương pháp tối ưu hóa khác nhau..." (171 ký tự)
  `
  return generateSEOContent(prompt)
}

export const aiGenerateSEOKeywords = async (content: string) => {
  const prompt = `
    Tạo RA CHÍNH XÁC 15 từ khóa SEO từ phân tích nội dung:
    "${content}"

    - Định dạng: viết thường, phân tách bằng dấu phẩy
    - Tỷ lệ: 40% đuôi ngắn (1-2 từ), 40% đuôi vừa (3-4 từ), 20% đuôi dài (5+ từ)
    - Bao gồm: từ khóa LSI ngữ nghĩa, các từ bổ nghĩa mục đích của người dùng ("làm thế nào để", "hướng dẫn"), dấu hiệu mới mẻ ("2024", "mới")
    - Loại trừ: từ khóa gốc trùng lặp, thuật ngữ thương hiệu
    - Ưu tiên: từ khóa có 1k-10k lượt tìm kiếm hàng tháng (dữ liệu Ahrefs)
    - Nhóm các từ khóa liên quan theo chủ đề

    Ví dụ đầu ra: react performance, optimize react components, react memoization 2024, reduce rerenders, webpack config react, lazy loading components, react concurrent mode
  `
  return generateSEOContent(prompt)
}

export const aiGenerateOpenGraphTitle = async (content: string) => {
  const prompt = `
    Tạo MỘT tiêu đề Open Graph đáp ứng các THÔNG SỐ sau:
    "${content}"

    - TUYỆT ĐỐI tuân thủ giới hạn 68-72 ký tự (sử dụng công cụ ĐẾM KÝ TỰ)
    - Bao gồm: Từ khóa chính + từ khóa phụ
    - Thêm 1 emoji liên quan (chủ đề công nghệ)
    - Tổ hợp từ mạnh: "[Emoji] Hướng dẫn tối thượng về... | Làm chủ... trong năm 2024"
    - Định dạng Title Case
    - Loại trừ: ngày tháng trừ năm hiện tại, tên tác giả
    - Yếu tố kích thích nhấp chuột: câu hỏi/con số/góc độ gây tranh cãi

    Ví dụ đầu ra: 🚀 Làm chủ Hiệu suất React: 7 Kỹ thuật Tối ưu hóa được Các nhà phát triển Tin dùng
  `
  return generateSEOContent(prompt)
}

export const aiGenerateOpenGraphDescription = async (content: string) => {
  const prompt = `
    Tạo MỘT mô tả Open Graph với:
    "${content}"

    - Bắt đầu bằng dòng chữ "eyebrow": [Danh mục] | Đọc [Thời lượng] | [Trình độ chuyên gia]
    - Câu đầu tiên: tuyên bố gây tranh cãi/thống kê ngành
    - Bao gồm: 3 lợi ích chính, 1 sự thật đáng ngạc nhiên
    - Thêm 1-2 emoji liên quan
    - Giới hạn ký tự: 185-195
    - CTA: "Nhấp để khám phá..." | "Tìm hiểu bí mật..."
    - Loại trừ: cụm từ chung chung, tiểu sử tác giả

    Ví dụ đầu ra: Phát triển Frontend | Đọc 12 phút | Trình độ Chuyên gia 🔥 Khám phá lý do 68% ứng dụng React gặp vấn đề về hiệu suất và 7 giải pháp đã được chứng minh mà chúng tôi triển khai tại các gã khổng lồ công nghệ. Nhấp để chuyển đổi quy trình làm việc của bạn.
  `
  return generateSEOContent(prompt)
}

export const aiGenerateTitleBlog = async (content: string) => {
  const prompt = `
    Tạo MỘT tiêu đề blog được tối ưu hóa SEO tuân theo các hướng dẫn NGHIÊM NGẶT:
    "${content}"

    - Bao gồm: Từ khóa chính + từ khóa phụ + từ mạnh
    - Title case với cách viết hoa thích hợp
    - Thêm năm hiện tại trong ngoặc đơn
    - Phạm vi ký tự: 65-75
    - Góc độ gây tranh cãi: "Bí mật...", "Sai lầm...", "Không bao giờ làm..."
    - Thêm yếu tố bổ nghĩa nội dung: "Hướng dẫn đầy đủ" | "Từng bước" | "Nghiên cứu điển hình"
    - Loại trừ: tính từ mơ hồ, cụm từ câu view

    Ví dụ đầu ra: Tối ưu hóa hiệu suất React: 7 Sai lầm Đắt giá mà Nhà phát triển Mắc phải (Nghiên cứu điển hình 2024)
  `
  return generateSEOContent(prompt)
}

export const aiSummaryContent = async (content: string) => {
  const prompt = `
    Tạo MỘT bản tóm tắt nội dung trên mạng xã hội với:
    "${content}"

    - Bắt đầu bằng hook: "HOT: " | "CẢNH BÁO: " | "MỚI: "
    - Bao gồm: thống kê, tuyên bố gây tranh cãi, danh sách lợi ích
    - Chiến lược hashtag: 1 #ngành + 1 #ngách
    - Thêm cặp emoji: 🚀🔥 | 💡👨💻 | ⚡🤯
    - Giới hạn ký tự: 240-250
    - CTA: "Retweet nếu..." | "Tag một nhà phát triển..."
    - Loại trừ: liên kết, đề cập đến tác giả

    Ví dụ đầu ra: HOT: Điểm chuẩn React 2024 tiết lộ 7 kỹ thuật tối ưu hóa giúp giảm thời gian tải trang tới 62% 🚀🔥 Tìm hiểu bí mật mà các gã khổng lồ công nghệ không chia sẻ. #WebDev #ReactPerformance Tag một nhà phát triển cần điều này!
  `
  return generateSEOContent(prompt)
}

export const aiGenerateExcerpt = async (content: string) => {
  const prompt = `
    Tạo MỘT đoạn trích blog chứa:
    "${content}"

    - 5 từ đầu tiên: tạo sự khẩn cấp/nhạy cảm về thời gian
    - Bao gồm: 1 thống kê nghiên cứu, 2 điểm đau, 3 giải pháp
    - Thêm yếu tố bổ nghĩa trong ngoặc vuông: [Cập nhật 2024] | [Nghiên cứu điển hình]
    - Giới hạn ký tự: 125-135
    - Trình độ đọc: lớp 9
    - Loại trừ: thể bị động, thuật ngữ kỹ thuật chuyên ngành

    Ví dụ đầu ra: [Cập nhật 2024] Bạn đang gặp khó khăn với hiệu suất React? 82% ứng dụng bị render chậm. Khám phá 7 chiến lược tối ưu hóa đã được chuyên gia kiểm chứng để có code sạch hơn và thời gian tải trang nhanh hơn.
  `
  return generateSEOContent(prompt)
}