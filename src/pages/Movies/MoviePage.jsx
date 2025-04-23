import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDiscoverMovieInfinite } from '@/hooks/useDiscoverMovieInfinite';
import { useGenreStore } from '@/store/genreStore';
import MovieDetailCard from '@/common/MovieDetailCard/MovieDetailCard'; //
import ReactPaginate from 'react-paginate';
import TopButton from '@/common/components/TopButton';
import CustomToast from '@/common/components/CustomToast';
import toast from 'react-hot-toast';
import './MoviePage.style.css';
import { useSearchMovieInfinite } from '@/hooks/useInfiniteMovieSearch';
import { useMoviesQuery } from '@/hooks/useMovies';

export default function MoviePage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q')?.trim() || '';
  const [sortOption, setSortOption] = useState(params.get('sort') || 'default');
  const [genreId, setGenreId] = useState(params.get('genre') || 'all');
  const [page, setPage] = useState(Number(params.get('page')) || 1);
  const [pageSize, setPageSize] = useState(window.innerWidth < 640 ? 5 : 12);
  const { genreMap } = useGenreStore();
  const isSearch = query.length > 0; // 검색 여부

  const popularQ = useMoviesQuery('popular'); // 인기영화
  const discoverQ = useDiscoverMovieInfinite({
    genreId: genreId === 'all' ? null : genreId,
    sortOption,
    enabled: !isSearch, // 검색 중일 땐 꺼짐
  });
  const searchQ = useSearchMovieInfinite(query, isSearch); // 검색 쿼리

  const pages = (() => {
    if (isSearch) return searchQ.data?.pages?.flatMap((p) => p.results) || [];
    if (discoverQ.data?.pages) return discoverQ.data.pages.flatMap((p) => p.results);
    if (popularQ.data?.results) return popularQ.data.results;
    return [];
  })(); // 모든 경우의 영화 목록

  let filtered = pages.filter((m) => m.title && m.release_date); // 기본 필터링
  if (genreId !== 'all') {
    filtered = filtered.filter((m) => m.genre_ids.includes(Number(genreId))); // 장르 필터
  }

  if (isSearch && filtered.length === 0 && popularQ.data?.results?.length) {
    filtered = popularQ.data.results; // 검색 결과 없으면 fallback
  }

  const sorted = filtered
    .filter((m) => m.release_date) // << 없으면 정렬 못하니까 제거
    .sort((a, b) => {
      if (sortOption === 'vote') return b.vote_average - a.vote_average;
      if (sortOption === 'popularity') return b.popularity - a.popularity;
      return new Date(b.release_date) - new Date(a.release_date);
    });

  const totalResults = isSearch
    ? searchQ.data?.pages[0]?.total_results || 0
    : discoverQ.data?.pages[0]?.total_results || popularQ.data?.results?.length || 0;
  const totalPages = Math.ceil(totalResults / pageSize); // 전체 페이지 수

  const current = sorted.slice((page - 1) * pageSize, page * pageSize); // 현재 페이지 영화
  page < 1;
  useEffect(() => {
    if ((page > totalPages && totalPages > 0) || page < 1) {
      toast.error('🚫 없는 페이지입니다. 첫 페이지로 이동합니다.', { id: 'page-error' });
      updateParams({ page: 1 });
      setPage(1);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (isSearch && current.length < page * pageSize && searchQ.hasNextPage) {
      searchQ.fetchNextPage(); // 다음 페이지 불러오기
    }
  }, [page, pageSize, current.length, isSearch, searchQ]);

  const updateParams = (updates) => {
    const np = new URLSearchParams(params);
    Object.entries(updates).forEach(([k, v]) => {
      if (v == null) np.delete(k);
      else np.set(k, v);
    });
    setParams(np);
  }; // URL 업데이트

  const reset = () => {
    setSortOption('popularity');
    setGenreId('all');
    setPage(1);
    setParams(new URLSearchParams());
  };

  useEffect(() => {
    const noResults =
      searchQ.isFetched &&
      !searchQ.isFetchingNextPage &&
      (searchQ.data?.pages[0]?.total_results === 0 || filtered.length === 0);

    if (isSearch && noResults) {
      toast.custom(<CustomToast message="🔍 검색결과가 없어 인기영화로 돌아갑니다!" />, {
        id: 'search-no-result',
      });
      reset();
    }
  }, [isSearch, searchQ.isFetched, searchQ.isFetchingNextPage, filtered.length]);

  if (
    !popularQ.isFetched ||
    (isSearch && !searchQ.isFetched) ||
    (!isSearch && !discoverQ.isFetched)
  ) {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (popularQ.isError || searchQ.isError || discoverQ.isError) {
    const e = popularQ.error || searchQ.error || discoverQ.error;
    return <div className="movie-error">🚨 {e.message}</div>;
  }

  console.log('🔎 discoverQ', discoverQ.data);
  console.log('🧮 filtered', filtered);
  console.log('✅ sorted', sorted);

  return (
    <div className="movie-page-layout">
      <aside className="movie-filter-panel">
        <div className="filter-box">
          <label className="filter-title">정렬 방식</label>
          <div className="mt-2 flex flex-wrap gap-2">
            <button onClick={reset} className="reset-btn">
              초기화
            </button>
            {['vote', 'popularity', 'release'].map((opt) => (
              <button
                key={opt}
                className={sortOption === opt ? 'active-radio' : 'radio-btn'}
                onClick={() => {
                  setSortOption(opt);
                  updateParams({ sort: opt, page: 1 });
                  setPage(1);
                }}
              >
                {opt === 'vote' ? '평점순' : opt === 'popularity' ? '인기순' : '최신순'}
              </button>
            ))}
          </div>
        </div>

        {/* 장르 필터 */}
        <div className="filter-box">
          <label className="filter-title">장르별 필터</label>
          <div className="genre-badge-group mt-2 flex flex-wrap gap-2">
            <button
              className={genreId === 'all' ? 'active-genre' : 'genre-btn'}
              onClick={() => {
                setGenreId('all');
                updateParams({ genre: null, page: 1 });
                setPage(1);
              }}
            >
              전체
            </button>
            {Object.entries(genreMap).map(([id, name]) => (
              <button
                key={id}
                className={genreId === id ? 'active-genre' : 'genre-btn'}
                onClick={() => {
                  setGenreId(id);
                  updateParams({ genre: id, page: 1 });
                  setPage(1);
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* 페이지 수 설정 */}
        <div className="filter-box">
          <label className="filter-title">페이지 당 개수</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              updateParams({ page: 1 });
              setPage(1);
            }}
            className="select-box mt-2"
          >
            {[5, 10, 15].map((n) => (
              <option key={n} value={n}>
                {n}개 보기
              </option>
            ))}
          </select>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="filter-box">
            <ReactPaginate
              pageCount={totalPages} // 전체 페이지
              forcePage={page - 1} // 현재 페이지 (0-based)
              onPageChange={({ selected }) => {
                if (selected < 0) return; // 음수 페이지 막기
                const np = selected + 1;
                setPage(np);
                updateParams({ page: np });
              }}
              previousLabel="<"
              nextLabel=">"
              breakLabel={null} // ... 생략
              pageRangeDisplayed={5} // << ✅ 핵심: 5개까지만 보여주기
              marginPagesDisplayed={0} // << ✅ 가장자리 페이지 제거
              containerClassName="pagination-container"
              pageClassName="pagination-page"
              activeClassName="pagination-active"
              previousClassName="pagination-nav"
              nextClassName="pagination-nav"
            />
          </div>
        )}
      </aside>

      {/* 영화 리스트 */}
      <section className="movie-grid-section">
        {sorted.length === 0 ? (
          <p className="movie-no-result-text">😕 해당 조건에 맞는 영화가 없습니다.</p>
        ) : (
          <div className="movie-grid">
            {current.map((m) => (
              <MovieDetailCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </section>

      <TopButton />
    </div>
  );
}
