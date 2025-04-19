// src/AppProvider.jsx
import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useThemeStore from '@/store/themeStore'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ToastManager from '@/common/components/ToastManager'; 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

export default function AppProvider({ children }) {
  const { theme, setTheme } = useThemeStore()  // ← setTheme 추가

  // ① 초기 로드 시: localStorage 또는 시스템 선호도 기반 초기 테마 설정
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    } else {
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [setTheme])

  // ② theme 값이 바뀔 때: <html> 클래스 토글 & 로컬스토리지에 저장
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [theme])

  return (

      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
        <ToastManager />
        <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-right' />
      </QueryClientProvider>
  )
}