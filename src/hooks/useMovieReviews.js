import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';

const fetchMovieReviews = async (movieId) => {
  if (!movieId) throw new Error('영화 ID가 필요합니다.');
  const res = await api.get(`/movie/${movieId}/reviews`, {
    params: {
      language: 'en-US',
    },
  });
  return res.data.results;
};

const useMovieReviewsQuery = (movieId) => {
  return useQuery({
    queryKey: ['movie-reviews', movieId],
    queryFn: () => fetchMovieReviews(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

export default useMovieReviewsQuery;
