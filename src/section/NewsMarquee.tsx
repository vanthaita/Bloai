import React from 'react'
import Marquee from 'react-fast-marquee'

const NewsMarquee = () => {
    return (
        <div className="w-full">
            <Marquee
                className='h-20 border-b-2 border-black block w-full'
                autoFill={true}
            >
               <div>
                <span className="font-medium text-2xl">🚨 TIN NÓNG: </span>
                    <span className="font-medium text-2xl mx-8 text-red-600">AGI đạt được trong phòng thí nghiệm bí mật • </span>
                    <span className="font-medium text-2xl mx-8">🤖 Rò rỉ GPT-6 cho thấy các tính năng tự nhận thức • </span>
                    <span className="font-medium text-2xl mx-8">⚠️ Neuralink của Elon Musk nhân bản ý thức con người • </span>
                    <span className="font-medium text-2xl mx-8">🌐 Trung Quốc cấm lập trình viên con người vào năm 2030 • </span>
                    <span className="font-medium text-2xl mx-8">💥 DeepMind giải quyết biến đổi khí hậu bằng nanobots • </span>
                    <span className="font-medium text-2xl mx-8">🔮 AI dự đoán Bitcoin sụp đổ về 0 đô la vào thứ Sáu • </span>
                    <span className="font-medium text-2xl mx-8">⚡ MIT tạo ra AI đọc được giấc mơ (FDA chấp thuận) • </span>
                    <span className="font-medium text-2xl mx-8">⚠️ WHO cảnh báo về nghiện chatbot hẹn hò AI • </span>
                    <span className="font-medium text-2xl mx-8">👽 AI của Lầu Năm Góc đảo ngược công nghệ ngoài hành tinh • </span>
               </div>
            </Marquee>
        </div>
    )
}

export default NewsMarquee;