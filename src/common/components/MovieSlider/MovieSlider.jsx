import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import MovieCard from '../MovieCard/MovieCard';
import toast from 'react-hot-toast';
import { useMoviesQuery } from '@/hooks/useMovies';

import './MovieSlider.style.css';

const MovieSlider = ({ title, type, responsive }) => {
  const { data, isLoading, isError, error } = useMoviesQuery(type);
  //console.log("data", data)
  const movies = Array.isArray(data) ? data : data?.results || [];
  //console.log("movies" , movies)


  if (isError) {
    toast.error(`${title} 로드 중 오류: ${error.message}`);
    return null;
  }

  if (isLoading) {
    return <div className="py-4 text-center text-sm text-gray-500">{title} 로딩 중...</div>;
  }

  if (movies.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-gray-400">
        {title}에 해당하는 영화가 없습니다.
      </div>
    );
  }

  return (
    <section className="movie-slider-section px-4 py-6 sm:px-8">
      <p className="movie-slider-title mb-4">{title}</p>
      <Carousel
        arrows
        infinite
        autoPlay
        autoPlaySpeed={3000}
        responsive={responsive}
        itemClass="carousel-item-spacing"
      >
        {movies.map((movie) => {
          // console.log('🎬 Movie:', movie)
          return <MovieCard key={movie.id} movie={movie} />;
        })}
      </Carousel>
    </section>
  );
};

export default MovieSlider;
