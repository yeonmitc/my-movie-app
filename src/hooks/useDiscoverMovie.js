import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';

const fetchDiscoverMovies = async ({ genreId, sortOption, page = 1 }) => {
  const sortMap = {
    vote: 'vote_average.desc',
    popularity: 'popularity.desc',
    release: 'release_date.desc',
    default: 'popularity.desc',
  };

  const params = {
    sort_by: sortMap[sortOption] || sortMap.default,
    page,
    vote_count_gte: sortOption === 'vote' ? 100 : undefined, // 🔥 조건부 필터
  };

  if (genreId) {
    params.with_genres = genreId;
  }

  const res = await api.get('/discover/movie', { params });
  return res.data; // ✅ results + total_pages
};

export const useDiscoverMovieQuery = ({ genreId, sortOption, page = 1, enabled }) => {
  return useQuery({
    queryKey: ['discover-movies', genreId, sortOption, page],
    queryFn: () => fetchDiscoverMovies({ genreId, sortOption, page }),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
