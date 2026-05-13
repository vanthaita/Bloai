'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';

export function FooterNewsletterForm() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribe:', email);
  };

  return (
    <form onSubmit={handleSubscribe} className="flex max-w-sm">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Địa chỉ Email"
          className="w-full pl-9 pr-3 py-2 border border-black border-r-0 rounded-none focus:outline-none focus:bg-gray-50 text-xs bg-white text-black placeholder:text-gray-500 font-medium transition-colors"
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-black text-white font-bold rounded-none hover:bg-white hover:text-black transition-colors text-[10px] uppercase tracking-wider whitespace-nowrap border border-black"
      >
        Đăng ký
      </button>
    </form>
  );
}
