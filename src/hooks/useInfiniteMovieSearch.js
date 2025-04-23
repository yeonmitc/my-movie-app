import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/utils/api';

const fetchSearchMovie = async ({ queryKey, pageParam = 1 }) => {
  const [_key, keyword] = queryKey;
  const res = await api.get('/search/movie', {
    params: {
      query: keyword,
      page: pageParam,
    },
  });
  return res.data; // results + total_pages 포함
};

export const useSearchMovieInfinite = (keyword, enabled) => {
  return useInfiniteQuery({
    queryKey: ['movie-search', keyword],
    queryFn: fetchSearchMovie,
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });
};
