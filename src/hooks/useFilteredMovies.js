import { useMovieStore } from '@/store/movieStore'

export const useFilteredMovies = () => {
  const query = useMovieStore((state) => state.query)
  const allMovies = useMovieStore((state) => state.allMovies)

  return allMovies.filter((movie) =>
    movie.title?.toLowerCase().includes(query.toLowerCase()) ||
    movie.original_title?.toLowerCase().includes(query.toLowerCase())
  )
}