import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API,
});

const generateSEOContent = async (prompt: string, modelAi: string = 'gemini-1.5-flash'): Promise<string | null> => {
  try {
    console.log('--- Sending Prompt to AI ---');
    console.log(`--- Is using ${modelAi} model ---`);
    const model = modelAi;
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];
    const result = await genAI.models.generateContent({
      model,
      contents
    });
    if (!result || !result.text) {
      console.error('AI Generation Error: No text in response or response blocked.');
      console.error('AI Response Error Details:', result?.promptFeedback);
      if (result?.candidates) {
        console.error('AI Response Candidate Error:', JSON.stringify(result.candidates, null, 2));
      }
      return null;
    }

    let text = result.text;

    console.log('--- Received AI Response ---');

    text = text.trim();

    const startMarkers = [
      '```markdown\n',
      '```markdown ',
      '```json\n',
      '```json ',
      '```text\n',
      '```text ',
      '```\n',
      '``` ',
      '```',
    ];

    for (const marker of startMarkers) {
      if (text.startsWith(marker)) {
        text = text.substring(marker.length).trimStart();
        break;
      }
    }

    const endMarkers = [
      '\n```',
      ' ```',
      '```',
    ];

    for (const marker of endMarkers) {
      if (text.endsWith(marker)) {
        text = text.substring(0, text.length - marker.length).trimEnd();
        break;
      }
    }

    text = text.trim();


    return text;

  } catch (error: any) {
    console.error('AI Generation Error:', error?.message || error);
    if (error.response) {
      console.error('AI Response Error Details:', JSON.stringify(error.response.promptFeedback, null, 2));
      if (error.response.candidates) {
        console.error('AI Response Candidate Error:', JSON.stringify(error.response.candidates, null, 2));
      }
    }
    return null;
  }
}
// export const aiGenerateSEOTags = async (content: string): Promise<string | null> => {
//   const prompt = `
//     **Mục tiêu:** Tạo bộ thẻ meta keywords TỐI ƯU NHẤT để bài viết này có khả năng ĐỨNG TOP 1 Google tại Việt Nam.

//     **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
//     "${content}"

//     **Yêu cầu NGHIÊM NGẶT (TUYỆT ĐỐI tuân thủ):**
//     1.  **Số lượng:** CHÍNH XÁC 7 thẻ từ khóa. KHÔNG HƠN, KHÔNG KÉM.
//     2.  **Định dạng:** Chỉ gồm các từ khóa viết thường, phân tách BẰNG DUY NHẤT dấu phẩy (","). KHÔNG có khoảng trắng THỪA trước/sau dấu phẩy (trừ khoảng trắng TỰ NHIÊN giữa các từ trong một cụm từ khóa). KHÔNG giải thích. KHÔNG markdown. KHÔNG số thứ tự.
//     3.  **Cấu trúc (Ước tính, dựa trên nội dung):**
//         *   2 từ khóa chính (1-2 từ, cốt lõi nhất RÚT RA TỪ NỘI DUNG).
//         *   3 từ khóa phụ (2-3 từ, mở rộng chủ đề, liên quan chặt chẽ NỘI DUNG).
//         *   2 cụm từ khóa đuôi dài (4-5 từ, giải quyết ý định cụ thể, chi tiết NỘI DUNG).
//     4.  **Tối ưu hóa (Dựa trên NỘI DUNG):**
//         *   Dựa trên các thuật ngữ/khái niệm NỔI BẬT trong nội dung đã cho.
//         *   Kết hợp các biến thể từ khóa ngữ nghĩa tiếng Việt (từ đồng nghĩa, khái niệm liên quan).
//         *   Ưu tiên các từ khóa có khả năng được người dùng Việt Nam tìm kiếm (dựa trên văn phong nội dung).
//     5.  **Giới hạn Ký tự:** Tổng độ dài TẤT CẢ các thẻ (bao gồm cả dấu phẩy và khoảng trắng sau dấu phẩy) KHÔNG ĐƯỢC VƯỢT QUÁ 160 ký tự. Hãy đếm kỹ.
//     6.  **Loại trừ Tuyệt đối:** Các cụm từ bị cấm: "tốt nhất", "hàng đầu", "hướng dẫn".
//     7.  **Ngôn ngữ:** Sử dụng từ ngữ người Việt Nam thường tìm kiếm, PHẢI LIÊN QUAN ĐẾN NỘI DUNG.

//     **Đầu ra CHỈ và CHỈ gồm chuỗi 7 từ khóa theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

//     **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
//     react development,component architecture,state management,performance optimization,react hooks best practices,redux toolkit configuration,tối ưu react app
//     ---END---
//   `;
//   return generateSEOContent(prompt);
// }

