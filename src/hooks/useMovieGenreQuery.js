// src/hooks/useMovieGenreQuery.js
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api'; // axios 인스턴스

const fetchMovieGenre = async () => {
  const res = await api.get('/genre/movie/list');
  return res.data.genres;
};

export const useMovieGenreQuery = () =>
  useQuery({
    queryKey: ['movie-genre'],
    queryFn: fetchMovieGenre,
    staleTime: Infinity,   // 앱 실행 중에는 fresh 상태 유지
    gcTime: Infinity,      // 캐시 삭제 안 함
    refetchOnWindowFocus: false,
  });