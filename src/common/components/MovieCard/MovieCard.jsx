// import { GENRE_MAP } from '@/constants/genreMap'
import React from 'react';
import './MovieCard.style.css';
import { useGenreStore } from '@/store/genreStore';
import { useNavigate } from 'react-router-dom';
import MoviePoster from '../MoviePoster';


const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/movies/${movie.id}`, {
      state: { movie },
    });
  };
  const genreMap = useGenreStore((state) => state.genreMap);
  const title = movie.title || movie.original_title || '제목 없음';
  const rating = movie.vote_average ?? 0;

  //console.log('movie.adult=', movie.adult);
  const isAdult = movie.adult === true || movie.adult === 'true';
  return (
    <div className="movie-card" onClick={handleClick}>
      <img
        src={isAdult ? '/adult.png' : '/all.png'}
        alt={isAdult ? '성인용' : '전체관람가'}
        className="age-icon absolute top-1 right-1 z-30 h-6 w-6 md:h-8 md:w-8"
      />

<MoviePoster
  posterPath={movie?.poster_path}
  alt={movie?.title}
/>

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
