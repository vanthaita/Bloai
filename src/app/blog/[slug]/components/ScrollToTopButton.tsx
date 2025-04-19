'use client';

import React from 'react';
import { FaArrowUp } from 'react-icons/fa';

interface ScrollToTopButtonProps {
    isVisible: boolean;
    onClick: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ isVisible, onClick }) => {
    if (!isVisible) return null;

    return (
        <button
            onClick={onClick}
            className="fixed bottom-20 right-2 md:bottom-8 md:right-8 z-50 bg-[#3A6B4C] text-white rounded-full p-3 shadow-lg hover:bg-[#3A6B4C]/50 focus:outline-none focus:ring-2 focus:ring-[#3A6B4C] focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 ease-in-out transform hover:scale-110"
            aria-label='Scroll to top'
            title="Scroll back to top"
        >
            <FaArrowUp className="w-5 h-5" />
        </button>
    );
};

export default ScrollToTopButton;