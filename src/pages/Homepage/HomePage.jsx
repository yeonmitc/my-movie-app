// src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (

    <main className="min-h-screen transition-colors duration-300">
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
    </div>
  </main>
  )
}
