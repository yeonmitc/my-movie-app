import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMovieStore } from '@/store/movieStore'
import ThemeToggle from '@/common/components/ThemeToggle'
import SearchIcon from '@mui/icons-material/Search'
import logo from '@/assets/logo.png'
import './Header.style.css'


export default function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const zustandSetQuery = useMovieStore((state) => state.setQuery)  
  
  const handleSearch = () => {
    if (query.trim()) {
      const encoded = encodeURIComponent(query.trim())
      navigate(`/movies?q=${encoded}`)
      zustandSetQuery(query.trim())
      setShowSearch(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <header className="site-header">
      <div className="site-header-inner justify-between">
        <Link to="/" className="site-header-logo">
          <img src={logo} alt="Site Logo" className="h-8 sm:h-10" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* ✅ 데스크탑용 검색창 */}
          <div className="hidden md:flex items-center gap-2">
            <input
              type="text"
              placeholder="영화 제목을 검색하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-input"
            />
            <button
              onClick={handleSearch}
              className="btn btn-animated px-4 py-2 text-sm"
            >
               <SearchIcon fontSize="medium" />
            </button>
          </div>

          {/* ✅ 모바일 아이콘 */}
          <button
            className="btn btn-animated md:hidden"
            onClick={() => setShowSearch(!showSearch)}
          >
            <SearchIcon fontSize="medium" />
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* ✅ 모바일용 검색창 */}
      {showSearch && (
        <div className="search-mobile-wrapper">
          <input
            type="text"
            placeholder="영화 제목을 검색하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          <button
            onClick={handleSearch}
            className="search-btn btn btn-animated w-full"
          >
            검색
          </button>
        </div>
      )}
    </header>
  )
}