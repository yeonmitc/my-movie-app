import React from 'react';
import { FaStar, FaUsers } from 'react-icons/fa';
import { useGenreStore } from '@/store/genreStore';
import './MovieDetailCard.style.css';
import { useNavigate } from 'react-router-dom';
import MoviePoster from '../components/MoviePoster';

const MovieDetailCard = ({ movie }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/movies/${movie.id}`, {
      state: { movie },
    });
  };

  const genreMap = useGenreStore((state) => state.genreMap);
  const {
    title = '제목 없음',
    release_date,
    genre_ids = [],
    overview = '',
    vote_average = 0,
    vote_count = 0,
    adult = false,
    poster_path,
  } = movie;

  const releaseYear = release_date ? release_date.slice(0, 4) : '개봉일 없음';
  const isAdult = movie.adult === true || movie.adult === 'true';

  return (
    <div className="movie-detail-card group" onClick={handleClick}>
      <div className="image-wrapper">
        <MoviePoster
          posterPath={movie?.poster_path}
          alt={movie?.title}
          className="movie-detail-image"
        />

        <img
          src={isAdult ? '/adult.png' : '/all.png'}
          alt={isAdult ? '성인용' : '전체관람가'}
          className="absolute top-2 right-2 z-30 h-6 w-6 md:h-8 md:w-8"
        />
      </div>

      <div className="movie-detail-content">
        <h2 className="movie-detail-title line-clamp-2 group-hover:text-white">
          {title}
          <span className="movie-detail-year group-hover:text-white">({releaseYear})</span>
        </h2>

        <div className="movie-detail-genres">
          {genre_ids.map((id) => (
            <span key={id} className="movie-detail-badge">
              {genreMap[id] || '장르 없음'}
            </span>
          ))}
        </div>

        <p className="movie-detail-overview group-hover:text-white">{overview}</p>

        <div className="movie-detail-meta">
          <div className="movie-detail-rating">
            <FaStar className="icon-star" /> {vote_average.toFixed(1)}
          </div>
          <div className="movie-detail-votes">
            <FaUsers className="icon-users" /> {vote_count.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailCard;
