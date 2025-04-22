import React from 'react';
import { FaStar, FaUsers } from 'react-icons/fa';
import { useGenreStore } from '@/store/genreStore';
import './MovieDetailCard.style.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_IMAGE = '/default-movie.jpg';

const MovieDetailCard = ({ movie }) => {
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

  const imageUrl = poster_path ? `${IMAGE_BASE_URL}${poster_path}` : DEFAULT_IMAGE;
  const releaseYear = release_date ? release_date.slice(0, 4) : '개봉일 없음';

  return (
    <div className="movie-detail-card">
      <img
        src={imageUrl}
        alt={title}
        className="movie-detail-image"
        onError={(e) => (e.target.src = DEFAULT_IMAGE)}
      />
      <div className="movie-detail-content">
        <h2 className="movie-detail-title line-clamp-2">{title}</h2>
        <p className="movie-detail-year">{releaseYear}</p>

        <div className="movie-detail-genres">
          {genre_ids.map((id) => (
            <span key={id} className="movie-detail-badge">
              {genreMap[id] || '장르 없음'}
            </span>
          ))}
        </div>

        <p className="movie-detail-overview line-clamp-3">{overview}</p>

        <div className="movie-detail-meta">
          <div className="movie-detail-rating">
            <FaStar className="icon-star" /> {vote_average.toFixed(1)}
          </div>
          <div className="movie-detail-votes">
            <FaUsers className="icon-users" /> {vote_count.toLocaleString()}
          </div>
        </div>

        <div className="movie-detail-label">
          {adult ? (
            <span className="text-red-500 font-bold">Under 18</span>
          ) : (
            <span className="text-yellow-400 font-bold">All</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailCard;
