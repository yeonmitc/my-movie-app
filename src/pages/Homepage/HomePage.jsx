// src/pages/Home.jsx
import React from 'react';
import Banner from '@/pages/HomePage/components/Banner/Banner';
import MovieSlider from '@/common/components/MovieSlider/MovieSlider';
import { responsive } from '@/constants/responsive';

export default function HomePage() {
  return (
    <main className="min-h-screen transition-colors duration-300">
      <Banner />
      <div className="w-full overflow-x-hidden px-2 sm:px-4">
        <MovieSlider title="🔥 인기 영화" type="popular" responsive={responsive} />
        <MovieSlider title="⭐ 평점 높은 영화" type="top_rated" responsive={responsive} />
        <MovieSlider title="⏳ 상영 예정작" type="upcoming" responsive={responsive} />
      </div>
    </main>
  );
}
