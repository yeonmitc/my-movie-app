import axios from 'axios';

// 환경변수에서 API 기본 URL을 가져오고, 없으면 로컬호스트 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_API_KEY;

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,                    // 요청 타임아웃 (ms)
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
});


// 응답 인터셉터: 응답 데이터만 반환, 에러는 공통 처리
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error('[API Error]', error.response.status, error.response.data);
    } else {
      console.error('[Network Error]', error);
    }
    return Promise.reject(error);
  }
);

export default api;