export const aiGenerateMetaDescription = async (content: string, generatedKeywords: string = '', modelAi?: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT mô tả meta DUY NHẤT, cực kỳ hấp dẫn, tối ưu SEO, và thôi thúc người dùng nhấp vào KHI XUẤT HIỆN TRÊN GOOGLE.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Các từ khóa quan trọng đã được xác định (Ưu tiên sử dụng nếu phù hợp):**
    ${generatedKeywords ? generatedKeywords : "Không có từ khóa ưu tiên."}

    **Yêu cầu TUYỆT ĐỐI (NGHIÊM NGẶT tuân thủ):**
    1.  **Độ dài:** CHÍNH XÁC trong khoảng 157-160 ký tự. Đây là yêu cầu QUAN TRỌNG NHẤT. Hãy đếm ký tự của đầu ra cuối cùng để đảm bảo. Mọi kết quả ngoài khoảng này sẽ bị TỪ CHỐI.
    2.  **Cấu trúc 3 phần RÕ RỆT (Dựa trên NỘI DUNG và ưu tiên từ khóa):**
        *   Phần 1 (Khoảng 60-70 ký tự): [Động từ mạnh mẽ, cuốn hút tiếng Việt] + [Từ khóa chính cốt lõi RÚT RA TỪ NỘI DUNG, **ưu tiên từ danh sách đã cho**] + [Số liệu/Giá trị cụ thể NẾU CÓ TRONG NỘI DUNG] + [Lợi ích trực tiếp RÚT RA TỪ NỘI DUNG]. Từ khóa chính PHẢI xuất hiện trong 10 từ đầu.
        *   Phần 2 (Khoảng 70-80 ký tự): [Từ khóa phụ liên quan ĐẾN NỘI DUNG, **ưu tiên từ danh sách đã cho**] + [Giải pháp/Cách thức ĐỀ CẬP TRONG NỘI DUNG] + [Yếu tố thời gian/Cập nhật (vd: năm ${new Date().getFullYear()})].
        *   Phần 3 (Khoảng 20-25 ký tự): [CTA thôi thúc hành động bằng tiếng Việt tự nhiên, rõ ràng].
    3.  **Từ ngữ:**
        *   Động từ mạnh gợi ý: Làm chủ | Khám phá | Nâng tầm | Bí quyết | Tối ưu | Giải mã... (chọn từ phù hợp nhất với NỘI DUNG).
        *   Loại bỏ hoàn toàn các từ đệm không cần thiết.
        *   Sử dụng ngôn ngữ tự nhiên, lôi cuốn người đọc Việt.
    4.  **Xác thực Cuối cùng (Kiểm tra trước khi đưa ra đầu ra):**
        *   Kiểm tra lại SỐ KÝ TỰ LẦN CUỐI (PHẢI trong khoảng 157-160).
        *   Đảm bảo có CTA rõ ràng ở cuối.
        *   Từ khóa chính xuất hiện sớm (trong 10 từ đầu).
        *   Có năm hiện tại (${new Date().getFullYear()}).
        *   **Đảm bảo đã ưu tiên sử dụng từ khóa từ danh sách được cung cấp nếu phù hợp.**
    5.  **Định dạng:** CHỈ trả về DUY NHẤT một chuỗi mô tả meta. KHÔNG giải thích. KHÔNG markdown. KHÔNG kèm theo số ký tự.

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    Làm chủ 7 kỹ thuật tối ưu React ${new Date().getFullYear()} giúp giảm tải trang 50%. Khám phá bí quyết cho component và quản lý state hiệu quả, tăng tốc ứng dụng ngay hôm nay. Click xem!
    ---END---
  `;
  return generateSEOContent(prompt, modelAi);
}

export const aiGenerateSEOKeywords = async (content: string, existingKeywords: string[] = [], modelAi?: string): Promise<string | null> => {
  const existingKeywordsString = existingKeywords.join(', ');
  const prompt = `
    **Mục tiêu:** Tạo danh sách từ khóa SEO chiến lược giúp nội dung bao phủ tối đa các truy vấn tìm kiếm liên quan của người dùng Việt Nam. Danh sách từ khóa này nên bao gồm cả các từ khóa quan trọng từ database hiện có của tôi nếu chúng phù hợp với nội dung.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Danh sách từ khóa ưu tiên từ Database (Nếu có):**
    ${existingKeywordsString ? existingKeywordsString : "Không có danh sách ưu tiên."}

    **Yêu cầu CHÍNH XÁC (TUYỆT ĐỐI tuân thủ):**
    1.  **Số lượng:** ĐÚNG 15 từ khóa. KHÔNG HƠN, KHÔNG KÉM.
    2.  **Định dạng:** Viết thường, phân tách BẰNG DUY NHẤT dấu phẩy (","). KHÔNG có khoảng trắng THỪA trước/sau dấu phẩy. KHÔNG giải thích. KHÔNG markdown.
    3.  **Cấu trúc (Ước tính, Dựa trên NỘI DUNG):**
        *   Ưu tiên sử dụng các từ khóa trong "Danh sách từ khóa ưu tiên từ Database" NẾU CHÚNG THỰC SỰ LIÊN QUAN và PHÙ HỢP với nội dung đã cho. Không sử dụng từ khóa ưu tiên nếu không liên quan.
        *   Sau khi đã sử dụng các từ khóa ưu tiên phù hợp, hãy tạo thêm các từ khóa mới (đuôi ngắn, đuôi vừa, đuôi dài - theo phân bổ tỷ lệ ước tính dưới đây) dựa trên phân tích nội dung để đạt đủ số lượng 15.
        *   Phân bổ tỷ lệ cho TOÀN BỘ 15 từ khóa (sau khi đã tính các từ khóa ưu tiên được sử dụng):
            *   ~40% đuôi ngắn (1 từ): Từ khóa cốt lõi NỔI BẬT TRONG NỘI DUNG, volume cao (ước tính).
            *   ~40% đuôi vừa (2-4 từ): Từ khóa cụ thể hơn, thể hiện ý định rõ hơn, liên quan chặt chẽ NỘI DUNG.
            *   ~20% đuôi dài (1-2 từ): Từ khóa rất cụ thể, giải quyết nhu cầu chi tiết, thường là câu hỏi LIÊN QUAN ĐẾN NỘI DUNG.
    4.  **Chất lượng & Đa dạng (Dựa trên NỘI DUNG và danh sách ưu tiên):**
        *   Bao gồm từ khóa LSI ngữ nghĩa tiếng Việt (liên quan về mặt ý nghĩa ĐẾN NỘI DUNG).
        *   Kết hợp các từ/cụm từ thể hiện ý định người dùng Việt Nam ('cách', 'hướng dẫn', 'là gì', 'so sánh', 'đánh giá', 'mẹo', 'bí quyết', 'cho người mới bắt đầu', 'nâng cao'...) NẾU PHÙ HỢP VỚI NỘI DUNG.
        *   Thêm yếu tố mới mẻ nếu phù hợp và LIÊN QUAN ĐẾN NỘI DUNG ('${new Date().getFullYear()}', 'mới nhất', 'cập nhật').
        *   Ưu tiên các từ khóa có lượng tìm kiếm ước tính tốt tại thị trường Việt Nam (dựa trên văn phong nội dung).
    5.  ** Loại trừ Tuyệt đối:**
        *   Từ khóa gốc bị lặp lại một cách không cần thiết trong danh sách 15 cuối cùng.
        *   Thuật ngữ thương hiệu của đối thủ cạnh tranh (trừ khi nội dung so sánh trực tiếp).
        *   Bất kỳ từ khóa nào trong danh sách 15 cuối cùng KHÔNG LIÊN QUAN ĐẾN NỘI DUNG đã cho.
    6.  **Nhóm:** Cố gắng nhóm các từ khóa liên quan gần nhau một cách tự nhiên trong danh sách 15 cuối cùng.

    **Đầu ra CHỈ và CHỈ gồm chuỗi 15 từ khóa theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    react development,component architecture,state management,performance optimization,react hooks best practices,redux toolkit configuration,tối ưu react app,từ khóa cũ 1,từ khóa cũ 2,... (Đủ 15 từ)
    ---END---
  `;
  return generateSEOContent(prompt, modelAi);
}

export const aiGenerateOpenGraphTitle = async (content: string, generatedKeywords: string = '', modelAi?: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT tiêu đề Open Graph (og:title) CỰC KỲ THU HÚT, khiến người dùng muốn nhấp vào khi thấy bài viết được chia sẻ trên Facebook, Zalo, Twitter...

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Các từ khóa quan trọng đã được xác định (Ưu tiên sử dụng nếu phù hợp):**
    ${generatedKeywords ? generatedKeywords : "Không có từ khóa ưu tiên."}

    **Yêu cầu TUYỆT ĐỐI (NGHIÊM NGẶT tuân thủ):**
    1.  **Độ dài:** CHÍNH XÁC trong khoảng 68-72 ký tự. Đây là yêu cầu QUAN TRỌNG. Hãy đếm kỹ độ dài của đầu ra cuối cùng.
    2.  **Nội dung (Dựa trên NỘI DUNG và ưu tiên từ khóa):**
        *   Phải chứa Từ khóa chính VÀ Từ khóa phụ quan trọng ĐƯỢC RÚT RA TỪ NỘI DUNG, **ưu tiên các từ phù hợp từ danh sách đã cho.**
        *   Bao gồm 1 emoji LIÊN QUAN TINH TẾ ở đầu hoặc cuối (ưu tiên đầu). Chọn emoji phù hợp với chủ đề NỘI DUNG (🚀, 💡, ⚡, 🎯, ✨, 📈...).
    3.  **Cấu trúc gợi ý (chọn 1 hoặc biến thể tương tự, Áp dụng cho NỘI DUNG và từ khóa):**
        *   "[Emoji] [Từ khóa chính, **ưu tiên từ danh sách**]: [Lợi ích bất ngờ/Con số ấn tượng/Câu hỏi gây tò mò RÚT RA TỪ NỘI DUNG]"
        *   "[Emoji] Bí Quyết [Từ khóa chính, **ưu tiên từ danh sách**]: Làm Chủ [Khía cạnh quan trọng RÚT RA TỪ NỘI DUNG] Năm ${new Date().getFullYear()}"
        *   "[Emoji] [Hành động mạnh]: [Từ khóa chính, **ưu tiên từ danh sách**] Với [Số lượng] Mẹo Từ Chuyên Gia (NẾU CÓ TRONG NỘI DỤNG)"
    4.  **Định dạng:** Viết hoa chữ cái đầu mỗi từ quan trọng (Title Case chuẩn tiếng Việt).
    5.  **Loại trừ Tuyệt đối:** Ngày tháng chi tiết (chỉ giữ năm ${new Date().getFullYear()} nếu cần VÀ PHÙ HỢP VỚI NỘI DUNG), tên tác giả, tên thương hiệu chung chung (trừ khi là chủ đề chính NỘI DUNG).
    6.  **Yếu tố thu hút:** Sử dụng câu hỏi, con số cụ thể (NẾU CÓ TRONG NỘI DUNG), hoặc góc nhìn độc đáo/gây tranh luận nhẹ nhàng để kích thích sự tò mò (DỰA TRÊN NỘI DUNG).

    **Đầu ra CHỈ và CHỈ gồm DUY NHẤT chuỗi tiêu đề Open Graph theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    🚀 Tối Ưu Performance React: 7 Bí Mật Giúp App Chạy Nhanh Hơn ${new Date().getFullYear()}
    ---END---
  `;
  return generateSEOContent(prompt, modelAi);
}

