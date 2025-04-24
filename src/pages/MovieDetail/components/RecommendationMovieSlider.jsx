import React from 'react';
import { useParams } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import toast from 'react-hot-toast';
import MovieCard from '@/common/components/MovieCard/MovieCard';
import { useRecommendedMoviesQuery } from '@/hooks/useRecommendedMovies.js';

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 3 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 2 },
};

export default function RecommendationMovieSlider({ sectionTitle }) {
  const { movieId, id } = useParams();
  const realMovieId = movieId || id;
  const { data, isLoading, isError, error } = useRecommendedMoviesQuery({ movieId: realMovieId });

  const movies = data?.results ?? [];

  if (isError) {
    toast.error(`추천 영화 로드 실패: ${error?.message}`);
    return null;
  }

  if (isLoading) {
    return <div className="text-center text-gray-500">추천 영화 로딩 중...</div>;
  }

  if (movies.length === 0) {
    return <div className="text-center text-gray-400">추천 영화가 아직 존재하지 않아요.</div>;
  }

  return (
    <section className="movie-recommendation-wrapper">
      {sectionTitle && <h2 className="mb-4 text-xl font-semibold text-white">{sectionTitle}</h2>}

      <Carousel
        arrows
        infinite
        autoPlay
        autoPlaySpeed={3000}
        responsive={responsive}
        itemClass="carousel-item-spacing"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </Carousel>
    </section>
  );
}
