import Cerebras from '@cerebras/cerebras_cloud_sdk';

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

const CEREBRAS_MODEL = 'qwen-3-235b-a22b-instruct-2507';

const SYSTEM_ROLE_SEO = `Bạn là chuyên gia SEO và Content Marketing hàng đầu tại Việt Nam. Chuyên môn của bạn bao gồm:
- Google SEO (E-E-A-T, Core Web Vitals, Semantic Search)
- Viết nội dung tối ưu CTR và dwell time
- Nghiên cứu từ khóa và phân tích search intent
- Copywriting tiếng Việt chuẩn chính tả, hấp dẫn và thuyết phục

NGUYÊN TẮC BẮT BUỘC:
- CHỈ trả về kết quả theo định dạng yêu cầu, KHÔNG thêm lời giải thích, tiêu đề hay metadata
- Đảm bảo ngôn ngữ tự nhiên, không cứng nhắc hay máy móc
- Từ ngữ tiếng Việt chuẩn xác, không dịch từng từ từ tiếng Anh`;

interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  systemRole?: string;
}

const generateSEOContent = async (
  prompt: string,
  modelAi: string = CEREBRAS_MODEL,
  options: GenerateOptions = {}
): Promise<string | null> => {
  const {
    temperature = 0.7,
    maxTokens = 16384,
    systemRole = SYSTEM_ROLE_SEO,
  } = options;

  try {
    console.log(`--- [Cerebras] Sending prompt | model: ${modelAi} | temp: ${temperature} ---`);

    const messages: { role: 'system' | 'user'; content: string }[] = [
      { role: 'system', content: systemRole },
      { role: 'user', content: prompt },
    ];

    const response = await client.chat.completions.create({
      messages,
      model: modelAi,
      temperature,
      max_tokens: maxTokens,
    } as any) as any;

    const rawText: string | null | undefined = response.choices?.[0]?.message?.content;

    if (!rawText) {
      console.error('[Cerebras] Empty response received.');
      return null;
    }

    console.log('[Cerebras] Response received successfully.');

    // Strip markdown code fences if present
    let cleaned = rawText.trim();
    const fencePattern = /^```(?:markdown|json|text|html)?\s*\n?([\s\S]*?)\n?```$/;
    const match = cleaned.match(fencePattern);
    if (match) {
      cleaned = match[1]!.trim();
    }

    // Remove any leading/trailing ``` without language specifier
    cleaned = cleaned.replace(/^```\s*/m, '').replace(/\s*```$/m, '').trim();

    return cleaned;
  } catch (error: any) {
    console.error('[Cerebras] Generation error:', error?.message || error);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// META DESCRIPTION
// ─────────────────────────────────────────────────────────────────────────────
export const aiGenerateMetaDescription = async (
  content: string,
  generatedKeywords: string = '',
  modelAi?: string
): Promise<string | null> => {
  const year = new Date().getFullYear();
  const prompt = `
Phân tích nội dung sau và tạo MỘT meta description tối ưu cho Google Search:

<content>
${content}
</content>

${generatedKeywords ? `<keywords>${generatedKeywords}</keywords>` : ''}

YÊU CẦU KỸ THUẬT:
- Độ dài: 145–160 ký tự (đếm chính xác trước khi trả lời)
- Cấu trúc: [Từ khóa chính + lợi ích cụ thể] + [giải pháp/phương pháp] + [CTA ngắn gọn]
- Từ khóa chính phải xuất hiện trong 10 từ đầu tiên
- Bao gồm năm ${year} nếu nội dung có tính thời sự
- Dùng động từ kích thích hành động: Khám phá, Làm chủ, Tối ưu, Giải mã, Bứt phá
- CTA cuối: Tìm hiểu ngay / Đọc ngay / Xem chi tiết / Thử ngay

ĐÁNH GIÁ TRƯỚC KHI XUẤT:
✓ Đúng 145–160 ký tự
✓ Có từ khóa chính ở đầu
✓ Có CTA ở cuối
✓ Không có dấu nháy kép bọc ngoài

OUTPUT: Chỉ chuỗi meta description thuần túy, không giải thích.
`;
  return generateSEOContent(prompt, modelAi, { temperature: 0.6, maxTokens: 512 });
};

// ─────────────────────────────────────────────────────────────────────────────
// SEO KEYWORDS
// ─────────────────────────────────────────────────────────────────────────────
export const aiGenerateSEOKeywords = async (
  content: string,
  existingKeywords: string[] = [],
  modelAi?: string
): Promise<string | null> => {
  const year = new Date().getFullYear();
  const existingStr = existingKeywords.length > 0
    ? existingKeywords.slice(0, 50).join(', ')
    : 'Chua co';

  const prompt = `
Ban la chuyen gia SEO Viet Nam. Phan tich noi dung va tao DUNG 15 tags/tu khoa toi uu cho bai blog.

<content>
${content}
</content>

<existing_tags>
${existingStr}
</existing_tags>

NHIEM VU: Tao 15 tags voi phan bo:
- 3 head terms (1-2 tu, volume cao)
- 7 mid-tail keywords (2-4 tu, search intent ro rang)
- 5 long-tail keywords (4-7 tu, specific)

QUY TAC:
- Uu tien tai su dung tags tu <existing_tags> neu phu hop
- Tags viet thuong, khong dau cham cau thua
- Them yeu to "${year}" hoac "moi nhat" vao 1-2 tags long-tail neu phu hop
- Moi tag phai lien quan truc tiep den noi dung

OUTPUT FORMAT - chi tra ve JSON array, khong them bat ky text nao:
[{"tag":"ten tag","isExisting":true},{"tag":"tag moi","isExisting":false}]

Voi "isExisting":true neu tag co trong <existing_tags>, false neu la tag moi.
`;
  return generateSEOContent(prompt, modelAi, { temperature: 0.45, maxTokens: 1024 });
};


// ─────────────────────────────────────────────────────────────────────────────
// OPEN GRAPH TITLE
// ─────────────────────────────────────────────────────────────────────────────
export const aiGenerateOpenGraphTitle = async (
  content: string,
  generatedKeywords: string = '',
  modelAi?: string
): Promise<string | null> => {
  const year = new Date().getFullYear();
  const prompt = `
Tạo MỘT og:title cực kỳ thu hút cho bài viết sau khi chia sẻ trên mạng xã hội:

<content>
${content.slice(0, 1500)}
</content>

${generatedKeywords ? `<keywords>${generatedKeywords}</keywords>` : ''}

YÊU CẦU:
- Độ dài: 60–70 ký tự (đếm chính xác)
- Bắt đầu bằng 1 emoji phù hợp chủ đề (🚀 💡 ⚡ 🎯 ✨ 🔥 📈 🧠 🛠️)
- Title Case tiếng Việt (viết hoa chữ đầu từ quan trọng)
- Chứa từ khóa chính + yếu tố gây tò mò (con số, câu hỏi, hoặc lợi ích cụ thể)
- Năm ${year} nếu nội dung có tính thời sự

MẪU THAM KHẢO:
🚀 Tối Ưu React ${year}: 7 Kỹ Thuật Giúp App Nhanh Gấp 3 Lần

OUTPUT: Chỉ chuỗi og:title. Không dấu nháy. Không giải thích.
`;
  return generateSEOContent(prompt, modelAi, { temperature: 0.75, maxTokens: 256 });
};

// ─────────────────────────────────────────────────────────────────────────────
// OPEN GRAPH DESCRIPTION
// ─────────────────────────────────────────────────────────────────────────────
export const aiGenerateOpenGraphDescription = async (
  content: string,
  generatedKeywords: string = '',
  modelAi?: string
): Promise<string | null> => {
  const year = new Date().getFullYear();
  const prompt = `
Tạo MỘT og:description hấp dẫn cho chia sẻ mạng xã hội (Facebook, Zalo, LinkedIn):

<content>
${content.slice(0, 2000)}
</content>

${generatedKeywords ? `<keywords>${generatedKeywords}</keywords>` : ''}

YÊU CẦU:
- Độ dài: 180–200 ký tự (đếm chính xác)
- Cấu trúc: [Danh mục | Thời gian đọc | Cấp độ] + [Hook gây chú ý] + [2 lợi ích chính] + [CTA]
- 1–2 emoji ở vị trí chiến lược để tăng tương tác
- Ngôn ngữ tự nhiên, thuyết phục, không mang tính quảng cáo lộ liễu
- Tham chiếu năm ${year} nếu phù hợp

MẪU:
AI & Công Nghệ | 8 phút | Trung cấp ⚡ 80% lập trình viên bỏ lỡ những cải tiến này! Khám phá ${year} bí quyết tối ưu hiệu suất và giảm lỗi runtime xuống 40%. Đọc ngay! 🎯

OUTPUT: Chỉ chuỗi og:description. Không dấu nháy. Không giải thích.
`;
  return generateSEOContent(prompt, modelAi, { temperature: 0.75, maxTokens: 512 });
};

// ─────────────────────────────────────────────────────────────────────────────
// BLOG TITLE (TITLE TAG)
// ─────────────────────────────────────────────────────────────────────────────
export const aiGenerateTitleBlog = async (
  content: string,
  generatedKeywords: string = '',
  modelAi?: string
): Promise<string | null> => {
  const year = new Date().getFullYear();
  const prompt = `
Tạo MỘT title tag SEO tối ưu cho bài blog này:

<content>
${content.slice(0, 2000)}
</content>

${generatedKeywords ? `<keywords>${generatedKeywords}</keywords>` : ''}

YÊU CẦU:
- Độ dài: 55–65 ký tự (đếm chính xác)
- Từ khóa chính ở đầu (trong 5 từ đầu tiên)
- Title Case tiếng Việt chuẩn
- Kết thúc bằng "(${year})" hoặc "[${year}]"
- Bổ nghĩa dạng: [Hướng dẫn], [Case Study], [So sánh], [Checklist] nếu phù hợp
- Tránh từ ngữ clickbait, giật tít rẻ tiền

MẪU:
Tối Ưu Performance React: 7 Kỹ Thuật Chuyên Gia (${year})

OUTPUT: Chỉ chuỗi title. Không dấu nháy. Không giải thích.
`;
  return generateSEOContent(prompt, modelAi, { temperature: 0.6, maxTokens: 256 });
};

// ─────────────────────────────────────────────────────────────────────────────
// EXCERPT
// ─────────────────────────────────────────────────────────────────────────────
export const aiGenerateExcerpt = async (
  content: string,
  generatedKeywords: string = '',
  modelAi?: string
): Promise<string | null> => {
  const year = new Date().getFullYear();
  const prompt = `
Tạo MỘT đoạn trích (excerpt) cho bài blog để hiển thị trên trang danh sách:

<content>
${content.slice(0, 2000)}
</content>

${generatedKeywords ? `<keywords>${generatedKeywords}</keywords>` : ''}

YÊU CẦU:
- Độ dài: 120–140 ký tự (đếm chính xác)
- Câu đầu: gợi vấn đề hoặc "nỗi đau" của người đọc (không dùng "Bài viết này")
- Nêu 1–2 giải pháp/lợi ích cụ thể được đề cập trong bài
- Kết thúc mở, gợi tò mò để người đọc muốn đọc tiếp
- Tham chiếu "[${year}]" ở đầu nếu nội dung có tính thời sự

MẪU:
[${year}] React app của bạn load chậm? Khám phá 7 kỹ thuật tối ưu bundle size và lazy loading đã được kiểm chứng, giảm 60% thời gian tải.

OUTPUT: Chỉ chuỗi excerpt. Không dấu nháy. Không giải thích.
`;
  return generateSEOContent(prompt, modelAi, { temperature: 0.7, maxTokens: 256 });
};

// ─────────────────────────────────────────────────────────────────────────────
// ENHANCE CONTENT FOR SEO
// ─────────────────────────────────────────────────────────────────────────────
export const aiEnhanceContentBlogForSEO = async (
  content: string,
  p0: { signal: AbortSignal },
  modelAi?: string
): Promise<string | null> => {
  const year = new Date().getFullYear();
  const prompt = `
Bạn là một biên tập viên nội dung chuyên tối ưu SEO cho blog công nghệ Việt Nam. Hãy cải thiện bài viết sau theo tiêu chuẩn Google E-E-A-T và dễ đọc trên mobile:

<original_content>
${content}
</original_content>

NHIỆM VỤ (thực hiện TẤT CẢ, theo thứ tự):

1. CHUẨN HÓA CẤU TRÚC:
   - H1 duy nhất ở đầu bài, chứa từ khóa chính
   - H2 mỗi 300–500 từ, H3 cho điểm phụ
   - Đoạn văn tối đa 4 dòng, ngắt rõ ràng

2. TỐI ƯU READABILITY:
   - In đậm (**term**) thuật ngữ quan trọng khi xuất hiện lần đầu
   - Dùng bullet list / numbered list cho các bước hoặc liệt kê ≥3 mục
   - Viết câu chủ động, tránh bị động và danh từ hóa

3. TỐI ƯU SEO:
   - Thêm từ khóa LSI tự nhiên trong đoạn đầu và tiêu đề H2
   - Tích hợp internal linking placeholder: [xem thêm về X](#)
   - Thêm structured data hints trong comment: <!-- FAQ: câu hỏi -->

4. CHÈN PLACEHOLDER ẢNH (mỗi 350–400 từ):
   Định dạng CHÍNH XÁC: ![Mô tả SEO của ảnh](PROMPT_TIẾNG_ANH_để_generate_ảnh)
   - Mô tả SEO: tiếng Việt, chứa từ khóa, mô tả nội dung ảnh
   - Prompt ảnh: tiếng Anh, cụ thể phong cách (isometric 3D / flat vector / tech diagram)

5. CẬP NHẬT TẦM QUAN TRỌNG:
   - Thêm "(${year})" vào tiêu đề nếu nội dung có tính thời sự
   - Cập nhật số liệu dạng "[cần cập nhật: X%]" nếu có số liệu cũ

KHÔNG ĐƯỢC:
- Thay đổi ý nghĩa hoặc thông tin kỹ thuật gốc
- Thêm nội dung không có trong bản gốc
- Thêm chữ ký, lời kết của AI
- Wrap kết quả trong markdown code fence

OUTPUT: Chỉ nội dung Markdown đã tối ưu, bắt đầu bằng # H1.
`;
  return generateSEOContent(prompt, modelAi, {
    temperature: 0.4,
    maxTokens: 16384,
    systemRole: `Bạn là biên tập viên SEO chuyên nghiệp. Luôn trả về Markdown thuần túy, bắt đầu bằng tiêu đề H1. Không bao giờ thêm lời giải thích hay wrap trong code fence.`,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// FACT & KNOWLEDGE
// ─────────────────────────────────────────────────────────────────────────────
export const aiGenerateFactAndknowledge = async (
  title: string,
  modelAi?: string
): Promise<string | null> => {
  const prompt = `
Dựa vào tiêu đề bài blog: "${title}"

Tạo MỘT sự thật thú vị hoặc số liệu ấn tượng liên quan đến chủ đề AI trong bài.

YÊU CẦU:
- 1–2 câu, KHÔNG vượt quá 130 ký tự
- Văn bản thuần túy, không emoji, không markdown
- KHÔNG bắt đầu bằng "Bạn có biết", "Did you know", hay "Sự thật là"
- Phải có tính thực tế cao, dựa trên kiến thức phổ biến về AI
- Ngôn ngữ tự nhiên, không cứng nhắc

VÍ DỤ TỐT:
GPT-4 được huấn luyện trên hơn 1 nghìn tỷ token văn bản, tương đương đọc toàn bộ Wikipedia hàng triệu lần.

OUTPUT: Chỉ chuỗi fact. Không dấu nháy. Không tiêu đề.
`;
  return generateSEOContent(prompt, modelAi, { temperature: 0.8, maxTokens: 256 });
};

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE PROMPT GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
export const aiGeneratePromptForImage = async (content: string, modelAi?: string) => {
  const prompt = `
Phân tích nội dung sau và tạo mô tả hình ảnh thumbnail (16:9) cho blog:

<content>
${content.slice(0, 1000)}
</content>

YÊU CẦU MÔ TẢ HÌNH ẢNH:
- ĐÚNG 3–4 câu văn xuôi tiếng Việt, không có ký tự định dạng
- Câu 1: Nhân vật hoặc đối tượng chính (phong cách flat design / vector hoặc 3D isometric)
- Câu 2: Bảng màu chủ đạo (2–3 màu) + màu nhấn tương phản, nền gradient đơn giản
- Câu 3: Hiệu ứng ánh sáng / bóng đổ / chi tiết phụ tăng chiều sâu
- Câu 4 (tùy chọn): Yếu tố typography nếu phù hợp (icon, số liệu, badge)

KHÔNG được:
- Đề cập tên phong cách nghệ thuật cụ thể (anime, disney, pixel art...)
- Dùng markdown hoặc dấu đầu dòng
- Thêm lời mở đầu hay kết luận

VÍ DỤ:
Nhân vật robot nhỏ màu xanh sapphire với đôi mắt phát sáng màu vàng cam, tư thế tự tin đứng cạnh màn hình máy tính. Nền gradient từ xanh navy đến tím than, điểm thêm các hạt ánh sáng trắng lấp lánh nhỏ. Hiệu ứng phát sáng từ màn hình tạo vùng highlight nhẹ lên nhân vật, bóng đổ mềm dưới chân.

OUTPUT: Chỉ đoạn mô tả 3–4 câu. Bắt đầu ngay, không có lời dẫn.
`;
  return generateSEOContent(prompt, modelAi, { temperature: 0.85, maxTokens: 512 });
};
