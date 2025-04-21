import { create } from 'zustand';

export const useGenreStore = create((set) => ({
  genreMap: {},

  setGenreMap: (map) => set({ genreMap: map }),
}));