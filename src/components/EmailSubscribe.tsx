'use client'
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '@/trpc/react';

interface EmailSubscribeSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

const EmailSubscribeSection = ({
  title = "Nhận thông tin cập nhật mới nhất",
  description = "Đăng ký để nhận bài viết mới, tin tức và cập nhật từ chúng tôi.",
  className = "",
}: EmailSubscribeSectionProps) => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const subscribeMutation = api.blog.subscribeToNewsletter.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      toast.success('Đăng ký nhận bản tin thành công! Cảm ơn bạn.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setEmail('');
    },
    onError: (error) => {
      toast.error(`Đăng ký thất bại: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Vui lòng nhập địa chỉ email', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    subscribeMutation.mutate({ email });
  };

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="max-w-3xl mx-auto text-center px-4">
        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-black mb-4">
          {title}
        </h3>
        <p className="text-gray-600 mb-8 font-medium max-w-xl mx-auto">
          {description}
        </p>
        
        <form className="flex flex-col sm:flex-row gap-0 border-[2px] border-black p-1 max-w-2xl mx-auto bg-white" onSubmit={handleSubmit}>
          <div className="relative flex-grow">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder='Nhập email của bạn...'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 rounded-none border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12 md:h-14 bg-transparent text-black placeholder:text-gray-400 text-sm md:text-base w-full"
              aria-label="Email đăng ký nhận bản tin"
              disabled={isLoading}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="bg-black hover:bg-gray-800 text-white rounded-none h-12 md:h-14 px-6 md:px-8 uppercase font-bold tracking-widest text-[10px] md:text-xs transition-colors shrink-0"
            disabled={isLoading}
          >
            {isLoading ? (
              'ĐANG GỬI...'
            ) : (
              <span className="flex items-center">
                ĐĂNG KÝ NGAY
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
        
        <p className="text-xs text-gray-500 mt-4 font-medium">
          Chúng tôi tôn trọng quyền riêng tư của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.
        </p>
      </div>
    </section>
  );
};

export default EmailSubscribeSection;