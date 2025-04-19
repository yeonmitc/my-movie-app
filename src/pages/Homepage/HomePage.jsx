// src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import Banner from '@/pages/HomePage/components/Banner/Banner';


//배너 => 인기영화 중에 랜덤(혹은 첫번째 아이템 )으로 배너에 보여주기 
// 1.인기 영화 => api 호출하기
// 2. 평점 높은 영화 
// 3. 개봉 예정 영화 

export default function HomePage() {
  return (

    <main className="min-h-screen transition-colors duration-300">

      <div>
      <Banner />
    </div>

      {/* 여기 안에 banner 들어감 
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">
        🎬 Welcome to Yeon Netflix
      </h1>

      <p className="mb-6">
        Browse movies, shows, and enjoy personalized recommendations.
      </p>

      <Link to="/movies">
        <button className="btn btn-explore btn-animated text-lg">
          EXPLORE NOW
        </button>
      </Link>
    </div> */}
  </main>
  )
}
