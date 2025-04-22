import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';

const fetchDiscoverMovies = async ({ genreId, sortOption }) => {
  const sortMap = {
    vote: 'vote_average.desc',
    popularity: 'popularity.desc',
    release: 'release_date.desc',
    default: 'popularity.desc',
  };

  const res = await api.get('/discover/movie', {
    params: {
      with_genres: genreId,
      sort_by: sortMap[sortOption] || sortMap.default,
    },
  });

  return res.data.results;
};

export const useDiscoverMovieQuery = ({ genreId, sortOption, enabled }) => {
  return useQuery({
    queryKey: ['discover-movies', genreId, sortOption],
    queryFn: () => fetchDiscoverMovies({ genreId, sortOption }),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
