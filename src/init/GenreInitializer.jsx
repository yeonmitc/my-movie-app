import { useEffect } from 'react';

import { useGenreStore } from '@/store/genreStore';
import { useMovieGenreQuery } from '@/hooks/useMovieGenre';

export default function GenreInitializer() {
  const { data: genres } = useMovieGenreQuery();
  const setGenreMap = useGenreStore((s) => s.setGenreMap);

  // 장르 id 에서 장르 name 값을 찾아서 GenreMap으로 만들어줌
  useEffect(() => {
    if (genres) {
      const map = {};
      genres.forEach((g) => {
        map[g.id] = g.name;
      });
      setGenreMap(map);
    }
  }, [genres]);

  return null;
}
