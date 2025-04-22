import { Toaster } from 'react-hot-toast';
const ToastManager = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 600,
        style: {
          padding: '16px 20px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 500,
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#fff',
          color: '#111',
          animation: 'slide-in-top 0.4s ease',
        },

        // ✅ 공통 클래스
        className: `
            border border-gray-200 dark:border-gray-700 
            dark:bg-[#1f1f1f] dark:text-white 
            backdrop-blur-md transition-all
            text-xs sm:text-sm max-w-[90%] sm:max-w-[400px]
          `,

        // ✅ 상태별 테마 커스터마이징
        success: {
          icon: '✅',
          style: {
            backgroundColor: '#e6f9ed',
            color: '#15803d',
            borderColor: '#bbf7d0',
          },
        },
        error: {
          icon: '⛔',
          style: {
            backgroundColor: '#ffecec',
            color: '#dc2626',
            borderColor: '#fecaca',
          },
        },
        loading: {
          icon: '⏳',
          style: {
            backgroundColor: '#f0f0f0',
            color: '#444',
            borderColor: '#ddd',
          },
        },
      }}
    />
  );
};

export default ToastManager;
