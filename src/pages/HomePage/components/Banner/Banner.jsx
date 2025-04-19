import React, { useEffect, useState } from 'react'
import { usePopularMoviesQuery } from '@/hooks/usePopularMovies'
import { useMovieStore } from '@/store/movieStore'
import { useFilteredMovies } from '@/hooks/useFilteredMovies'
import toast from 'react-hot-toast'
import './Banner.style.css'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w1280'
const FALLBACK_IMAGE = '/fallback.jpg'

const Banner = () => {
  const { isLoading, isError, error } = usePopularMoviesQuery()
  const { query, allMovies } = useMovieStore()
  const filteredMovies = useFilteredMovies()

  const [randomMovie, setRandomMovie] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)


  useEffect(() => {
    if (isError && error?.message) {
      toast.error(`에러 발생: ${error.message}`, {
        id: 'banner-error',
        duration: 1500
      })
    }
  }, [isError, error])

  // ✅ 랜덤 영화 선택 (query 여부에 따라 필터 or 전체 영화)
  useEffect(() => {

    console.log("🎯 query:", query)
    console.log("🍿 allMovies:", allMovies)
    console.log("🔍 filteredMovies:", filteredMovies)

    const source = query.trim() ? useFilteredMovies() : allMovies
    if (source.length > 0) {
      const rand = Math.floor(Math.random() * source.length)
      setRandomMovie(source[rand])
    } else {
      setRandomMovie(null)
    }
  }, [query, allMovies]) 


  if (isLoading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner" />
      </div>
    )
  }


  if (isError) return null

  if (!randomMovie) {
    return (
      <div className="text-purple-500 px-4 py-6 text-center text-sm sm:text-base">
        🎬 영화 찾는 중 ...
      </div>
    )
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