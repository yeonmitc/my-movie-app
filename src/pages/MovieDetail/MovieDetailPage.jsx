import React from 'react';
import { useParams } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import { useGenreStore } from '@/store/genreStore';
import { useVideoModalStore } from '@/store/videoModalStore';
import { useMovieDetailQuery } from '@/hooks/useMoiveDetail';
import toast from 'react-hot-toast';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieDetailPage = () => {
  const { id } = useParams();
  const { genreMap } = useGenreStore();
  const { openModal } = useVideoModalStore();
  const { data: movie, isLoading, isError, error } = useMovieDetailQuery(id);

  if (isLoading)
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner" />
      </div>
    );

  if (isError) {
    toast.error(`영화 정보를 불러오지 못했습니다: ${error?.message}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-1)] px-4 py-8 text-[var(--color-text-1)] sm:px-6 md:px-10 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row">
        {/* ✅ 왼쪽 포스터 + 오버레이 */}
        <div className="group relative w-full max-w-sm">
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
          />
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-[rgba(0,0,0,0.5)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            onClick={() => openModal(movie.id)}
          >
            <span className="text-5xl text-white">▶</span>
          </div>
        </div>

        {/* 오른쪽 정보 */}
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap gap-2">
            {movie.genres?.map((g) => (
              <span
                key={g.id}
                className="rounded-full bg-red-600 px-3 py-1 text-sm font-medium text-white"
              >
                {g.name}
              </span>
            ))}
          </div>

          <h1 className="mb-2 text-4xl font-bold">{movie.title}</h1>
          <p className="mb-4 text-xl text-[var(--color-text-2)]">
            {movie.tagline || 'No tagline available'}
          </p>

          <div className="mb-6 flex items-center gap-4 text-lg text-yellow-500">
            <span className="flex items-center gap-1">
              <AiFillStar /> {movie.vote_average}
            </span>
            <span className="flex items-center gap-1">
              <FaUsers /> {movie.vote_count.toLocaleString()}
            </span>
            <span
              className={`rounded-full px-2 py-1 text-sm font-bold text-white ${movie.adult ? 'bg-red-600' : 'bg-green-600'}`}
            >
              {movie.adult ? '18' : 'ALL'}
            </span>
          </div>

          <p className="mb-6 border-t border-[var(--color-border-2)] pt-4 leading-relaxed">
            {movie.overview}
          </p>

          <div className="space-y-3 border-t border-[var(--color-border-2)] pt-4">
            {movie.budget > 0 && (
              <p>
                <span className="badge">Budget</span> ${movie.budget.toLocaleString()}
              </p>
            )}
            {movie.revenue > 0 && (
              <p>
                <span className="badge">Revenue</span> ${movie.revenue.toLocaleString()}
              </p>
            )}
            <p>
              <span className="badge">Release Date</span> {movie.release_date}
            </p>
            <p>
              <span className="badge">Run time</span> {movie.runtime}분
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
