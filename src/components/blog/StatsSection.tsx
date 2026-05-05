'use client';

import React from 'react';
import { FileText, Users, Eye, TrendingUp } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

function StatItem({ icon, value, label, color }: StatItemProps) {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className={`p-3 ${color} rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

export function StatsSection() {
  const stats = [
    {
      icon: <FileText className="h-6 w-6 text-green-700" />,
      value: '500+',
      label: 'Bài viết',
      color: 'bg-green-100'
    },
    {
      icon: <Users className="h-6 w-6 text-blue-700" />,
      value: '10K+',
      label: 'Độc giả',
      color: 'bg-blue-100'
    },
    {
      icon: <Eye className="h-6 w-6 text-purple-700" />,
      value: '1M+',
      label: 'Lượt xem',
      color: 'bg-purple-100'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-orange-700" />,
      value: '50+',
      label: 'Tác giả',
      color: 'bg-orange-100'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
