import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '@/common/components/ThemeToggle'
import SearchIcon from '@mui/icons-material/Search'
import logo from '@/assets/logo.png'

export default function Header() {
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-header-logo text-lg sm:text-xl">
        <img src={logo} alt="Site Logo" className="h-8 sm:h-10" />
        </Link>
        <Link to="/movies"  >
          <h4 className="site-header-menu btn-animated"> Movies </h4>
        </Link>


        

        <div className="flex-1 mx-4 hidden md:block">
          <input
            type="text"
            placeholder="영화 제목을 검색하세요"
            className="input w-full"
          />
        </div>

        <button
          className="btn btn-animated"
          onClick={() => setShowMobileSearch((prev) => !prev)}
          aria-label="검색 열기"
        >
          <SearchIcon fontSize="medium" />
        </button>

        <ThemeToggle />
      </div>

      {showMobileSearch && (
        <div className="px-4 py-2 md:hidden animate-fade-in-down">
          <input
            type="text"
            placeholder="영화 제목을 검색하세요"
            className="input mobile"
          />
        </div>
      )}
      
    </header>
  )
}