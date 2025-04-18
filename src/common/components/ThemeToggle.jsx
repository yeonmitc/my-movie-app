import React from 'react'
import useThemeStore from '@/store/themeStore'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  return (
    <button
      onClick={toggleTheme}
      className="btn btn-animated btn-toggle"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}