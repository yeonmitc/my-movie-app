// ✅ MoviePage.jsx – TailwindCSS 정리용 컴포넌트 스타일 분리 적용 + Pagination 통합 UI/UX 개선

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMoviesQuery } from '@/hooks/useMovies';
import { useSearchMovieQuery } from '@/hooks/useSearchMovie';
import { useDiscoverMovieQuery } from '@/hooks/useDiscoverMovieQuery';
import { useGenreStore } from '@/store/genreStore';
import ReactPaginate from 'react-paginate';
import toast from 'react-hot-toast';
import './MoviePage.style.css';
import MovieDetailCard from '@/common/MovieDetailCard/MovieDetailCard';
import TopButton from '@/common/components/TopButton';

const MoviePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'release');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'all');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const { genreMap } = useGenreStore();

  const isSearchActive = Boolean(query);

  const searchQuery = useSearchMovieQuery({ keyword: query, page, enabled: isSearchActive });
  const popularQuery = useMoviesQuery('popular');
  const genreQuery = useDiscoverMovieQuery({
    genreId: selectedGenre,
    sortOption,
    enabled: !isSearchActive && selectedGenre !== 'all',
  });

  const isLoading = searchQuery.isLoading || popularQuery.isLoading || genreQuery.isLoading;
  const isError = searchQuery.isError || popularQuery.isError || genreQuery.isError;
  const error = searchQuery.error || popularQuery.error || genreQuery.error;

  const filterValidMovies = (movies = []) =>
    movies.filter((m) => m.title && m.title.toLowerCase() !== 'undefined');

  const searchedMovies = filterValidMovies(searchQuery.data?.results);
  const popularMovies = filterValidMovies(popularQuery.data);
  const genreMovies = filterValidMovies(genreQuery.data);

  let baseMovies = [];
  if (isSearchActive) {
    baseMovies = searchedMovies;
    if (selectedGenre !== 'all') {
      baseMovies = baseMovies.filter((movie) => movie.genre_ids.includes(Number(selectedGenre)));
    }
  } else if (selectedGenre !== 'all') {
    baseMovies = genreMovies;
  } else {
    baseMovies = popularMovies;
  }

  const sortedMovies = [...baseMovies].sort((a, b) => {
    if (sortOption === 'vote') return b.vote_average - a.vote_average;
    if (sortOption === 'popularity') return b.popularity - a.popularity;
    return new Date(b.release_date) - new Date(a.release_date);
  });

  const pageSize = 12;
  const pageCount = Math.ceil(sortedMovies.length / pageSize);
  const paginatedMovies = sortedMovies.slice((page - 1) * pageSize, page * pageSize);

  const handleSortChange = (value) => {
    setSortOption(value);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', value);
      newParams.set('page', '1');
      return newParams;
    });
    setPage(1);
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
      newParams.set('page', '1');
      return newParams;
    });
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setSortOption('release');
    setSelectedGenre('all');
    setPage(1);
  };

  const handlePageClick = ({ selected }) => {
    const newPage = selected + 1;
    setPage(newPage);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', newPage.toString());
      return newParams;
    });
  };

  useEffect(() => {
    const updatedSort = searchParams.get('sort') || 'release';
    const updatedGenre = searchParams.get('genre') || 'all';
    const updatedPage = Number(searchParams.get('page')) || 1;
    setSortOption(updatedSort);
    setSelectedGenre(updatedGenre);
    setPage(updatedPage);
  }, [searchParams.toString()]);

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

  const radioStyle = (value) => `radio-btn ${sortOption === value ? 'active-radio' : ''}`;
  const genreStyle = (value) => `genre-btn ${selectedGenre === value ? 'active-genre' : ''}`;

  return (
    <div className="movie-page-layout">
      <aside className="movie-filter-panel">
        <div className="filter-box">
          <label className="filter-title">정렬 방식</label>
          <div className="mt-2 flex flex-wrap gap-2">
            <button className="reset-btn" onClick={handleResetFilters}>
              검색 초기화
            </button>
            <button className={radioStyle('vote')} onClick={() => handleSortChange('vote')}>
              평점순
            </button>
            <button
              className={radioStyle('popularity')}
              onClick={() => handleSortChange('popularity')}
            >
              인기순
            </button>
            <button className={radioStyle('release')} onClick={() => handleSortChange('release')}>
              최신순
            </button>
          </div>
        </div>

        <div className="filter-box">
          <label className="filter-title">장르별 필터</label>
          <div className="genre-badge-group mt-2 flex flex-wrap gap-2">
            <button className={genreStyle('all')} onClick={() => handleGenreSelect('all')}>
              전체
            </button>
            {Object.entries(genreMap).map(([id, name]) => (
              <button key={id} className={genreStyle(id)} onClick={() => handleGenreSelect(id)}>
                {name}
              </button>
            ))}
          </div>
        </div>

        {pageCount > 1 && (
          <div className="filter-box">
            <ReactPaginate
              nextLabel=">"
              previousLabel="<"
              onPageChange={handlePageClick}
              pageCount={pageCount}
              forcePage={page - 1}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              containerClassName="pagination-container"
              pageClassName="pagination-page"
              activeClassName="pagination-active"
              previousClassName="pagination-nav"
              nextClassName="pagination-nav"
              breakLabel="..."
            />
          </div>
        )}
      </aside>

      <section className="movie-grid-section">
        {sortedMovies.length === 0 && (
          <p className="movie-no-result-text mt-10 text-center text-base text-[var(--color-text-2)] sm:text-lg">
            😕 결과에 해당하는 영화가 없습니다.
          </p>
        )}
        {isSearchActive && searchedMovies.length === 0 && (
          <p className="movie-no-result-text">😕 ‘{query}’ 와 일치하는 결과가 없습니다.</p>
        )}

        <div className="movie-grid">
          {paginatedMovies.map((movie) => (
            <MovieDetailCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <TopButton />
    </div>
  );
};

export default MoviePage;
