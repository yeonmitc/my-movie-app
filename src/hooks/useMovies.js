import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";

const validTypes = ["popular", "top_rated", "upcoming"];

const fetchMovies = async (type) => {
  if (!validTypes.includes(type)) {
    throw new Error(`❌ Invalid movie type: ${type}`);
  }

  const res = await api.get(`/movie/${type}`);
  return res.data.results;
};


export const useMoviesQuery = (type) => {
  const queryClient = useQueryClient();

  const initialDataFromCache = queryClient.getQueryData(["movies", type]);

  return useQuery({
    queryKey: ["movies", type],
    queryFn: () => fetchMovies(type),
    initialData: initialDataFromCache, // ✅ 캐시 초기값 사용
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};