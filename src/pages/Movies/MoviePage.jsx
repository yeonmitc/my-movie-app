// ✅ src/pages/MoviePage.jsx (정렬 + 장르 필터 + 검색어 반영 조건부 지원 + 다크모드 + 애니메이션 + 장르별 API 지원)

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMoviesQuery } from '@/hooks/useMovies';
import { useSearchMovieQuery } from '@/hooks/useSearchMovie';
import { useDiscoverMovieQuery } from '@/hooks/useDiscoverMovieQuery';

import { useGenreStore } from '@/store/genreStore';
import toast from 'react-hot-toast';
import './MoviePage.style.css';
import MovieDetailCard from '@/common/MovieDetailCard/MovieDetailCard';
const MoviePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'release');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'all');
  const { genreMap } = useGenreStore();

  const isSearchActive = Boolean(query);

  const searchQuery = useSearchMovieQuery({ keyword: query, enabled: isSearchActive });
  const popularQuery = useMoviesQuery('popular');
  const genreQuery = useDiscoverMovieQuery({ genreId: selectedGenre, sortOption, enabled: !isSearchActive && selectedGenre !== 'all' });

  const isLoading = searchQuery.isLoading || popularQuery.isLoading || genreQuery.isLoading;
  const isError = searchQuery.isError || popularQuery.isError || genreQuery.isError;
  const error = searchQuery.error || popularQuery.error || genreQuery.error;

  const filterValidMovies = (movies = []) =>
    movies.filter((m) => m.title && m.title.toLowerCase() !== 'undefined');

  const searchedMovies = filterValidMovies(searchQuery.data);
  const popularMovies = filterValidMovies(popularQuery.data);
  const genreMovies = filterValidMovies(genreQuery.data);

  let baseMovies = [];

  if (isSearchActive) {
    baseMovies = searchedMovies;
  } else if (selectedGenre !== 'all') {
    baseMovies = genreMovies;
  } else {
    baseMovies = popularMovies;
  }

  useEffect(() => {
    const updatedSort = searchParams.get('sort') || 'release';
    const updatedGenre = searchParams.get('genre') || 'all';

    setSortOption(updatedSort);
    setSelectedGenre(updatedGenre);
  }, [searchParams.toString()]);

  // ✅ sortOption에 따라 성인/전체 관람 필터링
  const sortFilteredMovies = baseMovies.filter((movie) => {
    if (sortOption === 'g') return movie.adult === false;
    if (sortOption === 'r') return movie.adult === true;
    return true; // vote, popularity, release
  });

  const sortedMovies = [...sortFilteredMovies].sort((a, b) => {
    if (sortOption === 'vote') return b.vote_average - a.vote_average;
    if (sortOption === 'popularity') return b.popularity - a.popularity;
    if (sortOption === 'release' || sortOption === 'g' || sortOption === 'r') return new Date(b.release_date) - new Date(a.release_date);
    return 0;
  });

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortOption(newSort);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', newSort);
      return newParams;
    });
  };

  const handleGenreSelect = (genreId) => {
    const updated = genreId === selectedGenre ? 'all' : genreId;
    setSelectedGenre(updated);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (updated === 'all') {
        newParams.delete('genre');
      } else {
        newParams.set('genre', updated);
      }
      return newParams;
    });
  };

  if (isError) {
    toast.error(`영화 데이터 오류: ${error.message}`);
    return <div className="movie-error">영화 데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  if (isLoading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="movie-page-layout">
      <aside className="movie-filter-panel">
        <div className="filter-box">
          <label className="filter-title">Sort</label>
          <div className="custom-select">
            <select value={sortOption} onChange={handleSortChange} className="dark:bg-zinc-900 bg-white border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none">
              <option value="vote">평점순 ➡️</option>
              <option value="popularity">인기순 ➡️</option>
              <option value="release">최신순 ➡️</option>
              <option value="g">전체관람 ➡️</option>
              <option value="r">성인용 ➡️</option>
            </select>
          </div>
        </div>

        <div className="filter-box">
          <label className="filter-title">장르별 필터</label>
          <div className="genre-badge-group">
            <button
              className={`genre-btn ${selectedGenre === 'all' ? 'active' : ''}`}
              onClick={() => handleGenreSelect('all')}
            >전체보기</button>
            {Object.entries(genreMap).map(([id, name]) => (
              <button
                key={id}
                className={`genre-btn transition-all duration-200 ease-in-out ${selectedGenre === id ? 'active' : ''}`}
                onClick={() => handleGenreSelect(id)}
              >{name}</button>
            ))}
          </div>
        </div>
      </aside>

      <section className="movie-grid-section">
        {isSearchActive && searchedMovies.length === 0 && (
          <p className="movie-no-result-text">😕 ‘{query}’ 와 일치하는 결과가 없습니다.</p>
        )}

        <div className="movie-grid">
          {sortedMovies.map((movie) => (
            <MovieDetailCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MoviePage;