export const aiGenerateOpenGraphDescription = async (content: string, generatedKeywords: string = '', modelAi?: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT mô tả Open Graph (og:description) súc tích, cung cấp giá trị cốt lõi và khuyến khích người dùng khám phá thêm khi thấy trên mạng xã hội.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Các từ khóa quan trọng đã được xác định (Ưu tiên sử dụng nếu phù hợp):**
    ${generatedKeywords ? generatedKeywords : "Không có từ khóa ưu tiên."}


    **Yêu cầu CỤ THỂ (NGHIÊM NGẶT tuân thủ):**
    1.  **Cấu trúc (Dựa trên NỘI DUNG và ưu tiên từ khóa):**
        *   **Dòng "Eyebrow" (Đầu tiên):** "[Danh mục tiếng Việt phù hợp (Suy luận từ NỘI DUNG)] | [Thời gian đọc ước tính (Suy luận từ NỘI DUNG)] phút | [Cấp độ (Suy luận từ NỘI DUNG): Cơ bản/Nâng cao/Chuyên gia]" (Ví dụ: Phát triển Web | 8 phút | Nâng cao)
        *   **Câu Hấp Dẫn (Tiếp theo):** Nêu bật một thống kê gây sốc (NẾU CÓ TRONG NỘI DUNG), một sự thật ít biết (NẾU CÓ), hoặc một lợi ích cốt lõi giải quyết vấn đề người đọc (RÚT RA TỪ NỘI DUNG). **Lồng ghép các từ khóa phụ/đuôi dài từ danh sách đã cho một cách tự nhiên.**
        *   **Nội dung chính:** Tóm tắt 2-3 lợi ích/điểm chính mà người đọc sẽ nhận được (RÚT RA TỪ NỘI DUNG). Có thể thêm 1 sự thật thú vị/đáng ngạc nhiên liên quan (NẾU CÓ). **Tiếp tục lồng ghép các từ khóa phụ/đuôi dài từ danh sách đã cho một cách tự nhiên.**
        *   **Emoji:** Thêm 1-2 emoji liên quan ĐẾN NỘI DUNG, đặt ở vị trí phù hợp để tăng sự chú ý (✨, ✅, 👉, 💡...).
        *   **CTA (Cuối cùng):** Sử dụng lời kêu gọi hành động rõ ràng, phù hợp với mạng xã hội (VD: Khám phá ngay, Đọc ngay!).
    2.  **Độ dài:** Giới hạn CHÍNH XÁC trong khoảng 185-195 ký tự. Đây là yêu cầu QUAN TRỌNG. Hãy đếm kỹ độ dài của đầu ra cuối cùng.
    3.  **Loại trừ Tuyệt đối:** Các cụm từ quá chung chung ("bài viết này nói về..."), thông tin tác giả, quảng cáo lộ liễu. Bất kỳ thông tin nào KHÔNG LIÊN QUAN ĐẾN NỘI DUNG.
    4.  **Ngôn ngữ:** Tự nhiên, dễ hiểu, tạo cảm giác đáng tin cậy và hữu ích (Văn phong tiếng Việt).
    5.  **Xác thực Cuối cùng:** **Đảm bảo đã ưu tiên sử dụng từ khóa từ danh sách được cung cấp nếu phù hợp và lồng ghép tự nhiên.**

    **Đầu ra CHỈ và CHỈ gồm DUY NHẤT chuỗi mô tả Open Graph theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    Lập Trình Frontend | 10 phút | Nâng cao ✨ Hơn 70% ứng dụng React gặp lỗi performance? Khám phá 7 kỹ thuật tối ưu độc quyền ${new Date().getFullYear()} giúp tăng tốc độ tải và trải nghiệm người dùng vượt trội. Đừng bỏ lỡ bí mật từ chuyên gia! 👉 Tìm hiểu ngay!
    ---END---
  `;
  return generateSEOContent(prompt, modelAi);
}

export const aiGenerateTitleBlog = async (content: string, generatedKeywords: string = '', modelAi?: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT tiêu đề bài blog (Title Tag) được tối ưu SEO HOÀN HẢO để vừa thu hút người đọc Việt Nam vừa đạt thứ hạng cao trên Google.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Các từ khóa quan trọng đã được xác định (Ưu tiên sử dụng):**
    ${generatedKeywords ? generatedKeywords : "Không có từ khóa ưu tiên."}

    **Yêu cầu NGHIÊM NGẶT (TUYỆT ĐỐI tuân thủ):**
    1.  **Thành phần (Dựa trên NỘI DUNG và từ khóa ưu tiên):**
        *   Bắt buộc chứa Từ khóa chính ĐƯỢC RÚT RA TỪ NỘI DUNG, **ưu tiên chọn từ khóa phù hợp nhất từ danh sách đã cho.**
        *   Nên chứa Từ khóa phụ quan trọng hoặc yếu tố ngữ nghĩa liên quan ĐẾN NỘI DUNG, **ưu tiên từ danh sách đã cho nếu phù hợp.**
        *   Sử dụng từ ngữ mạnh mẽ, gợi lợi ích hoặc giải quyết vấn đề ĐỀ CẬP TRONG NỘI DUNG (vd: Bí quyết, Giải mã, Tăng tốc, Tránh sai lầm, Hiệu quả...).
    2.  **Định dạng:** Viết hoa chữ cái đầu mỗi từ quan trọng (Title Case chuẩn tiếng Việt).
    3.  **Yếu tố thời gian:** Thêm năm hiện tại (${new Date().getFullYear()}) trong dấu ngoặc đơn "( )" ở cuối hoặc gần cuối tiêu đề.
    4.  **Độ dài:** Tối ưu CHÍNH XÁC trong khoảng 65-75 ký tự. Đây là yêu cầu QUAN TRỌNG. Hãy đếm kỹ độ dài của đầu ra cuối cùng.
    5.  **Góc nhìn độc đáo/Giải quyết vấn đề (Dựa trên NỘI DUNG và từ khóa):** Tập trung vào góc nhìn gây tò mò hoặc giải quyết "nỗi đau" của người đọc Việt Nam như ĐỀ CẬP TRONG NỘI DUNG, **có lồng ghép từ khóa phù hợp từ danh sách.**
    6.  **Bổ nghĩa (Tùy chọn nhưng khuyến khích, NẾU PHÙ HỢP VỚI NỘI DUNG và từ khóa):** Nếu phù hợp, thêm yếu tố làm rõ loại nội dung: "[Hướng dẫn chi tiết]", "[Case study thực tế]", "[Checklist]", "[So sánh]". Đặt trong dấu ngoặc vuông [ ].
    7.  **Loại trừ Tuyệt đối:** Tính từ mơ hồ, các cụm từ câu view rẻ tiền, dấu chấm than quá nhiều. Bất kỳ thông tin nào KHÔNG LIÊN QUAN ĐẾN NỘI DUNG.

    **Đầu ra CHỈ và CHỈ gồm DUY NHẤT chuỗi tiêu đề bài blog theo định dạng yêu cầu. KHÔNG BẤT CỨ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    Tối Ưu Performance React: 7 Sai Lầm Phổ Biến Cần Tránh (${new Date().getFullYear()})
    ---END---
  `;
  return generateSEOContent(prompt, modelAi);
}

