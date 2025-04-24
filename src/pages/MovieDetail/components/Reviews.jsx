import React, { useState } from 'react';
import './Reviews.style.css';

const Review = ({ author, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 500;
  const isLong = content.length > MAX_LENGTH;
  const displayedContent = isExpanded ? content : content.slice(0, MAX_LENGTH);

  return (
    <div className="review-card">
      <div className="review-author">✍️ {author}</div>
      <p className="review-content">
        {displayedContent}
        {isLong && (
          <button className="review-toggle" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '접기' : '더보기'}
          </button>
        )}
      </p>
    </div>
  );
};

const Reviews = ({ reviews }) => {
  return reviews && reviews.length > 0 ? (
    reviews.map((review) => (
      <Review key={review.id} author={review.author} content={review.content} />
    ))
  ) : (
    <div className="review-card">
      <p className="no-review-msg">해당 영화는 리뷰가 없습니다.</p>
    </div>
  );
};

export default Reviews;
