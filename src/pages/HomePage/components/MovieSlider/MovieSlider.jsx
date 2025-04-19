import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import MovieCard from "../MovieCard/MovieCard";
import toast from "react-hot-toast";
import { useMoviesQuery } from "@/hooks/useMovies";

import './MovieSlider.style.css'

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
};

const MovieSlider = ({ title, type }) => {
  const { data = [], isLoading, isError, error } = useMoviesQuery(type);

  if (isError) {
    toast.error(`${title} 로드 중 오류: ${error.message}`);
    return null;
  }

  if (isLoading) {
    return (
      <div className="text-sm text-center text-gray-500 py-4">
        {title} 로딩 중...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-sm text-center text-gray-400 py-4">
        {title}에 해당하는 영화가 없습니다.
      </div>
    );
  }

  return (
    <section className="movie-slider-section px-4 sm:px-8 py-6">
      <p className="movie-slider-title mb-4">{title}</p>
      <Carousel
        arrows
        infinite
        autoPlay
        autoPlaySpeed={3000}
        responsive={responsive}
        itemClass="carousel-item-spacing"
      >
    {data.map((movie) => {
  // console.log('🎬 Movie:', movie)
  return <MovieCard key={movie.id} movie={movie} />
})}

      </Carousel>
    </section>
  );
};

export default MovieSlider;
