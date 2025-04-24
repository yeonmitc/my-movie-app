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
  const [pageSize, setPageSize] = useState(window.innerWidth < 640 ? 4 : 6);
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
    if (discoverQ?.data?.pages) return discoverQ.data.pages.flatMap((p) => p.results);
    if (popularQ.data?.results) return popularQ.data.results;
    return [];
  })();

  // 필터링 단계에서는 title만 체크
  let filtered = pages.filter((m) => m.title);

  //장르필터
  if (genreId !== 'all') {
    filtered = filtered.filter(
      (m) => Array.isArray(m.genre_ids) && m.genre_ids.includes(Number(genreId))
    );
  }

  // 정렬은 release_date 있는 항목 기준으로
  const sorted = filtered.slice().sort((a, b) => {
    if (sortOption === 'vote') return b.vote_average - a.vote_average;
    if (sortOption === 'popularity') return b.popularity - a.popularity;
    if (sortOption === 'release') {
      const aDate = a.release_date ? new Date(a.release_date) : new Date('1900-01-01');
      const bDate = b.release_date ? new Date(b.release_date) : new Date('1900-01-01');
      return bDate - aDate;
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages); // 1 이상, totalPages 이하
  const current = sorted.slice((safePage - 1) * pageSize, safePage * pageSize); // 실제 렌더링된 페이지

  useEffect(() => {
    if (page > totalPages) {
      toast.error('🚫 없는 페이지입니다. 첫 페이지로 이동합니다.', { id: 'page-error' });
      updateParams({ page: 1 });
      setPage(1);
    }
  }, [page, totalPages]);

  useEffect(() => {
    const totalFetched = discoverQ.data?.pages?.flatMap((p) => p.results).length || 0;
    const isFull = totalFetched >= page * pageSize;

    if (!isSearch && discoverQ?.hasNextPage && !isFull && !discoverQ?.isFetchingNextPage) {
      discoverQ.fetchNextPage();
    }

    if (isSearch && searchQ?.hasNextPage && !isFull && !searchQ?.isFetchingNextPage) {
      searchQ.fetchNextPage();
    }
  }, [page, pageSize, isSearch, discoverQ, searchQ]);

  const updateParams = (updates) => {
    const np = new URLSearchParams(params);
    Object.entries(updates).forEach(([k, v]) => {
      if (v == null) np.delete(k);
      else np.set(k, v);
    });
    setParams(np);
  }; // URL 업데이트

  const reset = () => {
    setGenreId('all');
    setPage(1);
    setParams(new URLSearchParams());
  };

  // 검색 결과 없음 → fallback
  const noSearchResult =
    isSearch &&
    searchQ.isFetched &&
    !searchQ.isFetchingNextPage &&
    searchQ.data?.pages?.[0]?.total_results === 0;

  // 👉 fallback은 "서버 검색 결과가 아예 없을 때"만 동작해야 함
  useEffect(() => {
    if (noSearchResult) {
      toast.custom(<CustomToast message="🔍 검색결과가 없어 인기영화로 돌아갑니다!" />, {
        id: 'search-no-result',
      });
      reset();
    }
  }, [noSearchResult]);

  // 로딩 & 에러 처리
  if (
    !popularQ.isFetched ||
    (isSearch && !searchQ.isFetched) ||
    (!isSearch && !discoverQ?.isFetched)
  ) {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (popularQ.isError || searchQ.isError || discoverQ?.isError) {
    const err = popularQ.error || searchQ.error || discoverQ?.error;
    return <div className="movie-error">🚨 {err.message}</div>;
  }

  // console.log('🔎 discoverQ', discoverQ?.data);
  // console.log('🧮 filtered', filtered);
  // console.log('✅ sorted', sorted);

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
            {[1, 6, 9].map((n) => (
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
              forcePage={safePage - 1} // 실제 렌더링페이지
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
            {current.map((movie) => (
              <MovieDetailCard key={movie.id} movie={movie} />
            ))}
            {!isSearch && discoverQ?.isFetchingNextPage && (
              <div className="loading-wrapper">
                <div className="loading-spinner" />
              </div>
            )}
          </div>
        )}
      </section>

      <TopButton />
    </div>
  );
}
