import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const TopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    visible && (
      <button className="top-btn animate-slide-in" onClick={scrollToTop}>
        <FaArrowUp className="h-full w-full" />
      </button>
    )
  );
};

export default TopButton;
