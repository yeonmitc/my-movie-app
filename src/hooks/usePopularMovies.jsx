import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { useMovieStore } from "@/store/movieStore";

const fetchPopularMovies = async () => {
  const response = await api.get('/movie/popular')
  console.log('🎬 TMDB 응답:', response.data)
  return response.data.results
}

// ✅ Hook은 최상단에서 export
export const usePopularMoviesQuery = () => {
  const setAllMovies = useMovieStore((state) => state.setAllMovies);

  return  useQuery({
    queryKey: ['movie-popular'],
    queryFn: async () => {
      const movies = await fetchPopularMovies()
      setAllMovies(movies)         // ✅ 상태 저장은 여기서 처리
      return movies
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}