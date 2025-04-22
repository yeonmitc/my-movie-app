import { create } from 'zustand';

export const useVideoModalStore = create((set) => ({
  isOpen: false,
  videoId: null,

  openModal: (videoId) => set({ isOpen: true, videoId }),
  closeModal: () => set({ isOpen: false, videoId: null }),
}));
