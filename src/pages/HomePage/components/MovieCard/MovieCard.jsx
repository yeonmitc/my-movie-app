import { GENRE_MAP } from '@/constants/genreMap'
import React from 'react'
import './MovieCard.style.css'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const FALLBACK_IMAGE = '/fallback.jpg'

const MovieCard = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : FALLBACK_IMAGE

    // console.log("movie =" , movie)
  return (
    <div className="movie-card">
      <img
        src={imageUrl}
        alt={movie.title}
        onError={(e) => (e.target.src = FALLBACK_IMAGE)}
      />
      <div className="movie-overlay">
        <div className="movie-title">{movie.title}</div>
        
        <div className="movie-rating">⭐ {movie.vote_average?.toFixed(1)}</div>
        <div className="genre-badges">
    {movie.genre_ids?.map((id) => (
      <span key={id} className="genre-badge">{GENRE_MAP[id]}</span>
    ))}
  </div>
      </div>
    </div>
  )
}

export default MovieCard
