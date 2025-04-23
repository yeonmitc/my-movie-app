import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import './Banner.style.css';
import { useNavigate } from 'react-router-dom';
import { useMoviesQuery } from '@/hooks/useMovies';
import { useVideoModalStore } from '@/store/videoModalStore';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w1280';
const DEFAULT_IMAGE = '/default-banner.png';

const Banner = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useMoviesQuery('popular');
  const movies = Array.isArray(data) ? data : data?.results || [];

  const [randomMovie, setRandomMovie] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { openModal } = useVideoModalStore(); // 모달 추가

  const handleClick = () => {
    navigate(`/movies/${randomMovie?.id}`, {
      state: { randomMovie },
    });
  };
  useEffect(() => {
    if (movies.length > 0 && !randomMovie) {
      const rand = Math.floor(Math.random() * movies.length);
      setRandomMovie(movies[rand]);
    }
  }, [movies, randomMovie]);

  useEffect(() => {
    if (isError && error?.message) {
      toast.error(`에러 발생: ${error.message}`);
    }
  }, [isError, error]);

  if (isLoading || !randomMovie) {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner" />
      </div>
    );
  }
  const imageUrl = randomMovie.backdrop_path
    ? `${IMAGE_BASE_URL}${randomMovie.backdrop_path}`
    : DEFAULT_IMAGE;

  return (
    <section
      className="banner-section"
      style={{
        backgroundImage: `url(${imageLoaded ? imageUrl : DEFAULT_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        transition: 'background-image 0.5s ease-in-out',
      }}
    >
      {/*backgroundImage는 onLoad 이벤트를 지원하지 않음 그래서 따로하는것  */}
      {randomMovie && (
        <img
          src={imageUrl}
          alt={randomMovie.title}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.onerror = null; // 루프 방지
            e.currentTarget.src = DEFAULT_IMAGE;
          }}
          style={{ display: 'none' }}
        />
      )}
      <div className="banner-overlay">
        <h1 className="banner-title">{randomMovie.title || randomMovie.original_title}</h1>
        <p className="banner-overview">{randomMovie.overview}</p>
        <div className="banner-buttons">
          <button
            className="btn btn-animated btn-explore"
            onClick={() => openModal(randomMovie.id)}
          >
            예고편
          </button>
          <button className="btn btn-animated btn-explore" onClick={handleClick}>
            상세보기
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
