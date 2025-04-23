import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';

const fetchSearchMovie = async ({ keyword, page = 1 }) => {
  const res = await api.get(`/search/movie`, {
    params: {
      query: keyword,
      page,
    },
  });
  // return res.data.results;
  return res.data; //  includes: results, total_results, total_pages, etc.
};

export const useSearchMovieQuery = ({ keyword, page = 1, enabled }) => {
  return useQuery({
    queryKey: ['movie-search', keyword, page],
    queryFn: () => fetchSearchMovie({ keyword, page }),
    enabled,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });
};
