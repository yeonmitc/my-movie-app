import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';

export default function PopularMoviesInitializer() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchAndSetPopular = async () => {
      try {
        const res = await api.get('/movie/popular');
        const popularMovies = res.data.results;
       //  popular movies를 캐시에 등록
        queryClient.setQueryData(['movies', 'popular'], popularMovies); 
      } catch (error) {
        console.error('🔥 인기영화 가져오는거 실패함 :', error);
      }
    };

    fetchAndSetPopular();
  }, [queryClient]);

  return null; // UI 없음
}