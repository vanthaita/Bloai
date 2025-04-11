"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaRobot, FaBrain, FaCode, FaChartLine, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { homePageSchemaLd, safeJsonLdStringify } from '@/config/seo';

const LandingPage = () => {
  const [heroImage] = useState('https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');

  const features = [
    { icon: <FaRobot className="text-blue-600"/>, title: "Hướng dẫn thực tế", desc: "Các bài lab chi tiết về Machine Learning và Deep Learning" },
    { icon: <FaBrain className="text-blue-600"/>, title: "Nghiên cứu mới nhất", desc: "Cập nhật những breakthrough trong thế giới AI" },
    { icon: <FaCode className="text-blue-600"/>, title: "Mã nguồn mẫu", desc: "Kho code mẫu với TensorFlow/PyTorch" },
    { icon: <FaChartLine className="text-blue-600"/>, title: "Case study", desc: "Phân tích ứng dụng AI trong các ngành công nghiệp" }
  ];

  const trendingPosts = [
    { id: 1, title: "Xây dựng GPT từ đầu", category: "NLP", excerpt: "Hướng dẫn chi tiết xây dựng transformer architecture" },
    { id: 2, title: "Fine-tuning Stable Diffusion", category: "Computer Vision", excerpt: "Tối ưu model gen ảnh theo phong cách riêng" },
    { id: 3, title: "Deploy AI Model", category: "MLOps", excerpt: "Triển khai model với Docker và Kubernetes" }
  ];
  return (
    <>
     <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(homePageSchemaLd) }}
      />
        <div className="min-h-screen bg-white text-gray-800">
        <section className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Khám phá thế giới 
                <span className="text-blue-600"> AI</span> cùng BloAI
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Nền tảng kiến thức AI hàng đầu - Kết nối lý thuyết với thực hành
              </p>
              <div className="flex gap-4">
                <Link href="/auth/signin" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium transition-colors">
                  Bắt đầu ngay
                  <FaArrowRight className="mt-1" />
                </Link>
                <Link href="/about" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <Image
                src={heroImage}
                alt="AI Visualization"
                width={600}
                height={400}
                className="rounded-xl shadow-xl border-4 border-blue-100"
                priority
              />
              <div className="absolute -bottom-4 left-4 bg-white p-4 rounded-xl shadow-lg">
                <span className="text-xl font-bold text-blue-600">100K+</span>
                <p className="text-sm text-gray-600">Developers tham gia</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Lợi ích khi tham gia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Bài viết nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingPosts.map(post => (
              <div key={post.id} className="bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <Image
                  src={`https://picsum.photos/400/300?tech=${post.id}`}
                  alt={post.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="text-blue-600 text-sm font-semibold">{post.category}</span>
                  <h3 className="text-xl font-semibold mt-2 mb-3">{post.title}</h3>
                  <p className="text-gray-600">{post.excerpt}</p>
                  <button className="mt-4 text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium">
                    Đọc tiếp <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Sẵn sàng khám phá AI?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Tham gia cộng đồng 100,000+ developer đang phát triển cùng trí tuệ nhân tạo
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/signin" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Đăng ký miễn phí
              </Link>
              <Link href="/about" className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Xem demo
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
    
  );
};

export default LandingPage;