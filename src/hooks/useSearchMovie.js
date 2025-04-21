import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';

const fetchSearchMovie = async ({ keyword }) => {
  const res = await api.get(`/search/movie?query=${keyword}`);
  console.log('🎯 fetchSearchMovie keyword:', keyword);
  console.log('📦 fetchSearchMovie data:', res.data.results);
  return res.data.results;
};

export const useSearchMovieQuery = ({ keyword, enabled }) => {
  return useQuery({
    queryKey: ['movie-search', keyword],
    queryFn: () => fetchSearchMovie({ keyword }), // ✅ keyword 객체로 넘겨야 구조분해 가능주의!!
    enabled,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });
};
