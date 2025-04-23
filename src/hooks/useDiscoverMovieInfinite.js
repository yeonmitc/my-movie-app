import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/utils/api';

const sortMap = {
  vote: 'vote_average.desc',
  popularity: 'popularity.desc',
  release: 'release_date.desc',
};

const fetchDiscoverMovies = async ({ queryKey, pageParam = 1 }) => {
  const [, { genreId, sortOption }] = queryKey;
  const params = {
    sort_by: sortMap[sortOption] || sortMap.default,
    page: pageParam,
  };
  if (genreId) {
    params.with_genres = genreId;
  }
  const res = await api.get('/discover/movie', { params });
  return res.data;
};

export const useDiscoverMovieInfinite = ({ genreId, sortOption, enabled }) => {
  return useInfiniteQuery({
    queryKey: ['discover-movies', { genreId, sortOption }],
    queryFn: fetchDiscoverMovies,
    enabled,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5분
    cacheTime: 1000 * 60 * 10, // 10분
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};
