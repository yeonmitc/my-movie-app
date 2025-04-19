import { create } from 'zustand'

export const useMovieStore = create((set, get) => ({
  allMovies: [],
  query: '',

  setAllMovies: (movies) => set({ allMovies: movies }),
  setQuery: (query) => set({ query }),

  // ✅ 항상 최신 상태를 기준으로 필터된 movies를 계산해서 저장
  get filteredMovies() {
    const { allMovies, query } = get()
    const q = query.toLowerCase()
    return allMovies.filter(
      (movie) =>
        movie.title?.toLowerCase().includes(q) ||
        movie.original_title?.toLowerCase().includes(q)
    )
  }
}))