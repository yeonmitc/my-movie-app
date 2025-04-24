import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchRecommendedMovies = async ({ movieId, language = 'en-US', page = 1 }) => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}/recommendations`,
    {
      params: { language, page },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const useRecommendedMoviesQuery = ({ movieId, language, page }) => {
  return useQuery({
    queryKey: ['recommendedMovies', movieId, language, page],
    queryFn: () => fetchRecommendedMovies({ movieId, language, page }),
    enabled: !!movieId,
  });
};
