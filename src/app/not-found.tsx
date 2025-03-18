'use client' // Đánh dấu đây là Client Component của Next.js, cho phép sử dụng useState, useEffect, và các hook khác

import React, { useEffect, useState } from 'react'; // Thêm useState để quản lý trạng thái ô tìm kiếm
import Link from 'next/link'; // Sử dụng Link của Next.js để điều hướng mà không cần tải lại trang
import { FaSortUp, FaSquare, FaPlay, FaHome, FaArrowLeft, FaSearch } from 'react-icons/fa'; // Import các icon từ React Icons
import { MdCircle } from 'react-icons/md';
import { motion, useAnimation } from 'framer-motion'; // Sử dụng Framer Motion để tạo hiệu ứng chuyển động

const Rocket404 = () => {
  const controls = useAnimation(); // Hook của Framer Motion để kiểm soát animation
  const [searchQuery, setSearchQuery] = useState(''); // State lưu giá trị ô tìm kiếm

  useEffect(() => {
    // Thêm hiệu ứng bay cho tên lửa khi trang được tải
    const rocketContainer = document.querySelector('.rocket-container');
    if (rocketContainer) {
      setTimeout(() => {
        rocketContainer.classList.add('animate-float'); // Thêm class để kích hoạt animation
      }, 200); 
    }

    // Cấu hình animation cho tên lửa di chuyển lên xuống liên tục
    controls.start({
      y: [0, -15, 0], // Giá trị di chuyển theo trục y: từ 0 -> -15px -> 0
      transition: {
        duration: 4, // Thời gian hoàn thành 1 chu kỳ
        repeat: Infinity, // Lặp vô hạn
        repeatType: 'mirror', // Chạy xuôi rồi chạy ngược
        ease: 'easeInOut', // Hiệu ứng chuyển động mềm mại
      },
    });
  }, [controls]); // Chỉ chạy một lần khi component được mount

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden relative">
      {/* Background với các ngôi sao lấp lánh */}
      <div className="absolute inset-0">
        {[...Array(70)].map((_, i) => { // Tạo 70 ngôi sao
          const size = Math.random() * 1.2 + 0.5; // Kích thước ngẫu nhiên từ 0.5px đến 1.7px
          const opacity = Math.random() * 0.6 + 0.4; // Độ trong suốt ngẫu nhiên từ 0.4 đến 1
          const speed = Math.random() * 3 + 2; // Tốc độ nhấp nháy ngẫu nhiên
          const startDelay = Math.random() * speed; // Delay ngẫu nhiên để các ngôi sao không nhấp nháy cùng lúc
          return (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full star"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`, // Vị trí ngẫu nhiên theo chiều ngang
                top: `${Math.random() * 100}%`, // Vị trí ngẫu nhiên theo chiều dọc
                opacity: opacity,
              }}
              animate={{
                opacity: [opacity, 1, opacity], // Animation độ trong suốt: ban đầu -> 1 -> ban đầu
                scale: [1, 1.1, 1], // Tăng giảm kích thước nhẹ
              }}
              transition={{
                duration: speed,
                delay: startDelay,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'linear',
              }}
            />
          );
        })}
      </div>

      {/* Nội dung chính của trang 404 */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Số 404 với hiệu ứng phát sáng */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30"></div> {/* Hiệu ứng glow */}
          <motion.h1
            className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
            animate={{
              scale: [1, 1.05, 1], // Hiệu ứng phóng to thu nhỏ nhẹ
              opacity: [1, 0.8, 1], // Hiệu ứng mờ đi rồi sáng lên
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          >
            404
          </motion.h1>
        </div>

        {/* Tên lửa với hiệu ứng bay lơ lửng */}
        <motion.div
          className="relative h-96 w-64 flex justify-center rocket-container transform translate-y-12 transition-transform duration-500 ease-out"
          animate={controls} // Áp dụng animation đã cấu hình từ controls
        >
          {/* Thiết kế tên lửa sử dụng các icon và div tạo hình */}
          <div className="absolute bottom-0 w-20 h-64">
            {/* Đầu tên lửa */}
            <FaSortUp
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[85%] text-gray-300"
              style={{ fontSize: '40px' }}
            />

            {/* Thân tên lửa */}
            <FaSquare
              className="absolute top-[20px] left-0 w-full h-[calc(100%-20px)] rounded-t-2xl shadow-xl"
              style={{
                background: 'linear-gradient(to bottom, #F3F4F6, #9CA3AF)', // Gradient cho thân tên lửa
                color: 'transparent'
              }}
            />

            {/* Cửa sổ tên lửa */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-cyan-400 rounded-full shadow-inner flex items-center justify-center">
              <MdCircle className="w-6 h-6 text-white opacity-70" />
            </div>

            {/* Cánh tên lửa trái */}
            <FaPlay
              className="absolute -bottom-4 -left-10 text-orange-500 rotate-[20deg]"
              style={{
                fontSize: '70px',
                color: 'transparent',
                background: 'linear-gradient(to right, #F87171, #FB923C)'
              }}
            />
            
            {/* Cánh tên lửa phải */}
            <FaPlay
              className="absolute -bottom-4 -right-10 text-orange-500 rotate-[-20deg] transform scale-x-[-1]"
              style={{
                fontSize: '70px',
                color: 'transparent',
                background: 'linear-gradient(to left, #F87171, #FB923C)'
              }}
            />
            <motion.div
              className="absolute -bottom-24 left-[20%] transform -translate-x-1/2" // Lower flames
              animate={{
                scaleY: [0.9, 1.3, 0.9], // More pronounced scaling
                translateY: [0, -8, 0],  // Increased vertical movement
                opacity: [0.7, 1, 0.7],   // More variation in opacity
              }}
              transition={{
                duration: 0.1,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
                {/* Multiple flame layers for depth */}
              <div className="w-14 h-40 bg-gradient-to-t from-yellow-300 via-yellow-500 to-orange-600 rounded-full blur-lg opacity-90"></div> {/* Larger blur */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-32 bg-gradient-to-t from-orange-300 via-red-500 to-red-700 rounded-full blur-md opacity-95"></div> {/* Medium blur */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-6 h-20 bg-gradient-to-t from-red-600 to-red-800 rounded-full  opacity-100"></div> {/* No blur */}
            </motion.div>
          </div>
        </motion.div>

        {/* Phần nội dung và tương tác */}
        <div className="mt-24 text-center space-y-6 max-w-xl px-4"> {/* max-w-xl giúp giữ độ rộng phù hợp trên màn hình lớn */}
          {/* Tiêu đề thông báo lỗi */}
          <motion.h2
            className="text-2xl font-semibold text-gray-300"
            initial={{ opacity: 0, y: 20 }} // Trạng thái ban đầu
            animate={{ opacity: 1, y: 0 }} // Trạng thái cuối
            transition={{ delay: 0.2, duration: 0.5 }} // Hiệu ứng xuất hiện sau 0.2s
          >
            Oops, trang này lạc vào vũ trụ rồi!
          </motion.h2>
          
          {/* Văn bản mô tả lỗi */}
          <motion.p
            className="text-gray-400 max-w-md mx-auto" // mx-auto để căn giữa
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }} // Hiệu ứng xuất hiện sau 0.5s
          >
            Đừng lo lắng, đôi khi ngay cả những phi hành gia giỏi nhất cũng lạc đường.
            Chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
          </motion.p>
          
          {/* Các nút điều hướng */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 pt-2" // flex-wrap để hiển thị tốt trên mobile
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {/* Nút về trang chủ sử dụng Link của Next.js thay vì chuyển hướng trực tiếp */}
            <Link href="/" className="px-6 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-white hover:scale-105 transition-transform duration-200">
              <FaHome /> Quay về Trái Đất
            </Link>
            
            {/* Nút quay lại trang trước sử dụng window.history.back() */}
            <button 
              onClick={() => window.history.back()} 
              className="px-6 py-2 flex items-center gap-2 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-full font-semibold text-gray-300 hover:scale-105 transition-transform duration-200"
            >
              <FaArrowLeft /> Quay Lại
            </button>
          </motion.div>
          
          {/* Form tìm kiếm để giúp người dùng tìm nội dung khác */}
          <motion.div 
            className="pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }} // Xuất hiện sau các nút điều hướng
          >
            <p className="text-gray-400 mb-3">Tìm kiếm nội dung khác:</p>
            <form 
              className="flex mx-auto max-w-md" 
              onSubmit={(e) => {
                e.preventDefault(); // Ngăn form load lại trang
                if (searchQuery.trim()) { // Kiểm tra không cho phép tìm kiếm rỗng
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`; // Chuyển hướng đến trang tìm kiếm với query params
                }
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật state khi người dùng nhập
                placeholder="Nhập từ khóa tìm kiếm..."
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-full text-white focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-r-full flex items-center justify-center hover:opacity-90"
              >
                <FaSearch /> {/* Icon tìm kiếm */}
              </button>
            </form>
          </motion.div>
        </div>
        
        {/* Footer với tên thương hiệu/website */}
        <motion.div 
          className="mt-12 text-gray-500 text-sm font-mono" // Sử dụng font-mono để tạo cảm giác tech
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }} // Hiệu ứng xuất hiện cuối cùng
        >
          <Link href="/" className="hover:text-blue-400 transition-colors">.Bloai</Link> {/* Liên kết về trang chủ */}
        </motion.div>
      </div>
    </div>
  );
};

export default Rocket404;