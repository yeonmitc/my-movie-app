import ThemeToggle from '@/common/components/ThemeToggle';
import React from 'react';
import toast from 'react-hot-toast';

const TestToast = () => {
  return (

    
    <div className="p-10 space-y-4">

            <ThemeToggle />
      <button
        className="btn btn-back"
        onClick={() => toast.success('성공적으로 작동!')}
      >
        Success Toast
      </button>

      <button
        className="btn btn-back"
        onClick={() => toast.error('에러가 발생했습니다')}
      >
        Error Toast
      </button>

      <button
        className="btn btn-back"
        onClick={() =>
          toast('👋 일반 알림 메시지', { icon: '🔔', duration: 1500 })
        }
      >
        Info Toast
      </button>
    </div>
  );
};

export default TestToast;
