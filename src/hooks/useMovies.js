import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

// API 별 fetcher
const validTypes = ["popular", "top_rated", "upcoming"];

const fetchMovies = (type) => {
  if (!validTypes.includes(type)) {
    throw new Error(`❌ Invalid movie type: ${type}`);
  }

  return api
    .get(`/movie/${type}`)
    .then((res) => res.data.results);
};

// 통합 훅
export const useMoviesQuery = (type) =>
  useQuery({
    queryKey: ["movies", type],
    queryFn: () => fetchMovies(type),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });