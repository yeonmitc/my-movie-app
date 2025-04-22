import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from '@/config/queryClient';
import '@/config/persistConfig'; // 캐시 영속화 설정

import ThemeInitializer from '@/init/ThemeInitializer';
import GenreInitializer from '@/init/GenreInitializer';
import PopularMoviesInitializer from '@/init/PopularMoviesInitializer';

import ToastManager from '@/common/components/ToastManager';

export default function AppProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeInitializer />
        <PopularMoviesInitializer />
        <GenreInitializer />
        {children}
      </BrowserRouter>
      <ToastManager />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
