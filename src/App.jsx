import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/layout/AppLayout';
import MoviePage from '@/pages/Movies/MoviePage';

import HomePage from '@/pages/HomePage/HomePage';
import TestToast from '@/pages/TestToast';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import MovieDetailPage from './pages/MovieDetail/MovieDetailPage';

// 홈페이지  /
// 영화 전체보여주는 페이지 (서치)  /movies?q=ssdfa
// 영화 디테일 페이지 /movies/:id
// 추천영화 /movies/:id/recommandation
// 리뷰 /movies/:id/reviews

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/movies">
            <Route index element={<MoviePage />} />
            <Route path=":id" element={<MovieDetailPage />} />
          </Route>
        </Route>

        <Route path="/toast-test" element={<TestToast />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