export const aiGenerateSummaryContent = async (content: string, generatedKeywords: string = '', modelAi?: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT bản tóm tắt NỔI BẬT, GIẬT TÍT để chia sẻ trên mạng xã hội (Facebook, Twitter, LinkedIn...), thu hút sự chú ý và tương tác của cộng đồng developer/người quan tâm tại Việt Nam.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Các từ khóa quan trọng đã được xác định (Ưu tiên sử dụng nếu phù hợp):**
    ${generatedKeywords ? generatedKeywords : "Không có từ khóa ưu tiên."}

    **Yêu cầu CỤ THỂ (NGHIÊM NGẶT tuân thủ):**
    1.  **Mở đầu (Hook):** Bắt đầu bằng một cụm từ mạnh, gây chú ý tức thời (VD: TIN NÓNG:, CẢNH BÁO:, BẠN CÓ BIẾT?).
    2.  **Nội dung cốt lõi (Dựa trên NỘI DUNG và từ khóa):**
        *   Nêu bật 1-2 thống kê ấn tượng hoặc một tuyên bố gây ngạc nhiên/đi ngược số đông liên quan đến NỘI DUNG (NẾU CÓ TRONG NỘI DUNG). **Lồng ghép từ khóa phù hợp từ danh sách.**
        *   Liệt kê ngắn gọn 2-3 lợi ích/giải pháp chính mà bài viết mang lại (RÚT RA TỪ NỘI DUNG). **Lồng ghép từ khóa phù hợp từ danh sách.**
    3.  **Hashtag:**
        *   Sử dụng CHÍNH XÁC 2 hashtag (bắt đầu bằng #).
        *   1 hashtag rộng về ngành/chủ đề lớn (vd: #LapTrinhWeb).
        *   1 hashtag ngách, cụ thể hơn về NỘI DUNG (vd: #OptimizeReact). Chọn hashtag phổ biến tại Việt Nam và LIÊN QUAN ĐẾN NỘI DUNG. **Nên chọn các hashtag liên quan đến các từ khóa chính/phụ trong danh sách.**
    4.  **Emoji:** Thêm CHÍNH XÁC MỘT cặp emoji phù hợp với chủ đề NỘI DUNG và tone bài viết (🚀🔥, 💡👨‍💻...).
    5.  **Độ dài:** Giới hạn CHÍNH XÁC trong khoảng 240-250 ký tự. Đây là yêu cầu QUAN TRỌNG. Hãy đếm kỹ độ dài của đầu ra cuối cùng.
    6.  **CTA (Kêu gọi hành động):** Kết thúc bằng một lời kêu gọi tương tác tự nhiên (VD: Chia sẻ!, Tag ngay!, Lưu lại!).
    7.  **Loại trừ Tuyệt đối:** KHÔNG chèn link trực tiếp, không đề cập tên tác giả cụ thể (trừ khi là nhân vật chính của NỘI DUNG). Bất kỳ thông tin nào KHÔNG LIÊN QUAN ĐẾN NỘI DUNG.

    **Đầu ra CHỈ và CHỈ gồm DUY NHẤT bản tóm tắt theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    TIN NÓNG: Điểm chuẩn React ${new Date().getFullYear()} chỉ ra 7 kỹ thuật tối ưu giúp giảm tải trang tới 60%! 🚀🔥 Khám phá ngay bí quyết xử lý re-render và lazy loading hiệu quả mà ít ai chia sẻ. #FrontendDev #OptimizeReact Tag ngay một đồng nghiệp Reactjs!
    ---END---
  `;
  return generateSEOContent(prompt, modelAi);
}

export const aiGenerateExcerpt = async (content: string, generatedKeywords: string = '', modelAi?: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT đoạn trích blog (excerpt) NGẮN GỌN, HẤP DẪN, khơi gợi đủ sự tò mò để người đọc nhấp vào xem toàn bộ bài viết từ trang danh sách blog hoặc kết quả tìm kiếm.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    "${content}"

    **Các từ khóa quan trọng đã được xác định (Ưu tiên sử dụng nếu phù hợp):**
    ${generatedKeywords ? generatedKeywords : "Không có từ khóa ưu tiên."}

    **Yêu cầu CỤ THỂ (NGHIÊM NGẶT tuân thủ):**
    1.  **Mở đầu (5-7 từ đầu):** Tạo cảm giác cấp bách, liên quan trực tiếp đến vấn đề hoặc cập nhật mới nhất ĐỀ CẬP TRONG NỘI DUNG. Ví dụ: "Ứng dụng React của bạn chậm?", "Cập nhật ${new Date().getFullYear()}: Tối ưu...", "Đừng mắc phải lỗi này...". **Cố gắng lồng ghép từ khóa chính/phụ từ danh sách.**
    2.  **Nội dung chính (Dựa trên NỘI DUNG và từ khóa):**
        *   Nêu bật 1 thống kê đáng chú ý (NẾU CÓ TRONG NỘI DUNG) hoặc 1-2 "nỗi đau" mà người đọc Việt Nam thường gặp phải liên quan đến chủ đề (RÚT RA TỪ NỘI DUNG). **Lồng ghép các từ khóa phụ/đuôi dài từ danh sách một cách tự nhiên.**
        *   Gợi ý về 2-3 giải pháp/lợi ích chính sẽ được tìm thấy trong bài viết (RÚT RA TỪ NỘI DUNG). **Tiếp tục lồng ghép các từ khóa phụ/đuôi dài từ danh sách một cách tự nhiên.**
    3.  **Yếu tố bổ nghĩa (Nếu có, NẾU PHÙ HỢP VỚI NỘI DUNG):** Có thể thêm yếu tố làm rõ ngữ cảnh trong ngoặc vuông. Ví dụ: "[Cập nhật ${new Date().getFullYear()}]", "[Case Study]", "[Hướng dẫn cho người mới]".
    4.  **Độ dài:** Giới hạn CHÍNH XÁC trong khoảng 125-135 ký tự. Đây là yêu cầu QUAN TRỌNG NHẤT. Hãy đếm kỹ độ dài của đầu ra cuối cùng.
    5.  **Ngôn ngữ:** Sử dụng ngôn ngữ rõ ràng, súc tích, dễ hiểu (tương đương trình độ đọc lớp 9-10), TRÁNH thuật ngữ quá chuyên sâu hoặc văn phong bị động. Tập trung vào lợi ích và giải pháp ĐỀ CẬP TRONG NỘI DUNG, **có sử dụng từ khóa từ danh sách.**
    6.  **Định dạng:** CHỈ trả về DUY NHẤT một đoạn văn bản thuần túy. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.
    7.  **Xác thực Cuối cùng:** **Đảm bảo đã ưu tiên sử dụng từ khóa từ danh sách được cung cấp nếu phù hợp và lồng ghép tự nhiên.**

    **Đầu ra CHỈ và CHỈ gồm DUY NHẤT đoạn trích theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    [Cập nhật ${new Date().getFullYear()}] Ứng dụng React ì ạch? Hơn 70% dev gặp khó khăn tối ưu. Khám phá 7 chiến lược performance đã được kiểm chứng giúp code sạch, tải trang nhanh hơn thấy rõ.
    ---END---
  `;
  return generateSEOContent(prompt, modelAi);
}



export const aiEnhanceContentBlogForSEO = async (content: string, p0: { signal: AbortSignal }, modelAi?: string): Promise<string | null> => {
  const prompt = `
    **NHIỆM VỤ TỐI ƯU SEO:** Chuyển đổi nội dung kỹ thuật/blog sau thành định dạng thân thiện với người đọc và tối ưu SEO trong khi vẫn giữ nguyên độ chính xác kỹ thuật tuyệt đối.

    **NỘI DUNG GỐC (KHÔNG THAY ĐỔI Ý CHÍNH):**
    "${content}"

    **YÊU CẦU NGHIÊM NGẶT:**
    1. **Định dạng đầu ra:**
      - Chỉ trả về nội dung đã tối ưu bằng Markdown
      - Không có bình luận meta hoặc giải thích quá trình
      - Giữ nguyên tất cả khối code, thuật ngữ kỹ thuật và dữ liệu

    2. **Tối ưu SEO kỹ thuật:**
      - Tích hợp từ khóa tự nhiên (mật độ 1-2%) tập trung vào:
        * Thuật ngữ kỹ thuật chính
        * Cụm từ tìm kiếm dài
        * Xu hướng tìm kiếm tại Việt Nam
      - Nhóm từ khóa ngữ nghĩa xung quanh khái niệm cốt lõi
      - Đặt từ khóa LSI trong tiêu đề và đoạn đầu

    3. **Cấu trúc nội dung:**
      - Cấu trúc tiêu đề phân cấp (H1 > H2 > H3)
      - Đoạn văn giới hạn 3-5 dòng để dễ đọc
      - Điểm bullet cho tính năng/lợi ích kỹ thuật
      - Danh sách đánh số cho quy trình/bước
      - In đậm (**) cho thuật ngữ quan trọng khi xuất hiện lần đầu

    4. **Bảo toàn nội dung kỹ thuật:**
      - Giữ nguyên khối code
      - Tham chiếu API giữ nguyên bản gốc
      - Giữ nguyên số phiên bản
      - Thông báo lỗi/giữ nguyên định dạng gốc

    5. **Placeholder ảnh (Chèn 1 ảnh mỗi 300 từ):**
      Định dạng: ![ALT_TEXT](AI_PROMPT)
      - ALT_TEXT: Mô tả bao gồm:
        * Thành phần chính
        * Mối quan hệ với nội dung
        * Từ khóa SEO
      - AI_PROMPT (Tiếng Anh): Phải bao gồm:
        * Phong cách: "Minh họa nội dung" hoặc "Ảnh chụp UI sạch" hoặc "Phong cách hoạt hình disney/pixel"
        * Thành phần: Các thành phần cụ thể cần mô tả
        * Ngữ cảnh: "Dành cho blog về [chủ đề]"
        * Ví dụ: "Minh họa 3D isometric kiến trúc đám mây với microservices, phong cách blog kỹ thuật, đường nét sạch với điểm nhấn gradient"

    6. **Khả năng đọc kỹ thuật:**
      - Đơn giản hóa khái niệm phức tạp nhưng không làm mất đi tính kỹ thuật
      - Thêm phép loại suy cho chủ đề khó
      - Chia nhỏ đoạn văn lớn thành các phần dễ hiểu
      - Duy trì độ sâu kỹ thuật nhất quán

    7. **Tối ưu hóa tiếng Việt:**
      - Sử dụng thuật ngữ kỹ thuật tự nhiên (không dịch word-by-word)
      - Tối ưu cho xu hướng tìm kiếm địa phương
      - Bao gồm các lỗi chính tả/biến thể phổ biến
      - Duy trì văn phong blog kỹ thuật chuyên nghiệp

    8. **Kiểm soát chất lượng:**
      - Không nhồi nhét từ khóa
      - Không thay đổi sự thật
      - Không thêm nội dung không có trong bản gốc
      - Giữ nguyên ví dụ/case study gốc

    **QUY TẮC ĐỊNH DẠNG ĐẦU RA:**
    - Dòng đầu tiên phải là tiêu đề H1
    - Dòng cuối cùng phải là nội dung (không có chữ ký)
    - Chỉ sử dụng cú pháp Markdown tiêu chuẩn
    - Giữ nguyên encoding UTF-8
    - Giữ nguyên ngắt dòng

    **HÀNH ĐỘNG CẤM:**
    - Thay đổi thông số kỹ thuật
    - Thêm tuyên bố chưa xác minh
    - Sửa đổi ví dụ code
    - Thay đổi phiên bản phụ thuộc
  `;
  return generateSEOContent(prompt, modelAi);
}
export const aiGenerateFactAndknowledge = async (title: string, modelAi?: string): Promise<string | null> => {
  const prompt = `
    **Mục tiêu:** Tạo MỘT thông tin thú vị hoặc kiến thức chuyên sâu ngắn gọn, liên quan trực tiếp đến chủ đề AI của bài blog dựa trên tiêu đề đã cho. Mục đích là cung cấp một điểm nhấn đáng chú ý, có thể dùng làm "Did You Know?" hoặc một fact nhanh.

    **Nội dung cần phân tích (Dựa TRỰC TIẾP vào đây):**
    Tiêu đề bài blog: "${title}"
    **Yêu cầu NGHIÊM NGẶT (TUYỆT ĐỐI tuân thủ):**
    1.  **Đầu ra:** CHỈ và CHỈ gồm MỘT chuỗi văn bản DUY NHẤT là thông tin/kiến thức đó. KHÔNG THÊM bất kỳ lời giải thích, lời mở đầu hay kết thúc nào về quá trình tạo. CHỈ TRẢ VỀ THÔNG TIN.
    2.  **Nội dung:**
        *   Phải liên quan MỘT CÁCH CHẶT CHẼ đến chủ đề AI được thể hiện trong tiêu đề.
        *   Có thể là một sự thật ít biết, một thống kê ấn tượng (nếu có thể suy luận hợp lý từ chủ đề), một khái niệm cốt lõi được giải thích cực kỳ ngắn gọn, hoặc một ứng dụng nổi bật của AI trong lĩnh vực đó.
        *   Sử dụng ngôn ngữ tiếng Việt tự nhiên, dễ hiểu, hấp dẫn.
        *   Nên cung cấp một giá trị nhỏ hoặc gây tò mò liên quan đến chủ đề chính.
    3.  **Độ dài:** Cực kỳ ngắn gọn, lý tưởng là 1-2 câu. KHÔNG VƯỢT QUÁ 150 ký tự. Hãy đếm ký tự của đầu ra cuối cùng để đảm bảo.
    4.  **Định dạng:** Văn bản thuần túy. KHÔNG Markdown (headings, bold, lists, code blocks), KHÔNG emoji, KHÔNG dấu ngoặc kép quanh câu trả lời.
    5.  **Đảm bảo:** Thông tin cung cấp phải có vẻ chính xác và đáng tin cậy dựa trên kiến thức chung về AI và chủ đề tiêu đề.
    6.  **Không bắt đầu bằng "Bạn có biết" Or "Did you know":** Trong Template đã có sẵn "Bạn có biết" Chỉ output ra nội dung.
    **Đầu ra CHỈ và CHỈ gồm DUY NHẤT chuỗi thông tin/kiến thức theo định dạng yêu cầu. KHÔNG BẤT KỲ THÔNG TIN NÀO KHÁC.**

    **Ví dụ Định dạng Đầu ra Mong muốn (CHỈ trả về phần này):**
    Một mô hình ngôn ngữ lớn như GPT-4 có thể có tới 1.7 nghìn tỷ tham số, cho phép nó hiểu và tạo ra văn bản phức tạp đáng kinh ngạc.
    **Ví dụ Định dạng Đầu ra Không Mong muốn (Không trả về phần này):**
    Bạn Có biết: Một mô hình ngôn ngữ lớn như GPT-4 có thể có tới 1.7 nghìn tỷ tham số, cho phép nó hiểu và tạo ra văn bản phức tạp đáng kinh ngạc.
    ---END---
  `;
  return generateSEOContent(prompt, modelAi);
}

// export const aiGeneratePromptForImage = async (content: string, modelAi?: string) => {
//   const prompt = `Tạo bản mô tả hình ảnh thumbnail (tỷ lệ 16:9) minh họa nội dung: "${content}".  
//     **ĐẶC ĐIỂM THUMBNAIL**:  
//     - Thiết kế tập trung vào 1 điểm nhấn duy nhất  
//     - Bố cục đơn giản nhưng ấn tượng  
//     - Màu sắc tương phản cao để nổi bật khi thu nhỏ  
//     - Chi tiết vừa đủ nhìn rõ ở kích thước nhỏ  

//     **PHONG CÁCH (chọn 1)**:  
//     [1] Flat Design  
//     [2] Minimalist 3D  
//     [3] Bold Illustration  

//     **YÊU CẦU**:  
//     - Mô tả ngắn gọn (3-5 câu) bằng tiếng Việt  
//     - Bao gồm:  
//        • Đối tượng chính (chiếm 60-70% không gian)  
//        • Màu chủ đạo và accent màu  
//        • Yếu tố hỗ trợ (nếu có)  
//     - KHÔNG đề cập đến phong cách đã chọn  
//     - KHÔNG sử dụng markdown hay định dạng  
//     - KHÔNG thêm tiêu đề phụ  

//     **VÍ DỤ**:  
//     "Một chiếc microphone màu vàng neon nổi bật trên nền tím đậm, cách điệu với các sóng âm thanh dạng hình tròn đồng tâm màu trắng. Góc phải có icon tai nghe nhỏ cùng tông màu. Toàn bộ thiết kế sử dụng hình khối hình học đơn giản với đường viền đen mảnh."`;

//   return generateSEOContent(prompt, modelAi);
// };

export const aiGeneratePromptForImage = async (content: string, modelAi?: string) => {
  const prompt = `Bạn là một chuyên gia tạo mô tả hình ảnh thumbnail (tỷ lệ 16:9) chất lượng cao dựa trên nội dung cho trước. Nhiệm vụ của bạn là tạo ra một bản mô tả ngắn gọn, chính xác và tuân thủ nghiêm ngặt các yêu cầu dưới đây để công cụ tạo hình ảnh AI có thể hiểu và tạo ra thumbnail hiệu quả.

    NỘI DUNG CẦN MINH HỌA: "${content}"

    HƯỚNG DẪN CHI TIẾT VÀ YÊU CẦU NGHIÊM NGẶT:
    1.  **Định dạng & Độ dài:** Kết quả CHỈ là một đoạn văn mô tả duy nhất, gồm CHÍNH XÁC TỪ 3 ĐẾN 5 CÂU. KHÔNG có tiêu đề, dấu đầu dòng, hoặc bất kỳ ký tự định dạng nào (**, *, -, #, v.v.).
    2.  **Thông số Hình ảnh (Bắt buộc):**
        *   **Tỷ lệ khung hình:** 16:9
        *   **Độ phân giải:** 1920x1080px 
        *   **Độ rõ nét:** Ultra HD, chi tiết sắc nét
        *   **Độ sâu trường ảnh:** Nông (shallow depth of field)
        *   **Tập trung:** CHỈ tập trung vào MỘT điểm nhấn/đối tượng chính DUY NHẤT
        *   **Bố cục:** Đối tượng chính chiếm 60-70% không gian, căn giữa hoặc theo quy tắc 1/3
    3.  **Nội dung Mô tả:**
        *   Mô tả chi tiết đối tượng chính với phong cách hoạt hình hoặc đồ họa vector
        *   Nêu rõ màu sắc chủ đạo (2-3 màu) và màu accent tương phản (1-2 màu)
        *   Mô tả hiệu ứng đặc biệt: bóng đổ, viền nét, gradient, ánh sáng
        *   Nền đơn giản, có thể là gradient hoặc pattern tối giản
    4.  **Phong cách (Áp dụng ngầm định):** Hình dung theo MỘT trong các phong cách sau nhưng KHÔNG đề cập tên phong cách:
        *   [1] Hoạt hình 2D (đường nét mềm mại, màu sắc tươi sáng, hiệu ứng bóng đổ nhẹ)
        *   [2] Đồ họa vector (hình khối rõ ràng, màu phẳng, viền đen đậm)
        *   [3] Phong cách anime (đôi mắt to, biểu cảm phóng đại, highlights rõ)
        *   [4] Low-poly 3D (các mặt hình học, màu sắc block)
    5.  **Ngôn ngữ:** Tiếng Việt
    6.  **Hạn chế:** KHÔNG đề cập phong cách cụ thể. KHÔNG dùng ký tự định dạng. KHÔNG thêm lời dẫn.

    VÍ DỤ:
    "Nhân vật robot màu xanh dương neon với viền đen đậm, đang cầm bóng đèn vàng phát sáng. Nền gradient từ tím đậm sang xanh đen với các hạt ánh sáng lấp lánh. Hiệu ứng ánh sáng phát ra từ bóng đèn tạo vệt sáng mờ. Thiết kế dạng vector với các góc bo tròn và bóng đổ nhẹ."

    Bây giờ, hãy tạo mô tả hình ảnh thumbnail theo yêu cầu trên. Bắt đầu ngay với mô tả.`;

  return generateSEOContent(prompt, modelAi);
};

export async function aiAnalyzeBlogContent(title: string, content: string): Promise<{ tags: string[]; topic: string; priority: string }> {
  const prompt = `Bạn là AI chuyên phân tích nội dung blog. Hãy phân tích bài viết sau (có tiêu đề và nội dung) và trả về kết quả dưới dạng JSON với các trường:
- tags: mảng các tag liên quan (ví dụ: ["AI", "Tech", "Social Good"])
- topic: chủ đề chính (ví dụ: "AI", "Tech", "Other")
- priority: mức độ ưu tiên đăng ("high", "medium", "low") dựa trên độ hấp dẫn, mới mẻ, liên quan đến AI/Tech.
Chỉ trả về JSON, không giải thích. Dữ liệu:
Tiêu đề: "${title}"
Nội dung: "${content.slice(0, 2000)}"
`;
  const raw = await generateSEOContent(prompt);
  try {
    const json = JSON.parse(raw || '{}');
    return {
      tags: Array.isArray(json.tags) ? json.tags : [],
      topic: typeof json.topic === 'string' ? json.topic : '',
      priority: typeof json.priority === 'string' ? json.priority : '',
    };
  } catch {
    return { tags: [], topic: '', priority: '' };
  }
}

export const aiGenerateHTMLToMarkdown = async (content: string, modelAi?: string, baseUrl?: string) => {
  const prompt = `
    HÃY CHUYỂN ĐỔI HTML SANG MARKDOWN VỚI ĐỘ CHÍNH XÁC CAO (KÈM VÍ DỤ CỤ THỂ)

    ### 1. PHÂN TÍCH & LỌC NỘI DUNG BLOG:
    - TÌM VÀ CHỈ GIỮ LẠI PHẦN NỘI DUNG CHÍNH:
      * Ví dụ: 
        - Giữ: <div class="post-content">...</div>
        - Loại bỏ: <div class="sidebar">...</div>, <footer>...</footer>

    ### 2. QUY TẮC CHUYỂN ĐỔI CHI TIẾT (KÈM VÍ DỤ):
    
    [A] TIÊU ĐỀ:
    • <h1>Tiêu đề</h1> → # Tiêu đề
    • <h2>Phụ đề</h2> → ## Phụ đề
    • <h3 class="sub">Nhỏ</h3> → ### Nhỏ

    [B] ĐOẠN VĂN:
    • <p>Đoạn văn bản.</p> → Đoạn văn bản.\n\n
    • <p align="center">Căn giữa</p> → <!-- CENTER -->\nCăn giữa\n<!-- /CENTER -->

    [C] ẢNH (XỬ LÝ URL TỪNG LOẠI):
    • Case 1: Link tuyệt đối
      <img src="https://example.com/img.jpg" alt="Mô tả"> 
      → ![Mô tả](https://example.com/img.jpg)
    
    • Case 2: Link tương đối (có baseUrl)
      <img src="/uploads/img.png" alt="Demo"> 
      → ![Demo](${baseUrl ? `${baseUrl}/uploads/img.png` : 'ERROR_MISSING_BASE_URL'})

    • Case 3: Link protocol-relative
      <img src="//cdn.domain.com/1.jpg"> 
      → ![](https://cdn.domain.com/1.jpg)

    [D] LIÊN KẾT:
    • <a href="/blog" title="Blog">Đi tới Blog</a> 
      → [Đi tới Blog](${baseUrl ? `${baseUrl}/blog` : '/blog'})
    
    • <a class="external" href="https://external.com">Liên kết</a> 
      → [Liên kết](https://external.com){:target="_blank"}

    [E] ĐỊNH DẠNG VĂN BẢN:
    • <strong>Quan trọng</strong> → **Quan trọng**
    • <em>Nghiêng</em> → *Nghiêng*
    • <u>Gạch chân</u> → <u>Gạch chân</u>

    [F] DANH SÁCH:
    • <ul><li>Mục 1</li><li>Mục 2</li></ul> 
      → - Mục 1\n- Mục 2
    
    • <ol start="3"><li>Thứ 3</li></ol> 
      → 3. Thứ 3

    [G] BẢNG:
    <table>
      <tr><th>Tiêu đề</th></tr>
      <tr><td>Nội dung</td></tr>
    </table>
    → 
    | Tiêu đề |
    |---------|
    | Nội dung |

    [H] CODE:
    • <code>console.log()</code> → \`console.log()\`
    • <pre><code class="language-js">...</code></pre> 
      → \`\`\`js\n...\n\`\`\`

    ### 3. KIỂM TRA SAU CHUYỂN ĐỔI:
    - ĐẢM BẢO KHÔNG CÓ:
      * Thẻ HTML sót lại (ví dụ: <span>, <div>)
      * Link ảnh bị hỏng (kiểm tra các trường hợp)
      * Mất nội dung quan trọng

    ### 4. VÍ DỤ ĐẦU VÀO/ĐẦU RA:
    [INPUT]:
    <article>
      <h1>Cách sử dụng React</h1>
      <div class="ads">...</div>
      <p>React là thư viện JavaScript phổ biến.</p>
      <img src="/static/react-logo.png" alt="React Logo">
    </article>

    [OUTPUT]:
    # Cách sử dụng React
    
    React là thư viện JavaScript phổ biến.
    
    ![React Logo](${baseUrl ? `${baseUrl}/static/react-logo.png` : '/static/react-logo.png'})

    ### 5. NỘI DUNG CẦN XỬ LÝ:
    ${content}

    [YÊU CẦU CUỐI]:
    - CHỈ trả về markdown đã được xử lý
    - KHÔNG thêm bất kỳ giải thích nào
  `;


  try {
    const raw = await generateSEOContent(prompt, modelAi);
    if (!raw) {
      return {
        markdownContent: '',
        success: false,
        language: 'vi'
      };
    }
    const cleanMarkdown = raw
      .replace(/<!--[\s\S]*?-->/g, '') 
      .replace(/<[^>]*>?/gm, '') 
      .replace(/^[ \t]*\n+/gm, '\n') 
      .trim();
    return {
      markdownContent: cleanMarkdown,
      success: true,
      language: 'vi'
    };
  } catch {
    return {
      markdownContent: '',
      success: false,
      language: 'vi'
    };
  }
}