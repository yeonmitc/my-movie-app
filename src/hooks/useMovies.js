import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';

const validTypes = ['popular', 'top_rated', 'upcoming'];

const fetchMovies = async (type) => {
  if (!validTypes.includes(type)) {
    throw new Error(`❌ Invalid movie type: ${type}`);
  }

  const res = await api.get(`/movie/${type}`);
  return res.data; // ✅ results + total_pages
};

export const useMoviesQuery = (type) => {
  const queryClient = useQueryClient();


  return useQuery({
    queryKey: ['movies', type],
    queryFn: () => fetchMovies(type),
    initialData: () => queryClient.getQueryData(['movies', 'popular']),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};
