import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
  params: {
    language: 'ko-KR', // ✅ 모든 요청에 한국어 적용
  },
});

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
