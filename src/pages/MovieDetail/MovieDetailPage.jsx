import React from 'react';
import './MovieDetail.Page.style.css';
import { useParams } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import { useVideoModalStore } from '@/store/videoModalStore';
import toast from 'react-hot-toast';
import { useMovieDetailQuery } from '@/hooks/useMovieDetail';
import { useMovieVideosQuery } from '@/hooks/useMovieVideos';
import MoviePoster from '@/common/components/MoviePoster';


const MovieDetailPage = () => {
  const { id } = useParams();
  const { openModal } = useVideoModalStore();
  const { data: movie, isLoading, isError, error } = useMovieDetailQuery(id);
  const { data: videos } = useMovieVideosQuery(id);

  if (isLoading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (isError || !movie) {
    toast.error(`영화 정보를 불러오지 못했습니다: ${error?.message || 'Unknown error'}`);
    return null;
  }


  const trailer = videos?.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  );

  const handleWatchTrailer = () => {
    if (trailer?.key) {
      openModal(id);
    } else {
      toast.error('이 영화는 아직 예고편이 없습니다. 😢',{
        id: 'video-error', 
      });
    }
  };

  return (
    <div className="movie-detail-layout">
      <div className="movie-detail-wrapper">
        {/* ✅ 포스터 */}
        <div className="movie-poster-container group relative">
        <MoviePoster
  posterPath={movie?.poster_path}
  alt={movie?.title}
  className="movie-poster"
/>
          <div
            className="movie-poster-overlay group-hover:opacity-100"
            onClick={handleWatchTrailer}
            onTouchStart={handleWatchTrailer}
          >
            <span className="text-5xl text-white">▶</span>
          </div>
        </div>

        {/* ✅ 정보 */}
        <div className="movie-info-container">
          {movie.genres?.length > 0 && (
            <div className="movie-genres">
              {movie.genres.map((g) => (
                <span key={g.id} className="genre-badge">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {movie.title && <h1 className="movie-title">{movie.title}</h1>}
          {movie.tagline && <p className="movie-tagline">{movie.tagline}</p>}

          <div className="movie-stats">
            {movie.vote_average > 0 && (
              <span className="flex items-center gap-1">
                <AiFillStar className="text-yellow-500" />
                {movie.vote_average}
              </span>
            )}
            {movie.vote_count > 0 && (
              <span className="flex items-center gap-1">
                <FaUsers className="text-yellow-500" />
                {movie.vote_count.toLocaleString()}
              </span>
            )}
            <span
              className={`rating-badge ${movie.adult ? 'bg-red-600' : 'bg-green-600'}`}
            >
              {movie.adult ? '18' : 'ALL'}
            </span>
          </div>

          {movie.overview && <p className="movie-overview">{movie.overview}</p>}

          <div className="movie-info">
            {movie.budget > 0 && (
              <p className="badge-row">
                <span className="badge">Budget</span> ${movie.budget.toLocaleString()}
              </p>
            )}
            {movie.revenue > 0 && (
              <p className="badge-row">
                <span className="badge">Revenue</span> ${movie.revenue.toLocaleString()}
              </p>
            )}
            {movie.release_date && (
              <p className="badge-row">
                <span className="badge">Release Date</span> {movie.release_date}
              </p>
            )}
            {movie.runtime > 0 && (
              <p className="badge-row">
                <span className="badge">Run time</span> {movie.runtime}분
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
