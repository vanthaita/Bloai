'use client'
import React, { useEffect } from 'react';
import { FaSortUp, FaSquare, FaPlay } from 'react-icons/fa';
import { MdCircle } from 'react-icons/md';
import { motion, useAnimation } from 'framer-motion';

const Rocket404 = () => {
  const controls = useAnimation();

  useEffect(() => {
    const rocketContainer = document.querySelector('.rocket-container');
    if (rocketContainer) {
      setTimeout(() => {
        rocketContainer.classList.add('animate-float');
      }, 200); 
    }

    controls.start({
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      },
    });
  }, [controls]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden relative">
      <div className="absolute inset-0">
        {[...Array(70)].map((_, i) => {
          const size = Math.random() * 1.2 + 0.5;
          const opacity = Math.random() * 0.6 + 0.4;
          const speed = Math.random() * 3 + 2;
          const startDelay = Math.random() * speed; 
          return (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full star"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: opacity,
              }}
              animate={{
                opacity: [opacity, 1, opacity],
                scale: [1, 1.1, 1],
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

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30"></div>
          <motion.h1
            className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [1, 0.8, 1],
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

        <motion.div
          className="relative h-96 w-64 flex justify-center rocket-container transform translate-y-12 transition-transform duration-500 ease-out"
          animate={controls}
        >
          <div className="absolute bottom-0 w-20 h-64">
            <FaSortUp
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[85%] text-gray-300"
              style={{ fontSize: '40px' }}
            />

            <FaSquare
              className="absolute top-[20px] left-0 w-full h-[calc(100%-20px)] rounded-t-2xl shadow-xl"
              style={{
                background: 'linear-gradient(to bottom, #F3F4F6, #9CA3AF)',
                color: 'transparent'
              }}
            />

            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-cyan-400 rounded-full shadow-inner flex items-center justify-center">
              <MdCircle className="w-6 h-6 text-white opacity-70" />
            </div>

            <FaPlay
              className="absolute -bottom-4 -left-10 text-orange-500 rotate-[20deg]"
              style={{
                fontSize: '70px',
                color: 'transparent',
                background: 'linear-gradient(to right, #F87171, #FB923C)'
              }}
            />
            <FaPlay
              className="absolute -bottom-4 -right-10 text-orange-500 rotate-[-20deg] transform scale-x-[-1]"
              style={{
                fontSize: '70px',
                color: 'transparent',
                background: 'linear-gradient(to left, #F87171, #FB923C)'
              }}
            />

            <motion.div
              className="absolute -bottom-20 left-[20%] transform -translate-x-1/2"
              animate={{
                scaleY: [0.8, 1.2, 0.8],
                translateY: [0, -5, 0],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 0.1,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className="w-12 h-32 bg-gradient-to-t from-yellow-400 to-orange-600 rounded-full blur-md opacity-90"></div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-24 bg-gradient-to-t from-orange-300 to-red-600 rounded-full blur-sm opacity-95"></div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-16 bg-red-700 rounded-full opacity-100"></div>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-24 text-center space-y-6">
          <motion.h2
            className="text-2xl font-semibold text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Oops, trang này lạc vào vũ trụ rồi!
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Đừng lo lắng, đôi khi ngay cả những phi hành gia giỏi nhất cũng lạc đường.
          </motion.p>
          <motion.button
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-white hover:scale-105 transition-transform duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            onClick={() => window.location.href = '/'}
          >
            Quay về Trái Đất
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Rocket404;