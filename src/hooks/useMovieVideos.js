import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';

const fetchMovieVideos = async (movieId) => {
  const res = await api.get(`/movie/${movieId}/videos`, {
    params: {
      language: 'en-US',
    },
  });
  return res.data.results;
};

export const useMovieVideosQuery = (movieId) => {
  return useQuery({
    queryKey: ['movie-videos', movieId],
    queryFn: () => fetchMovieVideos(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5,
  });
};
