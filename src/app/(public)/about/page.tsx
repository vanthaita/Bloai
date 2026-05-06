"use client"
import Link from "next/link"
import { Bot, Brain, Code, TrendingUp, Users, BookOpen, Mail } from "lucide-react"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import Head from "next/head"
import { aboutPageSchemaLd, safeJsonLdStringify } from "@/config/seo"
import React from "react"

interface TeamMember {
  name: string
  role: string
  bio: string
  avatar: string
}

interface Feature {
  icon: JSX.Element
  title: string
  desc: string
}

const AboutPage = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "TÒA SOẠN BLOAI",
      role: "Tổng Biên Tập & Chuyên gia AI",
      bio: "Nhóm chuyên gia định hướng nội dung và phát triển nền tảng",
      avatar: "/images/Logo/android-chrome-512x512.png",
    },
  ];

  const features: Feature[] = [
    {
      icon: <Bot className="text-black h-6 w-6" />,
      title: "KIẾN THỨC CỐT LÕI",
      desc: "Các bài viết phân tích chuyên sâu về công nghệ AI, từ thuật toán cơ sở đến các mô hình ngôn ngữ lớn (LLMs).",
    },
    {
      icon: <Brain className="text-black h-6 w-6" />,
      title: "ỨNG DỤNG THỰC TẾ",
      desc: "Phân tích và mổ xẻ cách AI đang tái định hình các ngành công nghiệp, y tế, giáo dục và sáng tạo nghệ thuật.",
    },
    {
      icon: <Code className="text-black h-6 w-6" />,
      title: "BẢN TIN CÔNG NGHỆ",
      desc: "Cập nhật liên tục 24/7 về các nghiên cứu đột phá, các thương vụ sáp nhập và tin tức độc quyền từ Thung lũng Silicon.",
    },
    {
      icon: <TrendingUp className="text-black h-6 w-6" />,
      title: "CÔNG CỤ TỐI ƯU",
      desc: "Đánh giá khách quan và thử nghiệm thực tế các công cụ AI mới nhất trên thị trường để tối ưu hóa năng suất làm việc.",
    },
  ]

  return (
    <>
      <Head>
        <link rel="canonical" href="https://www.bloai.blog/about" />
      </Head>
      <div className="min-h-screen bg-white text-black font-sans">

        {/* SỨ MỆNH */}
        <section className="bg-white pt-32 pb-20 border-b-2 border-black">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-black inline-block border-b-[3px] border-black pb-2">
                TỪ SỨ MỆNH ĐẾN TẦM NHÌN
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-none border-[1.5px] border-black group hover:bg-black transition-colors duration-300">
                  <div className="w-14 h-14 border-[1.5px] border-black flex items-center justify-center bg-white mb-6 group-hover:border-white">
                    {React.cloneElement(feature.icon, { className: 'text-black group-hover:text-white' })}
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-widest mb-4 text-black group-hover:text-white">{feature.title}</h3>
                  <p className="text-black group-hover:text-white text-sm font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section id="why-us" className="w-full py-20 border-b-2 border-black bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-black inline-block border-b-[3px] border-black pb-2">
                GIÁ TRỊ TÒA SOẠN
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "KHÁCH QUAN & ĐỘC LẬP",
                  desc: "Thông tin được kiểm chứng đa chiều, không thiên vị, mang đến góc nhìn trung thực nhất về bức tranh AI toàn cầu."
                },
                {
                  title: "CHUYÊN SÂU & ĐẮT GIÁ",
                  desc: "Không chỉ đưa tin, chúng tôi phân tích tác động sâu rộng của từng dòng code đến kinh tế và xã hội."
                },
                {
                  title: "CỘNG ĐỒNG TINH HOA",
                  desc: "Nơi quy tụ các chuyên gia, nhà nghiên cứu và những cá nhân đam mê công nghệ hàng đầu."
                }
              ].map((val, idx) => (
                <div key={idx} className="bg-white p-8 rounded-none border-[1.5px] border-black text-center relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-1 text-sm font-bold uppercase tracking-widest border-[1.5px] border-black">
                    TIÊU CHUẨN {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-widest mt-4 mb-4 text-black">{val.title}</h3>
                  <p className="text-black font-medium text-sm leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="py-20 border-b-2 border-black">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="mb-12">
              <h2 className="text-3xl font-extrabold uppercase tracking-widest text-black inline-block border-b-[3px] border-black pb-2">
                HỘI ĐỒNG BIÊN TẬP
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold uppercase tracking-widest text-black">BLOAI NEWS TEAM</h3>
                <p className="text-black font-medium leading-relaxed">
                  Được vận hành bởi hội đồng biên tập giàu kinh nghiệm, xuất thân từ các khối ngành kỹ thuật phần mềm và khoa học máy tính (UIT). Chúng tôi áp dụng quy trình kiểm duyệt nội dung khắt khe chuẩn báo chí:
                </p>
                <ul className="grid grid-cols-2 gap-4">
                  {["XÁC THỰC NGUỒN TIN", "PHÂN TÍCH CHUYÊN SÂU", "TỐI ƯU TRẢI NGHIỆM ĐỌC", "BẢO MẬT DỮ LIỆU"].map(
                    (item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 bg-white p-4 border-[1.5px] border-black rounded-none"
                      >
                        <div className="w-8 h-8 bg-black flex items-center justify-center text-white flex-shrink-0">
                          {index % 2 === 0 ? <BookOpen className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                        </div>
                        <span className="font-bold text-xs uppercase tracking-widest">{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div className="border-[2px] border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0 border-[1.5px] border-black bg-black flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-black uppercase tracking-widest text-black">{teamMembers[0]?.name}</h4>
                    <p className="text-black font-bold text-xs uppercase tracking-widest bg-gray-100 inline-block px-2 py-1 border border-black">{teamMembers[0]?.role}</p>
                    <div className="flex gap-4 pt-2">
                      {[
                        { icon: <FaLinkedin className="h-5 w-5" />, href: "#" },
                        { icon: <FaGithub className="h-5 w-5" />, href: "https://github.com/TDevUIT/Bloai" },
                      ].map((item, index) => (
                        <a
                          key={index}
                          className="text-black hover:text-white hover:bg-black border-[1.5px] border-black p-2 transition-colors"
                          href={item.href}
                        >
                          {item.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="container mx-auto px-6 py-20 border-b-2 border-black max-w-5xl">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold uppercase tracking-widest text-black inline-block border-b-[3px] border-black pb-2">
              LIÊN HỆ TÒA SOẠN
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-black font-medium leading-relaxed">
                Chúng tôi luôn chào đón các chuyên gia, nhà báo công nghệ và các tổ chức cùng chung tay xây dựng hệ sinh thái thông tin AI minh bạch, giá trị.
              </p>
              <ul className="grid grid-cols-2 gap-4">
                {["CHUYÊN GIA AI", "NHÀ NGHIÊN CỨU", "DOANH NGHIỆP CÔNG NGHỆ", "KÝ GIẢ BÁO CHÍ"].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 bg-white p-4 border-[1.5px] border-black rounded-none"
                  >
                    <div className="w-8 h-8 bg-black flex items-center justify-center text-white flex-shrink-0">
                      {index % 2 === 0 ? <Users className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                    </div>
                    <span className="font-bold text-[10px] uppercase tracking-widest">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-[2px] border-black p-8 bg-black text-white space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border-[1.5px] border-white flex items-center justify-center bg-white text-black">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-[10px] uppercase tracking-widest text-gray-300 mb-1">Đường dây nóng / Hộp thư điện tử</p>
                  <p className="text-xl font-bold tracking-wider">ie204seo@gmail.com</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-700 pt-6">
                <p className="font-bold text-[10px] uppercase tracking-widest text-gray-300">Kết nối mạng xã hội</p>
                <div className="flex gap-4">
                  {[
                    { icon: <FaLinkedin className="h-5 w-5" /> },
                    { icon: <FaGithub className="h-5 w-5" /> },
                  ].map((item, index) => (
                    <a
                      key={index}
                      className="w-12 h-12 border-[1.5px] border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                      href="https://github.com/TDevUIT/Bloai"
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="get-started" className="w-full py-24 bg-white px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-black mb-8">BẮT ĐẦU NGAY HÔM NAY</h2>

            <p className="text-black font-medium text-lg mb-10 max-w-2xl mx-auto">
              Trở thành độc giả thường xuyên để không bỏ lỡ những bài phân tích sâu sắc nhất về thời đại Trí tuệ nhân tạo.
            </p>

            <Link
              href="/"
              className="inline-block bg-black text-white border-2 border-black px-10 py-5 font-bold uppercase tracking-widest text-lg hover:bg-white hover:text-black transition-colors"
            >
              ĐỌC BẢN TIN MỚI NHẤT
            </Link>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(aboutPageSchemaLd) }}
        />
      </div>
    </>
  );
}

export default AboutPage