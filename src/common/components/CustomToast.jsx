import spaceBg from '@/assets/space.jpg';

const CustomToast = ({ message }) => {
  return (
    <div className="toast-overlay relative max-w-[90%] overflow-hidden rounded-xl px-6 py-5 text-center text-base font-bold text-white shadow-xl sm:text-lg">
      <div className="relative z-10">✨ {message}</div>
      <style>
        {`
          .toast-overlay::after {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url(${spaceBg});
            background-size: cover;
            background-position: center;
            opacity: 0.7;
            z-index: 0;
            border-radius: 0.75rem;
          }
        `}
      </style>
    </div>
  );
};

export default CustomToast;
