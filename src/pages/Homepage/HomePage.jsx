// src/pages/Home.jsx
import React from 'react' 
import Banner from '@/pages/HomePage/components/Banner/Banner';
import MovieSlider from './components/MovieSlider/MovieSlider';
import MovieSlider from '@/pages/HomePage/components/MovieSlider/MovieSlider';

export default function HomePage() {


  return (
    <main className="min-h-screen transition-colors duration-300">
      <Banner />
      <div className="mt-6">
        <MovieSlider title="🔥 인기 영화" type="popular"  />
        <MovieSlider title="⭐ 평점 높은 영화" type="top_rated" />
        <MovieSlider title="⏳ 상영 예정작" type="upcoming"  />
      </div>
    </main>
  );
}
