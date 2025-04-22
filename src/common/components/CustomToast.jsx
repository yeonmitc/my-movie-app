import spaceBg from '@/assets/space.jpg';
const CustomToast = ({ message }) => {
  return (
    <div
      className="rounded-xl px-6 py-5 text-center text-base font-bold text-white shadow-xl sm:text-lg"
      style={{
        backgroundImage: `url(${spaceBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(255,255,255,0.3)',
        textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        maxWidth: '90%',
      }}
    >
      ✨ {message}
    </div>
  );
};

export default CustomToast;
