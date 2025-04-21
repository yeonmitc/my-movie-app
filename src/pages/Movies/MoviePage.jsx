// src/pages/MoviePage.jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMoviesQuery } from '@/hooks/useMovies';
import { useSearchMovieQuery } from '@/hooks/useSearchMovie';
import MovieCard from '@/common/components/MovieCard/MovieCard';
import MovieSlider from '@/common/components/MovieSlider/MovieSlider';
import { responsive } from '@/constants/responsive';
import toast from 'react-hot-toast';
import './MoviePage.style.css';

// 유효한 영화만 필터링
const filterValidMovies = (movies = []) =>
  movies.filter(
    (movie) =>
      movie?.id && movie?.title && movie?.poster_path && movie.title.toLowerCase() !== 'undefined'
  );

const MoviePage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';

  const popularQuery = useMoviesQuery('popular');
  const searchQuery = useSearchMovieQuery({ keyword: query, enabled: !!query });

  const isLoading = popularQuery.isLoading || (query && searchQuery.isLoading);
  const isError = popularQuery.isError || (query && searchQuery.isError);
  const error = popularQuery.error || searchQuery.error;

  const searchedMovies = filterValidMovies(searchQuery.data);
  const popularMovies = popularQuery.data;

  const isSearchedValid = query && searchedMovies.length > 0;
  const movies = isSearchedValid ? searchedMovies : popularMovies;

  if (isError) {
    toast.error(`영화 데이터 오류: ${error.message}`);
    return <div className="movie-error">영화 데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  if (isLoading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="movie-page-container">
      {query && !isSearchedValid ? (
        <div className="movie-no-result-text mb-8">
          <p className="movie-slider-title">
            😕 <strong className="font-bold">‘{query}’</strong> 와 일치하는 결과가 없습니다.
          </p>
          <h1 className="movie-page-title">' 인기 영화에서 찾아보세요 '</h1>
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <h1 className="movie-page-title">{query ? `🔍 ‘${query}’ 검색 결과` : '✨ 인기 영화'}</h1>
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MoviePage;
