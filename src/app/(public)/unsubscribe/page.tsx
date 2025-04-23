'use client'
import React from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/trpc/react';
import { toast } from 'react-toastify';

const UnsubscribePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') as string;
  const [isUnsubscribed, setIsUnsubscribed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  
  const unSubscribeMutation = api.blog.unsubscribeToNewsletter.useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsUnsubscribed(true);
      toast.success('Hủy đăng ký nhận bản tin thành công!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        router.push('/');
      }, 5000);
    },
    onError: (error) => {
      setError(error.message);
      toast.error(`Hủy đăng ký thất bại: ${error.message}`, {
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

  const handleUnsubscribe = () => {
    if (!email) {
      toast.warning('Địa chỉ email sai vui lòng thử lại!', {
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
    unSubscribeMutation.mutate({ email });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Hủy đăng ký nhận bản tin</title>
        <meta name="description" content="Hủy đăng ký nhận bản tin từ chúng tôi" />
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isUnsubscribed ? 'Đã hủy đăng ký' : 'Hủy đăng ký nhận bản tin'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isUnsubscribed ? (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="mt-4 text-gray-600">
                Bạn đã hủy đăng ký nhận bản tin thành công.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Địa chỉ email <span className="font-medium">{email}</span> sẽ không còn nhận được thông báo từ chúng tôi.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Bạn sẽ được chuyển về trang chủ sau 5 giây...
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Quay về trang chủ ngay
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600">
                  Bạn có chắc chắn muốn hủy đăng ký <span className="font-medium">{email}</span> khỏi danh sách nhận bản tin?
                </p>
              </div>

              <div>
                <button
                  onClick={handleUnsubscribe}
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    'Xác nhận hủy đăng ký'
                  )}
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                Thay đổi ý định?{' '}
                <button
                  onClick={() => window.history.back()}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Quay lại
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnsubscribePage;