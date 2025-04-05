'use client'
import React from 'react';
import { FaRocket, FaUsers, FaBook, FaCode, FaRegEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const AboutPage = () => {
  const teamMembers = [
    { 
      name: "Nhóm BloAI",
      role: "Nhà phát triển & Content Creator", 
      bio: "Nhóm sinh viên nhiệt huyết với AI",
      avatar: "/images/Logo/web-app-manifest-512x512.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-indigo-50/50 text-gray-800">
      <motion.div 
        initial="initial"
        animate="animate"
        className=" bg-cover py-24"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Giới thiệu 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> BlogAI</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto md:text-2xl md:leading-relaxed"
            >
              Nền tảng kiến thức AI hàng đầu - Kết nối lý thuyết với thực tiễn
            </motion.p>
          </motion.div>

          <motion.div 
            variants={stagger}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {[
              { icon: <FaRocket />, title: "100+ Bài viết chất lượng", text: "Cập nhật hàng tuần về các chủ đề AI hot nhất" },
              { icon: <FaUsers />, title: "10,000+ Độc giả", text: "Cộng đồng AI lớn nhất Việt Nam" },
              { icon: <FaBook />, title: "Tài nguyên MIỄN PHÍ", text: "Ebook, code mẫu và dataset chất lượng" },
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-blue-100"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600 text-2xl group-hover:bg-blue-100 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 max-w-6xl py-20">
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"/>
            <h2 className="text-3xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Sứ mệnh của chúng tôi
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed md:text-xl md:leading-relaxed">
                BlogAI được thành lập với mục tiêu trở thành cầu nối giữa lý thuyết AI và thực tiễn ứng dụng. 
                <span className="highlight-text">Kiến thức chất lượng</span> phải được trình bày 
                <span className="highlight-text">rõ ràng, thực tế</span> và 
                <span className="highlight-text">dễ tiếp cận</span>.
              </p>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900">Giá trị cốt lõi</h3>
                <div className="space-y-6">
                  {[
                    { icon: <FaCode />, title: "Thực hành là trên hết", text: "Hướng dẫn từng bước với code mẫu" },
                    { icon: <FaBook />, title: "Học thuật nghiêm túc", text: "Bài viết được kiểm duyệt bởi chuyên gia" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-5 group">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-600 text-xl shadow-sm group-hover:bg-blue-100 transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                        <p className="text-gray-600">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden shadow-xl h-96"
            >
                <img
                    src="https://images.unsplash.com/photo-1694903089438-bf28d4697d9a?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Phòng thí nghiệm AI"
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 via-transparent to-transparent flex items-end p-8">
                <div className="text-white space-y-2">
                    <h3 className="text-2xl font-bold">Hệ thống bài lab AI thực tế</h3>
                    <p className="opacity-90">Trải nghiệm học tập tương tác</p>
                </div>
                </div>
            </motion.div>
          </div>
        </motion.section>

        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"/>
            <h2 className="text-3xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Đội ngũ phát triển
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">Nhóm BloAI</h3>
              <p className="text-gray-600 leading-relaxed md:text-lg">
                Dự án được phát triển bởi nhóm sinh viên Đại học Công Nghệ Thông Tin - UIT trong khuôn khổ môn học 
                <span className="text-blue-600 font-medium"> IE204 - SEO</span>. Chúng tôi áp dụng:
              </p>
              <ul className="grid grid-cols-2 gap-4">
                {["SEO On-page/Off-page", "Content Marketing", "Technical SEO", "Phân tích dữ liệu"].map((item, index) => (
                  <li 
                    key={index}
                    className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      {index % 2 === 0 ? <FaCode /> : <FaBook />}
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-6">
                <motion.div 
                  whileHover={{ rotate: 2 }}
                  className="relative w-28 h-28 flex-shrink-0"
                >
                  <img
                    src='https://i.imgur.com/oZfJXEM.png'
                    alt={teamMembers[0]?.name || ''}
                    className="rounded-2xl object-contain"
                  />
                </motion.div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-bold text-gray-900">{teamMembers[0]?.name}</h4>
                  <p className="text-gray-600">{teamMembers[0]?.role}</p>
                  <div className="flex gap-4">
                    {[
                      { icon: <FaLinkedin />, color: "text-[#0A66C2]" },
                      { icon: <FaGithub />, color: "text-gray-700" }
                    ].map((item, index) => (
                      <motion.a
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        className={`text-2xl ${item.color} hover:text-opacity-80 transition-all`}
                        href="https://github.com/TDevUIT/Bloai"
                      >
                        {item.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-10 mb-24 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10"/>
          <div className="relative text-center space-y-6">
            <h3 className="text-3xl font-bold">Bắt đầu hành trình AI của bạn</h3>
            <p className="text-lg opacity-95 max-w-xl mx-auto">
              Tham gia cộng đồng hơn 10,000 người đang học và ứng dụng AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signin" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaRocket />
                Đăng ký miễn phí
              </Link>
              <Link 
                href="/" 
                className="border-2 border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all hover:border-white/50 flex items-center gap-2"
              >
                <FaBook />
                Khám phá bài viết
              </Link>
            </div>
          </div>
        </motion.section>

        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"/>
            <h2 className="text-3xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Liên hệ hợp tác
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed text-lg">
                Chúng tôi luôn mở rộng hợp tác với các chuyên gia AI/ML, nhà nghiên cứu, công ty công nghệ và content creator.
              </p>
              <ul className="grid grid-cols-2 gap-4">
                {["Chuyên gia AI/ML", "Nhà nghiên cứu", "Công ty công nghệ", "Content Creator"].map((item, index) => (
                  <li 
                    key={index}
                    className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className={`w-8 h-8 ${index % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'} rounded-lg flex items-center justify-center`}>
                      {index % 2 === 0 ? <FaCode /> : <FaUsers />}
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl space-y-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <FaRegEnvelope className="text-xl"/>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Liên hệ qua email</p>
                  <p className="text-xl font-semibold text-gray-900">ie204seo@gmail.com</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="font-medium text-gray-600">Theo dõi chúng tôi</p>
                <div className="flex gap-6">
                  {[
                    { icon: <FaLinkedin />, color: "bg-[#0A66C2]/10", text: "text-[#0A66C2]" },
                    { icon: <FaGithub />, color: "bg-gray-700/10", text: "text-gray-700" }
                  ].map((item, index) => (
                    <motion.a
                      key={index}
                      whileHover={{ y: -3 }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color} ${item.text} hover:opacity-80 transition-all`}
                      href="https://github.com/TDevUIT/Bloai"
                    >
                      {item.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;