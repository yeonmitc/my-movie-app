import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import './Banner.style.css'
import { useMoviesQuery } from '@/hooks/useMovies'


const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w1280'
const FALLBACK_IMAGE = '/fallback.jpg'

const Banner = () => {
  const { data = [], isLoading, isError, error } = useMoviesQuery("popular");
  const [randomMovie, setRandomMovie] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (data.length > 0) {
      const rand = Math.floor(Math.random() * data.length);
      setRandomMovie(data[rand]);
    }
  }, [data]);

  useEffect(() => {
    if (isError && error?.message) {
      toast.error(`에러 발생: ${error.message}`);
    }
  }, [isError, error]);

  if (isLoading || !randomMovie) {
    return <div className="loading-wrapper"><div className="loading-spinner" /></div>;
  }
  const imageUrl = randomMovie.backdrop_path
    ? `${IMAGE_BASE_URL}${randomMovie.backdrop_path}`
    : FALLBACK_IMAGE

  return (
    <section className="banner-section">
      <img
        src={imageUrl}
        alt={randomMovie.title}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => (e.target.src = FALLBACK_IMAGE)}
        className={`banner-image absolute inset-0 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className="banner-overlay">
        <h1 className="banner-title">
          {randomMovie.title || randomMovie.original_title}
        </h1>
        <p className="banner-overview">
          {randomMovie.overview}
        </p>
        <div className="banner-buttons">
          <button className="btn btn-animated btn-explore">Watch Now</button>
        </div>
      </div>
    </section>
  )
}

export default Banner