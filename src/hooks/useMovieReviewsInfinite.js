import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/utils/api';

const fetchMovieReviews = async ({ queryKey, pageParam = 1 }) => {
  const [, movieId] = queryKey;
  if (!movieId) throw new Error('영화 ID가 필요합니다.');
  const res = await api.get(`/movie/${movieId}/reviews`, {
    params: {
      page: pageParam,
      language: 'en-US',
    },
  });

  return res.data;
};

export const useMovieReviewsInfiniteQuery = (movieId) =>
  useInfiniteQuery({
    queryKey: ['movie-reviews', movieId],
    queryFn: fetchMovieReviews,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
