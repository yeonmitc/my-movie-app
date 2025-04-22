import React from 'react';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_IMAGE = '/default-movie.jpg';

const MoviePoster = ({ posterPath = '', alt = 'Movie Poster', className = '' }) => {
  const imageUrl = posterPath ? `${IMAGE_BASE_URL}${posterPath}` : DEFAULT_IMAGE;

  return (
    <img
      src={imageUrl}
      alt={alt}
       loading="lazy"
      className={className}
      onError={(e) => {
        if (!e.currentTarget.src.includes(DEFAULT_IMAGE)) {
          e.currentTarget.src = DEFAULT_IMAGE;
        }
      }}
    />
  );
};

export default MoviePoster;
