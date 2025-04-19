import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '@/common/components/ThemeToggle'
import SearchIcon from '@mui/icons-material/Search'
import logo from '@/assets/logo.png'
import './Header.style.css'

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    const trimmed = query.trim()
    if (trimmed) {
      navigate(`/movies?q=${encodeURIComponent(trimmed)}`)
      setShowSearch(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const SearchInput = (
      <input
        type="text"
        placeholder="영화 제목을 검색하세요"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="search-input"
        aria-label="검색어 입력"
      />
  )

  return (
    <header className="site-header">
      <div className="site-header-inner justify-between">
        <Link to="/" className="site-header-logo" aria-label="홈으로 이동">
          <img src={logo} alt="Site Logo" className="h-8 sm:h-10" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* ✅ 데스크탑용 검색창 */}
          <div className="hidden md:flex items-center gap-2">
            {SearchInput}
                  <button
              onClick={handleSearch}
              className="btn btn-animated px-4 py-2 text-sm"
              aria-label="검색 버튼"
            >
                         <SearchIcon fontSize="medium" />
            </button>

          </div>

          {/* ✅ 모바일용 토글 버튼 */}
          <button
            className="btn btn-animated md:hidden"
            onClick={() => setShowSearch((prev) => !prev)}
            aria-label="모바일 검색창 열기"
          >
            <SearchIcon fontSize="medium" />
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* ✅ 모바일용 검색창 */}
      {showSearch && (
        <div className="search-mobile-wrapper">
          {SearchInput}
          <button
        onClick={handleSearch}
        aria-label="검색 버튼"
        className="btn btn-animated w-full search-btn "
      >
        Search
      </button>
          
        </div>
      )}
    </header>
  )
}
