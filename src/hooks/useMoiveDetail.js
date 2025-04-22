import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api'; // ✅ 기존 axios instance

const fetchMovieDetail = async (id) => {
  const res = await api.get(`/movie/${id}`);
  return res.data;
};

export const useMovieDetailQuery = (id) => {
  return useQuery({
    queryKey: ['movie-detail', id],
    queryFn: () => fetchMovieDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
