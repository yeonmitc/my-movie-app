import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '@/common/components/ThemeToggle';
import SearchIcon from '@mui/icons-material/Search';
import logo from '@/assets/logo.png';
import './Header.style.css';
import toast from 'react-hot-toast';

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = query.trim();

    if (!trimmed) {
      toast.error('검색어를 입력해주세요!');
      setQuery('');
      return;
    }

    navigate(`/movies?q=${encodeURIComponent(trimmed)}`);
    setShowSearch(false);
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

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
  );

  return (
    <header className="site-header">
      <div className="site-header-inner justify-between">
        <Link to="/" className="site-header-logo" aria-label="홈으로 이동">
          <img src={logo} alt="Site Logo" className="hidden h-8 sm:h-10 md:block" />
          <img src="/small-logo.png" alt="Mobile Logo" className="block h-8 sm:h-10 md:hidden" />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          {/* ✅ 데스크탑용 검색창 */}
          <div className="hidden items-center gap-2 md:flex">
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
          <Link to="/movies" className="btn btn-animated">
            <span className="text-lg">🎬</span>
          </Link>

          <ThemeToggle />
        </nav>
      </div>

      {/* ✅ 모바일용 검색창 */}
      {showSearch && (
        <div className="search-mobile-wrapper">
          {SearchInput}
          <button
            onClick={handleSearch}
            aria-label="검색 버튼"
            className="btn btn-animated search-btn m-2 w-full"
          >
            Search
          </button>
        </div>
      )}
    </header>
  );
}
