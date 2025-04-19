import React from 'react'
import { Link } from 'react-router-dom'
import './NotFoundPage.style.css'

export default function NotFoundPage() {
  return (
<div className="notfound-page">
  <div className="notfound-content">
    <h2 className="notfound-title">404</h2>
    <p className="notfound-text">존재하지 않는 에러입니다</p>
    <Link to="/">
      <button className="btn btn-animated btn-back btn-mobile">Back to Home</button>
    </Link>
  </div>
</div>

  )
}