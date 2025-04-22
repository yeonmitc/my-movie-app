// import { GENRE_MAP } from '@/constants/genreMap'
import React from 'react';
import './MovieCard.style.css';
import { useGenreStore } from '@/store/genreStore';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_IMAGE = '/default-movie.jpg';

const MovieCard = ({ movie }) => {
  const genreMap = useGenreStore((state) => state.genreMap);
  const title = movie.title || movie.original_title || '제목 없음';
  const rating = movie.vote_average ?? 0;
  const imageUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : DEFAULT_IMAGE;

  //console.log('movie.adult=', movie.adult);
  const isAdult = movie.adult === true || movie.adult === 'true';
  return (
    <div className="movie-card">
      <img
        src={isAdult ? '/adult.png' : '/all.png'}
        alt={isAdult ? '성인용' : '전체관람가'}
        className="age-icon absolute top-1 right-1 z-30 h-6 w-6 md:h-8 md:w-8"
      />

      <img src={imageUrl} alt={title} onError={(e) => (e.target.src = DEFAULT_IMAGE)} />

      <div className="movie-overlay">
        <div className="movie-title">{title}</div>
        <div className="movie-rating">⭐ {rating.toFixed(1)}</div>

        {movie.genre_ids?.length > 0 && (
          <div className="genre-badges">
            {movie.genre_ids.map((id) => (
              <span key={id} className="genre-badge">
                {genreMap[id] || '장르 없음'}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
